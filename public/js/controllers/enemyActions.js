
socket.on('choose new path', ({ paths }) => {
    showBtnsSelectPath(paths);
});

const showBtnsSelectPath = (paths) => {
    userOptions.renderChoosePath(paths, showSelectedPath);
}

const showSelectedPath = (paths, num) => {
    board[currentPlayer.id.concat('Path')] = paths[num];
    board.renderBoard();
    userOptions.renderConfirmDestinationBtn(selectPath, showBtnsSelectPath, paths, paths[num]);
}

const selectPath = (path) => {
    userOptions.renderPaceBtns(selectPace, ['Walk', 'Run']);
    userOptions.disableBtns();
    socket.emit('select path', { path });
}