socket.on('players turn', ({ resetPosition, caughtPlayers }) => {
    if (myPlayer.isEvil) {
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
        userOptions.disableBtns();
    } else {
        if (resetPosition) {
            myPlayer.position = resetPosition;
            board.renderBoard();
        }
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
        if (caughtPlayers.includes(myPlayer.id)) {
            userOptions.renderCaughtInstr();
            socket.emit('player selects pace', ({ pace: 'walk' }));
        }
    }
});

const selectPace = (pace) => {
    if (myPlayer.isEvil) {
        socket.emit('enemy selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Walk', 'Run'], pace, 'disabled');
    } else {
        socket.emit('player selects pace', ({ pace }));
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run'], pace, 'disabled');
    }
}

socket.on('possible steps', ({ possibleSteps, visible, stepsLeft }) => {
    //if player && visible, warning
    if (myPlayer.isEvil && stepsLeft <= 1) {
        askToConfirmDestination();
        userOptions.removeBtn('.back');
    } else if (!myPlayer.isEvil && !possibleSteps.length) {
        askToConfirmDestination();
    }
    board.reachablePositions = possibleSteps;
    board.renderBoard();
    board.addListener(takeStep, possibleSteps);
});

const askToConfirmDestination = () => {
    board.reachablePositions = [];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(confirmDestination, resetSteps);
}

const takeStep = (position, possibleSteps) => {
    if (currentPlayer.position.neighbours.includes(position.id) && possibleSteps.find(pos => pos.id === position.id)) {
        currentPlayer.position = position;
        if (myPlayer.isEvil) {
            socket.emit('enemy takes step', { position });
            userOptions.disableBtns();
        } else {
            socket.emit('player takes step', { position });
            askToConfirmDestination();
        }
    }
}

const confirmDestination = () => {
    if (myPlayer.isEvil) {
        socket.emit('enemy move completed');
    } else {
        socket.emit('player move completed');
    }
    userOptions.disableBtns();
}

socket.on('enemy turn', () => {
    if (myPlayer.isEvil) {
        userOptions.renderSelectEnemyBtns(selectEnemy);
    } else {
        userOptions.renderPaceBtns(selectPace, ['Stand', 'Sneak', 'Walk', 'Run']);
        userOptions.disableBtns();
    }
});

const selectEnemy = (enemyID) => {
    currentPlayer = myPlayer[enemyID];
    socket.emit('select enemy', { enemyID });
    userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
}

socket.on('next enemy turn', () => {
    if (currentPlayer.id === 'e1') {
        selectEnemy('e2');
    } else {
        selectEnemy('e1');
    }
});