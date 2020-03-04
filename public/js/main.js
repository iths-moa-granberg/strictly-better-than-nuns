const socket = io();
const board = new BoardView();
const userOptions = new UserOptions();
let myPlayer;

socket.on('init', ({ id, home, key, goal }) => {
    myPlayer = new Player(id, home, key, goal);
});

socket.on('update board', ({ players, tokens, enemyPath, reachablePositions }) => {
    board.activePlayer = myPlayer;
    board.players = players;
    board.tokens = tokens;
    board.enemyPath = enemyPath;
    board.reachablePositions = reachablePositions;
    board.renderBoard();
});

socket.on('players turn', ({ }) => {
    //if player
    userOptions.renderPaceBtns(playerChoosesPace);
});

const playerChoosesPace = (pace) => {
    socket.emit('player chooses pace', ({ pace }));
    userOptions.renderPaceBtns(playerChoosesPace, pace, 'disabled');
}

socket.on('player possible steps', ({ endups, visible }) => {
    //if visible, warning
    board.reachablePositions = endups;
    board.renderBoard();
    board.addStepListener(board.activePlayer.position, endups, playerTakeStep);
});

const playerTakeStep = (position) => {
    userOptions.disableBtns();
    board.activePlayer.position = position;
    socket.emit('player takes step', { position });
}

socket.on('player out of steps', ({ }) => {
    board.reachablePositions = [];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(playerConfirmDestination);
});

const playerConfirmDestination = () => {
    socket.emit('player move completed', {});
    userOptions.disableBtns();
}

socket.on('update player', ({ hasKey, hasGoal, visible }) => {
    myPlayer.hasKey = hasKey;
    myPlayer.hasGoal = hasGoal;
    myPlayer.visible = visible;
});

socket.on('enemy turn', ({ }) => {
    //if enemy, update ui, choose next step
});

socket.on('enemy step', ({}) => {
    
});

// //in chooseNextStepEnemy onclick:
// socket.emit('enemy step', { position, pace });

// //in chooseNoMoreSteps onclick:
// //if stepCounter max or choose to stope
// socket.emit('enemy move completed', {});




// const board = new BoardController(new BoardModel(), new BoardView());
// const player = new PlayerController(new PlayerModel(), new PlayerView());
// const enemy = new EnemyController(new EnemyModel(), new EnemyView());
// const userOptions = new UserOptionsController(new UserOptionsModel(), new UserOptionsView());
// const game = new GameController(new GameModel(), new GameView());