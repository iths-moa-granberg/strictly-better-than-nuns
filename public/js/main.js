const socket = io();
const board = new BoardView();
const userOptions = new UserOptions();
let myPlayer;

socket.on('join', ({ enemyJoined }) => {
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

socket.on('init', ({ id, home, key, goal, isEvil }) => {
    myPlayer = new Player(id, home, key, goal, isEvil);
});

socket.on('update board', ({ players, soundTokens, sightTokens, enemyPath, reachablePositions }) => {
    if (myPlayer) {
        board.activePlayer = myPlayer;
        board.players = players;
        board.soundTokens = soundTokens;
        board.sightTokens = sightTokens;
        board.enemyPath = enemyPath;
        board.reachablePositions = reachablePositions;
        board.renderBoard();
    }
});

socket.on('players turn', ({ resetPosition, caughtPlayers }) => {
    if (!myPlayer.isEvil) {
        if (resetPosition) {
            myPlayer.position = resetPosition;
            board.renderBoard();
        }
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
        if (caughtPlayers.includes(myPlayer.id)) {
            userOptions.renderCaughtInstr();
            socket.emit('player selects pace', ({ pace: 'walk' }));
        }
    } else {
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
        userOptions.disableBtns();
    }
});

const selectPace = (pace) => {
    if (!myPlayer.isEvil) {
        socket.emit('player selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run'], pace, 'disabled');
    } else {
        socket.emit('enemy selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run'], pace, 'disabled');
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
    board.addStepListener(board.activePlayer.position, possibleSteps, takeStep);
});

const askToConfirmDestination = () => {
    board.reachablePositions = [];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(confirmDestination, resetSteps);
}

const takeStep = (position) => {
    board.activePlayer.position = position;
    if (myPlayer.isEvil) {
        socket.emit('enemy takes step', { position });
    } else {
        socket.emit('player takes step', { position });
        askToConfirmDestination();
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
        board.addTokenListener(heardTo, playerPlaceToken, turn);
        userOptions.renderTokenInstr();
    }
});

const playerPlaceToken = (position, turn) => {
    board.soundTokens = [position];
    board.renderBoard();
    userOptions.clear();
    socket.emit('player placed token', { position, turn });
}

socket.on('enemy turn', () => {
    if (myPlayer.isEvil) {
        userOptions.enableBtns();
    } else {
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
        userOptions.disableBtns();
    }
});

socket.on('choose new path', ({ paths }) => {
    showBtnsSelectPath(paths);
});

const showBtnsSelectPath = (paths) => {
    userOptions.renderChoosePath(paths, showSelectedPath);
}

const showSelectedPath = (paths, num) => {
    board.enemyPath = paths[num];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(selectPath, showBtnsSelectPath, paths);
}

const selectPath = () => {
    let path = board.enemyPath;
    socket.emit('select path', { path });
}