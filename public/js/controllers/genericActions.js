
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