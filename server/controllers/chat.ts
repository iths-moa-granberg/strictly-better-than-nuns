import { io } from '../index';
import { formatProgressLogObjects } from '../modules/chatModule';

import { ExtendedSocket } from '../serverTypes';
import { OnSendMessage, OnProgress } from '../../src/shared/sharedTypes';

io.on('connection', (socket: ExtendedSocket) => {
  socket.on('send message', ({ msg }: OnSendMessage) => {
    const params: OnProgress = {
      msg: formatProgressLogObjects(socket.game.enemies.username, socket.game.players, msg),
    };
    io.in(socket.game.id).emit('progress', params);
  });
});
