const positions = require('./serverPositions');
const Player = require('./serverPlayer');
const { logProgress } = require('./serverProgressLog');

class Game {
    constructor() {
        this.id = this.generateGameID();
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
        this.enemyListened = 0;

        this.enemies = { e1: new Player.Evil('e1'), e2: new Player.Evil('e2') };
    }

    generateGameID = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
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

    addToken = (positionID, type, enemyID) => {
        if (type === 'sound') {
            this.soundTokens.push({ id: positionID, enemyID });
        } else if (type === 'sight') {
            this.sightTokens.push({ id: positionID, enemyID });
        }
    }

    seenSomeone = enemyID => {
        return Boolean(this.sightTokens.find(token => token.enemyID.includes(enemyID)));
    }

    heardSomeone = enemyID => {
        return Boolean(this.soundTokens.find(token => token.enemyID === enemyID));
    }

    getVisiblePlayers = () => {
        return this.players.map(player => player.visible ? {
            id: player.id,
            position: player.position,
        } : { id: '', position: { id: '' } });
    }

    checkEnemyTarget = (enemy) => {
        for (let player of this.players) {
            if (enemy.checkTarget(player) && !this.caughtPlayers.includes(player.id)) {
                this.enemyWinCounter++;
                player.isCaught();
                this.addCaughtPlayer(player);

                logProgress(`${player.username} is caught! Enemy wincounter is now ${this.enemyWinCounter}`, { room: this.id });
            }
        }
        if (this.enemyWinCounter > this.players.length) {
            logProgress(`Enemy wins!`, { room: this.id });
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

    generatePlayerInfo = username => {
        return {
            id: this.players.length,
            home: positions[1 + this.players.length],
            key: positions[12 + this.players.length],
            goal: positions[10 + this.players.length],
            username,
        };
    }

    getServerPosition = (id) => {
        return positions[id];
    }
}

module.exports = Game;