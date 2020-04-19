const positions = require('./serverPositions');

class Game {
    constructor() {
        this.roundCounter = 0;
        this.players = [];
        this.numOfGoodPlayers = 0;
        this.caughtPlayers = [];
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

    getVisiblePlayers = () => {
        return this.players.map(player => player.visible ? {
            id: player.id,
            positionId: player.position.id,
            visible: player.visible,
        } : {});
    }

    playersIsVisible = () => {
        return Boolean(this.players.find(player => player.visible === true && !player.isEvil));
    }

    checkEnemyTarget = (enemy) => {
        for (let player of this.players) {
            if (enemy.checkTarget(player)) {
                this.enemyWinCounter++;
                player.isCaught();
                this.addCaughtPlayer(player);
            }
        }
        if (this.enemyWinCounter >= this.numOfGoodPlayers) {
            console.log('enemy win');
        }
    }

    addCaughtPlayer = (player) => {
        this.caughtPlayers.push(player.id);
    }

    removeCaughtPlayer = (player) => {
        this.caughtPlayers = this.caughtPlayers.filter(id => id != player.id);
    }

    isCaught = (player) => {
        return this.caughtPlayers.includes(player.id);
    }

    generatePlayerInfo = () => {
        return {
            id: this.numOfGoodPlayers,
            home: positions[1 + this.numOfGoodPlayers],
            key: positions[12 + this.numOfGoodPlayers],
            goal: positions[10 + this.numOfGoodPlayers],
        };
    }

    getServerPosition = (id) => {
        return positions[id];
    }
}

module.exports = Game;