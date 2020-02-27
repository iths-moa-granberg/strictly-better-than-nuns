class Game {
    constructor() {
        this.roundCounter = 0;

        this.hasSelectedSteps = false;
        this.setPlayerSpecialPositions();
    }

    getPlayerPosition() {
        return board.getPosition(player.getX(), player.getY());
    }

    showAllReachablePositions(steps) {
        board.showReachablePositions(this.getPlayerPosition(), steps);
    }

    movePlayer(position) {
        player.movePlayer(position.x, position.y);
    }

    positionSelected(position) {
        let steps = userOptions.getSteps();
        let reachable = board.getAllReachables(this.getPlayerPosition(), steps);
        if (reachable.includes(position) && this.hasSelectedSteps) {
            board.resetPositions();
            this.movePlayer(position);
            this.checkPlayerTarget();
            this.hasSelectedSteps = false;
            this.roundCounter++;
        }
    }

    stepsSelected(steps) {
        this.hasSelectedSteps = true;
        board.resetPositions();
        this.showAllReachablePositions(steps);
    }

    checkPlayerTarget() {
        if (player.checkKey()) {
            if (player.checkGoal()) {
                if (player.isOnTarget(player.model.home)) {
                    console.log('win!');
                }
            } else {
                if (player.isOnTarget(player.model.goal)) {
                    player.achieveGoal();
                    console.log('har mål!');
                }
            }
        } else {
            if (player.isOnTarget(player.model.key)) {
                player.achieveKey();
                console.log('har nyckel!');
            }
        }
        if (this.roundCounter >= 8) { //magic number
            console.log('game over');
        } 
    }

    setPlayerSpecialPositions() {
        board.assignSpecialValue(player.model.home, 'home');
        board.assignSpecialValue(player.model.key, 'key');
        board.assignSpecialValue(player.model.goal, 'goal');
    }
}