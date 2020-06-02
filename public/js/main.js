const socket = io('http://localhost:4001');
const board = new BoardView();
let userOptions;
let myPlayer;
let currentPlayer;