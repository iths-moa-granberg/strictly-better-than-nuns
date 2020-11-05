import { OnCheckPulseDistance, OnUpdatePulseFrequency } from '../../src/shared/sharedTypes';
import { io } from '../index';
import { ExtendedSocket } from '../serverTypes';

io.on('connection', (socket: ExtendedSocket) => {
  socket.on('check pulse distance', ({ position }: OnCheckPulseDistance) => {
    let distance = 7; //distances >= 7 has standard pulsFrequency

    const updateShortestDistance = (enemyID: 'e1' | 'e2') => {
      const enemyPosition = socket.game.enemies[enemyID].position;
      const closestPaths = socket.game.board._getClosestPaths(position, enemyPosition, true);

      closestPaths.forEach((path) => {
        if (path.length < distance) {
          distance = path.length - 1;
        }
      });
    };

    updateShortestDistance('e1');
    updateShortestDistance('e2');

    /*
    if the distance bw closest enemy & player is bigger than 7, the pulseFreq is standard (2.4s)
    otherwise it's calculated with .5s as minimum and an increase of 200ms/step away from enemy.
    */
    const newPulseFrequency = distance === 7 ? 2.4 : 0.5 + distance * 0.2;

    const params: OnUpdatePulseFrequency = { newPulseFrequency };
    socket.emit('update pulse frequency', params);
  });
});
