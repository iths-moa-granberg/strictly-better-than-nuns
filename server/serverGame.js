class Game {
    constructor() {
        this.roundCounter = 0;
        this.players = [];
        this.enemyWinCounter = 0;
    }

    addPlayer = (newPlayer) => {
        for (let player of this.players) {
            if (player.id === newPlayer.id) {
                return
            }
        }
        this.players.push(newPlayer);
    }

    startNextRound = () => {
        //for each socket, check playerPos and calc reachablesObj, emit mave move
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
        } : null);
    }
}

module.exports = new Game;