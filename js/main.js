const board = new BoardController(new BoardModel(), new BoardView());
const player = new PlayerController(new PlayerModel(), new PlayerView());
const userOptions = new UserOptionsController(new UserOptionsModel(), new UserOptionsView());
const game = new Game();