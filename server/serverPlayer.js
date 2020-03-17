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

        this.caught = false;
    }

    isCaught = () => {
        this.caught = true;
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

    updatePathVisibility = (position) => {
        this.path.forEach(obj => {
            if (obj.position.id === position.id) {
                obj.visible = true;
            }
        });
    }
}

class Enemy extends Player {
    constructor(id, path) {
        super({ id, path });

        this.path = path;

        this.position = path[0];
        this.lastPosition = path[0];

        this.lastConfirmedInfo = {
            position: this.position,
            lastPosition: this.lastPosition,
            path,
        };

        this.visible = true;
        this.isEvil = true;
    }

    move = (position) => {
        this.stepsLeft--;
        this.lastPosition = this.position;
        this.position = position;
    }

    checkTarget = (player) => {
        return player.position.id === this.position.id && player.id != this.id;
    }

    isOnPath = () => {
        return this.path.find(pos => pos.id === this.position.id) ? true : false;
    }

    endOfPath = () => {
        return this.isOnPath() && this.path[this.path.length - 1].id === this.position.id;
    }

    getNewPossiblePaths = () => {
        return enemyPaths.filter(path => path[0].id === this.path[this.path.length - 1].id && path != this.path);
    }

    updateLastConfirmedInfo = () => {
        this.lastConfirmedInfo.position = this.position;
        this.lastConfirmedInfo.lastPosition = this.lastPosition;
        this.lastConfirmedInfo.path = this.path;
    }

    resetToLastConfirmedInfo = () => {
        this.position = this.lastConfirmedInfo.position;
        this.lastPosition = this.lastConfirmedInfo.lastPosition;
        this.path = this.lastConfirmedInfo.path;
    }
}

module.exports = { Good: Player, Evil: Enemy };