const positions = require('./serverPositions');

class Game {
    constructor() {
        this.roundCounter = 0;
        this.players = [];
        this.caughtPlayers = [];
        this.enemyWinCounter = 0;
        this.playerTurnCompleted = 0;
        this.placedSoundCounter = 0;
        this.soundTokens = [];
        this.sightTokens = [];
        this.enemyJoined = false;
        this.enemyMovesCompleted = 0;
    }

    addPlayer = (newPlayer) => {
        this.players.push(newPlayer);
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
            position: player.position,
        } : { id: '', position: { id: '' } });
    }

    playersIsVisible = () => {
        return Boolean(this.players.find(player => player.visible === true));
    }

    checkEnemyTarget = (enemy) => {
        for (let player of this.players) {
            if (enemy.checkTarget(player)) {
                this.enemyWinCounter++;
                player.isCaught();
                this.addCaughtPlayer(player);
            }
        }
        if (this.enemyWinCounter > this.players.length) {
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
            id: this.players.length,
            home: positions[1 + this.players.length],
            key: positions[12 + this.players.length],
            goal: positions[10 + this.players.length],
        };
    }

    getServerPosition = (id) => {
        return positions[id];
    }
}

module.exports = Game;