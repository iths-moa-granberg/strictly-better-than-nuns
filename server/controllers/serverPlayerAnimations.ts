import { io } from '../index';
import { getNewPulseFrequency } from '../modules/serverPlayerAnimationsModule';

import { OnCheckPulseDistance, OnUpdatePulseFrequency } from '../../src/shared/sharedTypes';
import { ExtendedSocket } from '../serverTypes';

io.on('connection', (socket: ExtendedSocket) => {
  socket.on('check pulse distance', ({ position }: OnCheckPulseDistance) => {
    const params: OnUpdatePulseFrequency = {
      newPulseFrequency: getNewPulseFrequency(socket.game.enemies, position),
    };
    socket.emit('update pulse frequency', params);
  });
});
