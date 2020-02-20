class GameModel {
    constructor() { }
}

class GameView {
    constructor() { }

}

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    showAllReachablePositions() {
        board.handleShowReachablePositions(board.handleGetPosition(player.getX(), player.getY()), 3);
    }

    movePlayer(position) {
        player.movePlayer(position.x, position.y);
    }

    positionSelected(position) {
        let reachable = board.handleGetAllReachables(board.handleGetPosition(player.getX(), player.getY()), 3);
        if (reachable.includes(position)) {
            board.handleResetPositions();
            this.movePlayer(position);
        }
    }
}

//Flöde:
//- klicka stå, gå, spring
//- visa possible endups
//- välj endup
//- if key or target, flagga
//* gör ljud (ligga hos abe?)
//- repeat