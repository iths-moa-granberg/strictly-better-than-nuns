const positions = require('./serverPositions');

class Game {
    constructor() {
        this.roundCounter = 0;
        this.players = [];
        this.numOfGoodPlayers = 0;
        this.enemyWinCounter = 0;
        this.playerTurnCompleted = 0;
    }

    addPlayer = (newPlayer) => {
        this.players.push(newPlayer);
        if (newPlayer.id != 'enemy') {
            this.numOfGoodPlayers++;
        }
    }

    startNextRound = () => {
        //for each socket, check playerPos and calc reachablesObj, emit make move
        this.roundCounter++;
        if (this.roundCounter >= 15) {
            console.log('end game');
        }
    }

    getTokens = () => {
        return []; //placeholder code;
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