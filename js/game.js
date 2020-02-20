class Game {
    constructor() {
        this.hasSelectedSteps = false;
    }

    getPlayerPosition() {
        return board.handleGetPosition(player.getX(), player.getY());
    }

    showAllReachablePositions(steps) {
        board.handleShowReachablePositions(this.getPlayerPosition(), steps);
    }

    movePlayer(position) {
        player.movePlayer(position.x, position.y);
    }

    positionSelected(position) {
        let steps = userOptions.handleGetSteps();
        let reachable = board.handleGetAllReachables(this.getPlayerPosition(), steps);
        if (reachable.includes(position) && this.hasSelectedSteps) {
            board.handleResetPositions();
            this.movePlayer(position);
            this.hasSelectedSteps = false;
        }
    }

    stepsSelected(steps) {
        this.hasSelectedSteps = true;
        board.handleResetPositions();
        this.showAllReachablePositions(steps);
    }
}