class GameModel {
    constructor() {
        this.roundCounter = 0;
        this.playerHasSelectedSteps = false;
        this.playerPace = '';
    }

    getPlayerPosition() {
        return board.getPosition(player.getX(), player.getY());
    }

    getEnemyPosition() {
        return board.getPosition(enemy.getX(), enemy.getY());
    }

    checkPlayerTarget() {
        if (player.checkKey()) {
            if (player.checkGoal()) {
                if (player.isOnTarget(player.model.home)) {
                    console.log('player win!');
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
        if (this.roundCounter >= 15) {
            console.log('game over');
        }
    }

    checkEnemyTarget() {
        if (this.getEnemyPosition() === this.getPlayerPosition()) {
            enemy.catchPlayer();
            if (enemy.getWinCounter() === 3) {
                console.log('enemy win! game over!');
            } else {
                player.loseGoal();
                //player go straight to home
            }
        }
    }

    getSteps() {
        return userOptions.getSteps();
    }

    getAllReachables(steps) {
        return board.getAllReachables(this.getPlayerPosition(), steps);
    }

    isHeard(startPosition, endPosition) {
        return this._soundReaches(startPosition).includes(endPosition);
    }

    _soundReaches(startPosition) {
        return board.getAllReachables(startPosition, this._getRandomSoundReach());
    }

    _getRandomSoundReach() {
        let sound = Math.floor(Math.random() * 6) + 1;
        return this.playerPace === 'stand' ? sound - 3
            : this.playerPace === 'sneak' ? sound - 2
                : this.playerPace === 'walk' ? sound - 1
                    : sound;
    }

    getClosestPaths(start, end) {
        return board.getClosestPaths(start, end);
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

    stepsSelected = (steps, pace) => { //called from userOptions when choosen pace/steps
        this.model.playerHasSelectedSteps = true;
        this.model.playerPace = pace;
        this.showReachablePositions(steps);
    }

    positionSelected = (position) => { //called from board when position is clicked
        if (this.model.playerHasSelectedSteps) {
            if (this.model.getAllReachables(this.model.getSteps()).includes(position)) {
                this.view.resetPositions('reachable');
                this.view.movePlayer(position);
                this.model.checkPlayerTarget();
                this.model.playerHasSelectedSteps = false;
                this.newRound();
            }
        }
    }

    newRound = () => {
        this.model.checkEnemyTarget(); //check after player moves
        if (this.model.isHeard(this.model.getPlayerPosition(), this.model.getEnemyPosition())) {
            this.playerWasHeard();
        } else {
            this.view.moveEnemyStandardPath();
        }

        this.model.checkEnemyTarget(); //check after enemy moves
        if (this.model.isHeard(this.model.getEnemyPosition(), this.model.getPlayerPosition())) {
            console.log('guard listened and heard player');
            this.playerWasHeard();
        }

        this.model.roundCounter++;
    }

    playerWasHeard = () => {
        
        let paths = this.model.getClosestPaths(this.model.getPlayerPosition(), this.model.getEnemyPosition());
        
        console.log(paths);
        
        //find closest path, place token
    }
}