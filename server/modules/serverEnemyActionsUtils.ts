import { getClosestWayToPath, getEnemyStandardReachable, getReachable, getSeenBy } from './boardUtils';

import { Position, ProgressLogObject } from '../../src/shared/sharedTypes';
import Enemy from './serverEnemy';
import Game from './serverGame';
import Player from './serverPlayer';
import { Enemies } from '../serverTypes';

export const getEnemyPossibleSteps = (game: Game, currentEnemy: Enemy) => {
  let possibleSteps: Position[] = [];

  if (game.seenSomeone(currentEnemy.id) || game.heardSomeone(currentEnemy.id) || currentEnemy.playersVisible.length) {
    const enemiesPositionsIDn = [game.enemies.e1.position.id, game.enemies.e2.position.id];
    possibleSteps = getReachable(currentEnemy.position, currentEnemy.stepsLeft, true, true, enemiesPositionsIDn);
  } else if (currentEnemy.isOnPath()) {
    possibleSteps = getEnemyStandardReachable(currentEnemy.position, currentEnemy.path, currentEnemy.stepsLeft);
  } else {
    possibleSteps = getClosestWayToPath(currentEnemy.position, currentEnemy.path, currentEnemy.stepsLeft);
  }

  return possibleSteps;
};

export const getEnemySeenMessages = (players: Player[], enemies: Enemies, currentEnemyID: 'e1' | 'e2') => {
  const messages: ProgressLogObject[][] = [];

  for (let player of players) {
    const seenBy = getSeenBy(player, enemies);

    if (seenBy.length) {
      player.visible = true;
      player.updatePathVisibility(player.position, seenBy);

      if (seenBy.length === 2) {
        messages.push([{ text: player.username, id: player.id }, { text: ' is seen by both enemies' }]);
      } else if (seenBy[0] === currentEnemyID) {
        messages.push([
          {
            text: player.username,
            id: player.id,
          },
          { text: ' is seen by' },
          {
            text: seenBy[0] === 'e1' ? ' Enemy 1' : ' Enemy 2',
            id: seenBy[0],
          },
        ]);
      }
    }
  }

  return messages;
};
