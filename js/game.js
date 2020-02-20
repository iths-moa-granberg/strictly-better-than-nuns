class Game {
    constructor() {
        this.hasSelectedSteps = false;
        this.setPlayerSpecialPositions();
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
            this.checkPlayerTarget();
            this.hasSelectedSteps = false;
        }
    }

    stepsSelected(steps) {
        this.hasSelectedSteps = true;
        board.handleResetPositions();
        this.showAllReachablePositions(steps);
    }

    checkPlayerTarget() {
        if (player.checkKey()) {
            if (player.checkGoal()) {
                if (player.handleOnTarget(player.model.home)) {
                    console.log('win!');
                }
            } else {
                if (player.handleOnTarget(player.model.goal)) {
                    player.handleAchieveGoal();
                    console.log('har mål!');
                }
            }
        } else {
            if (player.handleOnTarget(player.model.key)) {
                player.handleAchieveKey();
                console.log('har nyckel!');
            }
        }
    }

    setPlayerSpecialPositions() {
        board.handleAssignSpecialValue(player.model.home, 'home');
        board.handleAssignSpecialValue(player.model.key, 'key');
        board.handleAssignSpecialValue(player.model.goal, 'goal');
    }
}