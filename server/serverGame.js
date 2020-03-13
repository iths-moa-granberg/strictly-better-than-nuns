const positions = require('./serverPositions');

class Game {
    constructor() {
        this.roundCounter = 0;
        this.players = [];
        this.numOfGoodPlayers = 0;
        this.enemyWinCounter = 0;
        this.playerTurnCompleted = 0;
        this.placedSoundCounter = 0;
        this.soundTokens = [];
        this.sightTokens = [];
    }

    addPlayer = (newPlayer) => {
        this.players.push(newPlayer);
        if (!newPlayer.isEvil) {
            this.numOfGoodPlayers++;
        }
    }

    startNextTurn = () => {
        this.roundCounter++;
        if (this.roundCounter > 15) {
            console.log('end game');
        }
    }

    addToken = (position, type) => {
        if (type === 'sound') {
            this.soundTokens.push(position);
        } else if (type === 'sight') {
            this.sightTokens.push(position);
        }
    }

    getVisibilityPlayers = () => {
        return this.players.map(player => player.visible ? {
            id: player.id,
            positionId: player.position.id,
            visible: player.visible,
        } : {});
    }

    checkEnemyTarget = (enemy) => {
        for (let player of this.players) {
            if (enemy.checkTarget(player)) {
                this.enemyWinCounter++;
                player.loseGoal();
            }
        }
        if (this.enemyWinCounter >= this.numOfGoodPlayers) {
            console.log('enemy win');
        }
    }

    generatePlayerInfo = () => {
        return {
            id: this.numOfGoodPlayers,
            home: positions[1 + this.numOfGoodPlayers],
            key: positions[12 + this.numOfGoodPlayers],
            goal: positions[10 + this.numOfGoodPlayers],
        };
    }
}

module.exports = new Game;