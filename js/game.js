class GameModel {
    constructor() {
        this.roundCounter = 0;
        this.playerHasSelectedSteps = false;
    }

    getPlayerPosition() {
        return board.getPosition(player.getX(), player.getY());
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

    toggleSteps() {
        this.playerHasSelectedSteps = !this.playerHasSelectedSteps;
    }

    hasSelectedSteps() {
        return this.playerHasSelectedSteps;
    }

    getSteps() {
        return userOptions.getSteps();
    }

    getAllReachables(steps) {
        return board.getAllReachables(this.getPlayerPosition(), steps);
    }
}


class GameView {
    constructor() {
        this._setPlayerSpecialPositions();
        this.showEnemyCurrentPath();
    }

    _setPlayerSpecialPositions() {
        board.assignSpecialValue(player.getHome(), 'home');
        board.assignSpecialValue(player.getKey(), 'key');
        board.assignSpecialValue(player.getGoal(), 'goal');
    }

    showReachablePositions(position, steps) {
        board.showReachablePositions(position, steps);
    }

    movePlayer(position) {
        player.movePlayer(position.x, position.y);
    }

    showEnemyCurrentPath() {
        board.showEnemyCurrentPath(enemy.getCurrentPath());
    }

    moveEnemyStandardPath() {
        enemy.moveStandardPath();
        this.showEnemyCurrentPath();
    }

    resetPositions(className) {
        board.resetPositions(className);
    }
}


class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    showReachablePositions = (steps) => {
        this.view.showReachablePositions(this.model.getPlayerPosition(), steps);
    }

    stepsSelected = (steps) => { //called from userOptions when choosen pace/steps
        this.model.toggleSteps();
        this.showReachablePositions(steps);
    }

    positionSelected = (position) => { //called from board when position is clicked
        if (this.model.hasSelectedSteps()) {
            if (this.model.getAllReachables(this.model.getSteps()).includes(position)) {
                this.view.resetPositions('reachable');
                this.view.movePlayer(position);
                this.model.checkPlayerTarget();
                this.model.toggleSteps();
                this.newRound();
            }
        }
    }

    newRound = () => {
        this.view.moveEnemyStandardPath();
        this.model.roundCounter++;
    }
}