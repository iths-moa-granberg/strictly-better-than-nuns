const enemyPaths = require('./enemyPaths.js');

class Player {
    constructor({ id, home, key, goal }) {
        this.id = id;
        this.position = home;

        this.home = home;
        this.key = key;
        this.goal = goal;

        this.pace = '';
        this.stepsLeft = 0;

        this.hasKey = false;
        this.hasGoal = false;

        this.visible = false;
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
}

class Enemy extends Player {
    constructor(id, path) {
        super({ id });

        this.path = path;
        this.stepInPath = 0;

        this.position = path[0];

        this.visible = true;
    }

    moveStandardPath = () => {
        if (this.stepInPath != this.path.length - 1) {
            this.stepInPath++;
            this.position = this.path[this.stepInPath];
        } else {
            this._chooseNewPath();
            this.position = this.path[this.stepInPath];
        }
    }

    _chooseNewPath = () => {
        let shuffledPaths = enemyPaths.concat().sort(() => .5 - Math.random());
        for (let path of shuffledPaths) {
            if (path[0] === this.path[this.path.length - 1] && path != this.path) {
                this.stepInPath = 1;
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