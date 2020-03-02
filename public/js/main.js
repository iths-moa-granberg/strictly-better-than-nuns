const socket = io();
const board = new BoardView();
let myPlayer;

socket.on('init', ({ id, home, key, goal }) => {
    myPlayer = new Player(id, home, key, goal);
});

socket.on('update board', ({ players, tokens, enemyPath, reachablePaths }) => {
    board.renderBoard(myPlayer, players, tokens, enemyPath, reachablePaths);
});

// socket.on('players turn', ({ paths }) => {
//     //if player
//     //check if caught, limit 
//     //activate ui, choose pace and path
// });

// // socket.on('update player', ({ data }) => { });

// //in choosePathBtn onclick:
// let path = [positions[1], positions[2]];
// let pace = 'walk';
// socket.emit('player move', { path, pace });

// socket.on('enemy turn', ({ paths }) => {
//     //if enemy
//     //activate ui, choose next step
// });

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