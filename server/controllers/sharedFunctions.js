const io = require('../../index').io;

const updateBoard = game => {
    io.in(game.id).emit('update board', {
        players: [game.enemies.e1, game.enemies.e2].concat(game.getVisiblePlayers()),
        soundTokens: game.soundTokens,
        sightTokens: game.sightTokens,
        enemyPaths: [game.enemies.e1.path, game.enemies.e2.path],
        reachablePositions: [],
    });
}

const startNextTurn = game => {
    game.startNextTurn();
    io.in(game.id).emit('players turn', { caughtPlayers: game.caughtPlayers });
};

const logProgress = (msg, { socket, room }) => {
    if (room) {
        io.in(room).emit('progress', { msg });
    } else {
        socket.emit('progress', ({ msg }));
    }
}

const logSound = game => {
    if (game.soundTokens.find(token => token.enemyID === 'e1') && game.soundTokens.find(token => token.enemyID === 'e2')) {
        logProgress(`Both enemies heard someone!`, { room: game.id });
    } else {
        if (game.soundTokens.find(token => token.enemyID === 'e1')) {
            logProgress(`e1 heard someone!`, { room: game.id });
        }
        if (game.soundTokens.find(token => token.enemyID === 'e2')) {
            logProgress(`e2 heard someone!`, { room: game.id });
        }
    }
}

const isSeen = (player, enemy, game) => {
    let seenBy = [];
    if (game.board.isSeen(player.position, enemy.position, enemy.lastPosition)) {
        seenBy.push(enemy.id);
        enemy.playersVisible = true;
    }
    return seenBy;
}

module.exports = { updateBoard, startNextTurn, logProgress, logSound, isSeen };