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

socket.on('disable join as evil', ({ }) => {
    userOptions.disableBtns('.evil');
});

const startGame = () => {
    userOptions.clear();
    socket.emit('start', ({}));
}

socket.on('init', ({ id, home, key, goal }) => {
    myPlayer = new Player(id, home, key, goal);
});

socket.on('update board', ({ players, soundTokens, sightTokens, enemyPath, reachablePositions }) => {
    board.activePlayer = myPlayer;
    board.players = players;
    board.soundTokens = soundTokens;
    board.sightTokens = sightTokens;
    board.enemyPath = enemyPath;
    board.reachablePositions = reachablePositions;
    board.renderBoard();
});

socket.on('players turn', ({ position }) => {
    if (myPlayer.id != 'enemy') {
        if (position) {
            myPlayer.position = position;
            board.renderBoard();
        }
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
    } else {
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
        userOptions.disableBtns();
    }
});

const selectPace = (pace) => {
    if (myPlayer.id != 'enemy') {
        socket.emit('player selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run'], pace, 'disabled');
    } else {
        socket.emit('enemy selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run'], pace, 'disabled');
    }
}

socket.on('possible steps', ({ endups, visible }) => {
    //if player && visible, warning
    board.reachablePositions = endups;
    board.renderBoard();
    board.addStepListener(board.activePlayer.position, endups, takeStep);
});

const takeStep = (position) => {
    userOptions.disableBtns();
    board.activePlayer.position = position;
    if (myPlayer.id != 'enemy') {
        socket.emit('player takes step', { position });
    } else {
        socket.emit('enemy takes step', { position });
    }
}

socket.on('player out of steps', ({ }) => {
    board.reachablePositions = [];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(playerConfirmDestination, playerResetSteps);
});

const playerConfirmDestination = () => {
    socket.emit('player move completed', {});
    userOptions.disableBtns();
}

const playerResetSteps = () => {
    socket.emit('player reset move', {});
}

socket.on('update player', ({ hasKey, hasGoal, visible }) => {
    myPlayer.hasKey = hasKey;
    myPlayer.hasGoal = hasGoal;
    myPlayer.visible = visible;
});

socket.on('player choose token', ({ heardTo }) => {
    board.soundTokens = heardTo;
    board.renderBoard();
    board.addTokenListener(heardTo, playerPlaceToken);
    userOptions.renderTokenInstr();
});

const playerPlaceToken = (position) => {
    board.soundTokens = [position];
    board.renderBoard();
    userOptions.clear();
    socket.emit('player place token', { position });
}

socket.on('enemy turn', ({ }) => {
    if (myPlayer.id === 'enemy') {
        userOptions.enableBtns();
    } else {
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
        userOptions.disableBtns();
    }
});