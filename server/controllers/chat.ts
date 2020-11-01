import { io } from '../index';
import { ExtendedSocket } from '../serverTypes';
import { OnSendMessage, OnProgress } from '../../src/shared/sharedTypes';

io.on('connection', (socket: ExtendedSocket) => {
  socket.on('send message', ({ msg }: OnSendMessage) => {
    let username = '';
    if (msg.id === 'e1') {
      username = socket.game.enemies.username;
    } else {
      const user = socket.game.players.find((player) => player.id === msg.id);
      if (user) {
        username = user.username;
      }
    }

    const formattedMsg = [{ text: `${username}: `, id: msg.id }, { text: msg.text }];
    const params: OnProgress = { msg: formattedMsg };
    io.in(socket.game.id).emit('progress', params);
  });
});
