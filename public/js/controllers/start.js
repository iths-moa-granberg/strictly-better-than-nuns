let startScreen;
let games = [];
let user = {};
let joinedGame = false;

socket.on('start screen', ({ openGames }) => {
    games = openGames;
    startScreen = new StartScreen();
    startScreen.renderInputUsername(showGames, games);
});

const showGames = input => {
    user.username = input;
    user.userID = input + '_' + Math.random().toString(36).substr(2, 9);
    startScreen.renderShowGames(games, joinGame, newGame);
}

const newGame = () => {
    joinedGame = true;
    socket.emit('init new game', ({ user }));
}

const joinGame = gameID => {
    joinedGame = true;
    socket.emit('join game', ({ gameID, user }));
}

socket.on('update open games', ({ openGames }) => {
    games = openGames;
    if (Object.keys(user).length && !joinedGame) {
        startScreen.renderShowGames(games, joinGame, newGame);
    }
});

socket.on('disable join as evil', () => {
    userOptions.disableBtns('.evil');
});

socket.on('init', ({ enemyJoined }) => {
    startScreen.renderGameSetup();
    userOptions = new UserOptions();
    userOptions.renderChoosePlayer(join);
    if (enemyJoined) {
        userOptions.disableBtns('.evil');
    }
});

const join = (good) => {
    socket.emit('player joined', ({ good, user }));
    userOptions.renderWaiting('waiting for all players to choose role');
}

socket.on('waiting for players', ({ enemyJoined }) => {
    if (myPlayer) {
        userOptions.renderWaiting('waiting for all players to choose role');
    } else {
        userOptions.renderChoosePlayer(join);
        if (enemyJoined) {
            userOptions.disableBtns('.evil');
        }
    }
});

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

socket.on('players ready', () => {
    userOptions.renderStartGame(startGame);
});

const startGame = () => {
    userOptions.clear();
    socket.emit('start');
}