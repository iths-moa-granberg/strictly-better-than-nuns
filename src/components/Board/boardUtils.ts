import { MyPlayer, ClientEnemies } from '../../clientTypes';
import { ClientPlayer } from '../../modules/player';
import { Position } from '../../shared/sharedTypes';

export const getClassName = (
  myPlayer: MyPlayer,
  currentPlayerID: 'e1' | 'e2' | null,
  position: Position,
  reachablePositions: Position[]
) => {
  const id = myPlayer.isEvil ? currentPlayerID : (myPlayer as ClientPlayer).id;
  return reachablePositions.find((pos) => pos.id === position.id) ? `reachable-${id}` : '';
};

export const stepIsValid = (
  myPlayer: MyPlayer,
  currentPlayerID: 'e1' | 'e2' | null,
  position: Position,
  possibleSteps: Position[]
) => {
  if (myPlayer.isEvil) {
    return (
      (myPlayer as ClientEnemies)[currentPlayerID!].position.neighbours.includes(position.id) &&
      possibleSteps.find((pos) => pos.id === position.id)
    );
  }
  return (
    (myPlayer as ClientPlayer).position.neighbours.includes(position.id) &&
    possibleSteps.find((pos) => pos.id === position.id)
  );
};
