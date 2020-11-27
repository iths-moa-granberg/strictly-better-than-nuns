import { Position, VisiblePlayers } from '../../../shared/sharedTypes';

export const getPositioningValues = (position: Position, adjustPosition: number, isEvil: boolean) => {
  let top = position.y * (856 / 900);
  let left = position.x * (856 / 900);

  if (isEvil) {
    top += 0.6;
    left += 0.6;
  } else {
    top -= 0.6;
    left -= 0.6;
  }

  if (adjustPosition) {
    if (adjustPosition === 1) {
      top += 1;
      left += 1;
    } else if (adjustPosition === 2) {
      top -= 1;
      left -= 1;
    } else if (adjustPosition === 3) {
      top += 1;
      left -= 1;
    } else if (adjustPosition === 4) {
      top -= 1;
      left += 1;
    }
  }

  return { top, left };
};

export const getPlayerPositionAdjustments = (players: VisiblePlayers) => {
  const positionsWithPlayers: { [key: number]: string[] } = {};
  const playerPositionAdjustment: { [key: string]: number } = {};

  // groupes all visible players located at the same position by position.id
  players.forEach((player) => {
    if (!positionsWithPlayers[player.position.id]) {
      positionsWithPlayers[player.position.id] = [];
    }
    positionsWithPlayers[player.position.id].push(player.id);
  });

  // sets each player's position adjustment based on how many other player shares the position
  players.forEach((player) => {
    positionsWithPlayers[player.position.id] = positionsWithPlayers[player.position.id].filter(
      (id) => id !== player.id
    );
    playerPositionAdjustment[player.id] = positionsWithPlayers[player.position.id].length;
  });

  return playerPositionAdjustment;
};
