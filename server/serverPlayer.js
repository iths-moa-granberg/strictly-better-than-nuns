const enemyPaths = require('./enemyPaths.js');

class Player {
    constructor({ id, home, key, goal }) {
        this.id = id;
        this.position = home;

        this.home = home;
        this.key = key;
        this.goal = goal;

        this.visible = false;
        this.isEvil = false;

        this.pace = '';
        this.stepsLeft = 0;
        this.path = [{ position: home, visible: this.visible }];

        this.hasKey = false;
        this.hasGoal = false;
    }

    loseGoal() {
        this.hasGoal = false;
    }

    checkTarget = () => {
        if (this.hasKey) {
            if (this.hasGoal) {
                if (this.home.id === this.position.id) {
                    console.log('win');
                }
            } else if (this.goal.id === this.position.id) {
                this.hasGoal = true;
            }
        } else if (this.key.id === this.position.id) {
            this.hasKey = true;
        }
    }

    resetPath = () => {
        this.path = [{ position: this.position, visible: this.visible }];
    }
}

class Enemy extends Player {
    constructor(id, path) {
        super({ id, path });

        this.path = path;
        this.stepInPath = 0;

        this.position = path[0];
        this.lastPosition = path[0];

        this.visible = true;
        this.isEvil = true;
    }

    moveStandardPath = () => {
        if (this.stepInPath != this.path.length - 2) {
            this.stepInPath++;
            this.stepsLeft--;
            this._updatePositions();
        } else {
            this._chooseNewPath();
            this._updatePositions();
        }
    }

    moveFreely = (position) => {
        this.stepsLeft--;
        this._updatePositions(position);
    }

    _updatePositions = (position) => {
        this.lastPosition = this.position;
        this.position = position ? position : this.path[this.stepInPath];        
    }

    _chooseNewPath = () => {
        let shuffledPaths = enemyPaths.concat().sort(() => .5 - Math.random());
        for (let path of shuffledPaths) {
            if (path[0] === this.path[this.path.length - 1] && path != this.path) {
                this.stepInPath = 0;
                this.stepsLeft--;
                this.path = path;
                return;
            }
        }
    }

    checkTarget = (player) => {
        return player.position.id === this.position.id && player.id != this.id;
    }
}

module.exports = { Good: Player, Evil: Enemy };