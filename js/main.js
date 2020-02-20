const game = new Game();
const board = new BoardController(new BoardModel(), new BoardView());
const player = new PlayerController(new PlayerModel(), new PlayerView());
const userOptions = new UserOptionsController(new UserOptionsModel(), new UserOptionsView());