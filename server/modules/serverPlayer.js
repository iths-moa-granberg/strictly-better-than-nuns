const enemyPaths = require('./enemyPaths.js');
const { logProgress } = require('../controllers/serverProgressLog');

class Player {
    constructor({ id, home, key, goal, username }) {
        this.id = id;
        this.position = home;

        this.home = home;
        this.key = key;
        this.goal = goal;

        this.visible = false;
        this.isEvil = false;

        this.pace = '';
        this.stepsLeft = 0;
        this.path = [{ position: home, visible: this.visible, enemyID: [] }];

        this.hasKey = false;
        this.hasGoal = false;

        this.caught = false;

        this.username = username;
    }

    isCaught = () => {
        this.caught = true;
        this.hasGoal = false;
    }

    checkTarget = (socket, room) => {
        if (this.hasKey) {
            if (this.hasGoal) {
                if (this.home.id === this.position.id) {
                    logProgress(`${this.username} has won!`, { room });
                }
            } else if (this.goal.id === this.position.id) {
                this.hasGoal = true;
                logProgress(`You have reached your goal!`, { socket });
            }
        } else if (this.key.id === this.position.id) {
            this.hasKey = true;
            logProgress(`You have reached your key!`, { socket });
        }
    }

    resetPath = (enemyID) => {
        this.path = [{ position: this.position, visible: this.visible, enemyID }];
    }

    updatePathVisibility = (position, enemyID) => {
        this.path.forEach(obj => {
            if (obj.position.id === position.id) {
                obj.visible = true;
                obj.enemyID = enemyID;
            }
        });
    }
}

class Enemy extends Player {
    constructor(id) {
        super({ id });

        if (id === 'e1') {
            this.path = enemyPaths[0];
        } else {
            this.path = enemyPaths[2];
        }

        this.position = this.path[0];
        this.lastPosition = this.path[0];

        this.visible = true;
        this.isEvil = true;

        this.playersVisible = false;
    }

    move = (position) => {
        this.stepsLeft--;
        this.lastPosition = this.position;
        this.position = position;
    }

    checkTarget = (player) => {
        return player.position.id === this.position.id;
    }

    isOnPath = () => {
        return Boolean(this.path.find(pos => pos.id === this.position.id));
    }

    endOfPath = () => {
        return this.isOnPath() && this.path[this.path.length - 1].id === this.position.id;
    }

    getNewPossiblePaths = () => {
        return enemyPaths.filter(path => path[0].id === this.path[this.path.length - 1].id && path != this.path);
    }
}

module.exports = { Good: Player, Evil: Enemy };