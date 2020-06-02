const socket = io('http://localhost:3002');
const board = new BoardView();
let userOptions;
let myPlayer;
let currentPlayer;