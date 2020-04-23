const socket = io();
const board = new BoardView();
const userOptions = new UserOptions();
let myPlayer;
let currentPlayer;

socket.on('init', ({ enemyJoined }) => {
    userOptions.renderChoosePlayer(join);
    if (enemyJoined) {
        userOptions.disableBtns('.evil');
    }
});

const join = (good) => {
    socket.emit('player joined', ({ good }));
    userOptions.renderStartGame(startGame);
}

socket.on('disable join as evil', () => {
    userOptions.disableBtns('.evil');
});

const startGame = () => {
    userOptions.clear();
    socket.emit('start');
}

socket.on('set up player', ({ id, home, key, goal, isEvil }) => {
    myPlayer = new Player(id, home, key, goal, isEvil);
    currentPlayer = myPlayer;
});

socket.on('set up enemy', ({ startPositions }) => {
    myPlayer = {
        e1: new Enemy('e1', startPositions[0]),
        e2: new Enemy('e2', startPositions[1]),
        isEvil: true,
    };
    currentPlayer = myPlayer.e1;
});

socket.on('update board', ({ players, soundTokens, sightTokens, enemyPaths, reachablePositions }) => {
    if (myPlayer) {
        board.activePlayer = currentPlayer;
        board.players = players;
        board.soundTokens = soundTokens;
        board.sightTokens = sightTokens;
        board.e1Path = enemyPaths[0];
        board.e2Path = enemyPaths[1];
        board.reachablePositions = reachablePositions;
        board.renderBoard();
    }
});

socket.on('players turn', ({ resetPosition, caughtPlayers }) => {
    if (myPlayer.isEvil) {
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
        userOptions.disableBtns();
    } else {
        if (resetPosition) {
            myPlayer.position = resetPosition;
            board.renderBoard();
        }
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
        if (caughtPlayers.includes(myPlayer.id)) {
            userOptions.renderCaughtInstr();
            socket.emit('player selects pace', ({ pace: 'walk' }));
        }
    }
});

const selectPace = (pace) => {
    if (myPlayer.isEvil) {
        socket.emit('enemy selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run'], pace, 'disabled');
    } else {
        socket.emit('player selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run'], pace, 'disabled');
    }
}

socket.on('possible steps', ({ possibleSteps, visible, stepsLeft }) => {
    //if player && visible, warning
    if (myPlayer.isEvil && stepsLeft <= 1) {
        askToConfirmDestination();
        userOptions.removeBtn('.back');
    } else if (!myPlayer.isEvil && !possibleSteps.length) {
        askToConfirmDestination();
    }
    board.reachablePositions = possibleSteps;
    board.renderBoard();
    board.addListener(takeStep, possibleSteps);
});

const askToConfirmDestination = () => {
    board.reachablePositions = [];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(confirmDestination, resetSteps);
}

const takeStep = (position, possibleSteps) => {
    if (currentPlayer.position.neighbours.includes(position.id) && possibleSteps.find(pos => pos.id === position.id)) {
        currentPlayer.position = position;
        if (myPlayer.isEvil) {
            socket.emit('enemy takes step', { position });
        } else {
            socket.emit('player takes step', { position });
            askToConfirmDestination();
        }
    }
}

const confirmDestination = () => {
    if (myPlayer.isEvil) {
        socket.emit('enemy move completed');
    } else {
        socket.emit('player move completed');
    }
    userOptions.disableBtns();
}

const resetSteps = () => {
    board.reachablePositions = [];
    board.renderBoard();
    socket.emit('player reset move');
}

socket.on('update player', ({ hasKey, hasGoal, visible }) => {
    myPlayer.hasKey = hasKey;
    myPlayer.hasGoal = hasGoal;
    myPlayer.visible = visible;
});

socket.on('player select token', ({ heardTo, id, turn }) => {
    if (id === myPlayer.id) {
        board.soundTokens = heardTo;
        board.renderBoard();
        board.addListener(playerPlaceToken, turn, heardTo);
        userOptions.renderTokenInstr();
    }
});

const playerPlaceToken = (position, turn, heardTo) => {
    if (heardTo.find(pos => pos.id === position.id)) {
        board.soundTokens = [position];
        board.renderBoard();
        userOptions.clear();
        socket.emit('player placed token', { position, turn });
    }
}

socket.on('enemy turn', () => {
    if (myPlayer.isEvil) {
        userOptions.renderSelectEnemyBtns(selectEnemy);
    } else {
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
        userOptions.disableBtns();
    }
});

const selectEnemy = (enemyID) => {
    currentPlayer = myPlayer[enemyID];
    socket.emit('select enemy', { enemyID });
    userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
}

socket.on('next enemy turn', () => {
    if (currentPlayer.id === 'e1') {
        selectEnemy('e2');
    } else {
        selectEnemy('e1');
    }
});

socket.on('choose new path', ({ paths }) => {
    showBtnsSelectPath(paths);
});

const showBtnsSelectPath = (paths) => {
    userOptions.renderChoosePath(paths, showSelectedPath);
}

const showSelectedPath = (paths, num) => {
    board[currentPlayer.id.concat('Path')] = paths[num];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(selectPath, showBtnsSelectPath, paths, paths[num]);
}

const selectPath = (path) => {
    userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
    userOptions.disableBtns();
    socket.emit('select path', { path });
}