const io = require('../index').io;

const logProgress = (msg, { socket, room }) => {
    if (room) {
        io.in(room).emit('progress', { msg });
    } else {
        socket.emit('progress', ({ msg }));
    }
}

module.exports = { logProgress };