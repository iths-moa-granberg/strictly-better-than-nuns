import { getClosestPaths } from './boardUtils';

import { Position } from '../../src/shared/sharedTypes';
import { Enemies } from '../serverTypes';

export const getNewPulseFrequency = (enemies: Enemies, position: Position) => {
  //if player on same position as either enemy, set pulseFreq to .3s
  if (position.id === enemies.e1.position.id || position.id === enemies.e2.position.id) {
    return 0.3;
  }

  let distance = 7; //distances >= 7 has standard pulsFrequency

  const updateShortestDistance = (enemyID: 'e1' | 'e2') => {
    const enemyPosition = enemies[enemyID].position;
    const closestPaths = getClosestPaths(position, enemyPosition, true);
    const length = closestPaths[0].length - 1; //get path's length

    if (length <= distance) {
      distance = length - 1; // -1 to remove startpos from length
    }
  };

  updateShortestDistance('e1');
  updateShortestDistance('e2');

  /*
  if the distance bw closest enemy & player is bigger than 7, the pulseFreq is standard (2.4s)
  otherwise it's calculated with .5s as minimum and an increase of 200ms/step away from enemy.
  */
  const pulseFrequency = distance === 7 ? 2.4 : 0.5 + distance * 0.2;
  return Math.round(pulseFrequency * 10) / 10;
};
