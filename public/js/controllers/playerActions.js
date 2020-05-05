
socket.on('update player', ({ hasKey, hasGoal, visible }) => {
    myPlayer.hasKey = hasKey;
    myPlayer.hasGoal = hasGoal;
    myPlayer.visible = visible;
});


const resetSteps = () => {
    board.reachablePositions = [];
    board.renderBoard();
    socket.emit('player reset move');
}


socket.on('player select token', ({ heardTo, id, turn, enemyID, sound }) => {
    if (id === myPlayer.id) {
        board.soundTokens = heardTo;
        board.renderBoard();
        board.addListener(playerPlaceToken, turn, heardTo, enemyID, sound);
        userOptions.renderTokenInstr();
    }
});

const playerPlaceToken = (position, turn, heardTo, enemyID, sound) => {
    if (heardTo.find(pos => pos.id === position.id)) {
        board.soundTokens = [position];
        board.renderBoard();
        userOptions.clear();
        socket.emit('player placed token', { position, turn, enemyID, sound });
    }
}