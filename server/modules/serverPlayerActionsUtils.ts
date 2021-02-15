import { getClosestWayHome, getReachable, getSeenBy } from './boardUtils';

import Game from './serverGame';
import Player from './serverPlayer';
import { Position } from '../../src/shared/sharedTypes';
import { Enemies } from '../serverTypes';

export const playerStepOptions = (player: Player, game: Game) => {
  let possibleSteps: Position[] = [];

  if (game.isCaught(player.id)) {
    possibleSteps = getClosestWayHome(player.position, player.home, player.hasKey, player.stepsLeft);
  } else {
    const enemiesPositionsIDn = [game.enemies.e1.position.id, game.enemies.e2.position.id];
    possibleSteps = getReachable(player.position, player.stepsLeft, player.hasKey, player.isEvil, enemiesPositionsIDn);
  }

  return possibleSteps;
};

export const updatePlayerOnStep = (player: Player, positionID: number, enemies: Enemies) => {
  player.takeStep(positionID);

  const seenBy = getSeenBy(player, enemies);

  player.visible = Boolean(seenBy.length);
  player.addToPath(seenBy);
};

export const getPlayerStatus = (player: Player, game: Game) => {
  const playerStatus = {
    seen: false,
    setFree: false,
  };

  const seenBy = getSeenBy(player, game.enemies);
  const caught = game.isCaught(player.id);

  if (seenBy.length && !caught) {
    playerStatus.seen = true;
  }

  if (caught && !player.visible) {
    game.removeCaughtPlayer(player);
    playerStatus.setFree = true;
  }

  return playerStatus;
};

export const actOnPlayerResetMove = (player: Player, game: Game) => {
  player.resetMove();
  game.filterPlayersVisible(player.id);

  if (player.caught) {
    game.addCaughtPlayer(player);
  }
};
