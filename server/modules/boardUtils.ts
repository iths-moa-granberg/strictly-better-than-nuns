import positions from '../../src/shared/positions';
import { Position } from '../../src/shared/sharedTypes';
import { Enemies } from '../serverTypes';

export const getReachable = (
  startPosition: Position,
  totalSteps: number,
  hasKey: boolean,
  isEvil: boolean,
  enemies: Enemies
) => {
  let possiblePos = [startPosition];
  for (let steps = 0; steps < totalSteps; steps++) {
    for (let pos of possiblePos) {
      possiblePos = possiblePos.concat(_getNeighbours(pos).filter((neighbour) => !possiblePos.includes(neighbour)));
      if (!isEvil) {
        const enemiesPositionsIDn: number[] = [enemies.e1.position.id, enemies.e2.position.id];
        possiblePos = possiblePos.filter((pos) => !enemiesPositionsIDn.includes(pos.id));
      }
      if (!hasKey) {
        possiblePos = possiblePos.filter((pos) => !pos.requireKey);
      }
    }
  }
  return possiblePos.filter((pos) => pos.id != startPosition.id);
};

const _getNeighbours = (position: Position) => {
  return position.neighbours.map((neighbour) => positions[neighbour]);
};

export const getEnemyStandardReachable = (start: Position, path: Position[], totalSteps: number) => {
  let serverStart = path.find((obj) => obj.id === start.id);
  return path.filter((pos, index) => index > path.indexOf(serverStart!)).filter((pos, index) => index < totalSteps);
};

export const getClosestWayHome = (start: Position, end: Position, hasKey: boolean, stepsLeft: number) => {
  return getClosestPaths(start, end, hasKey)
    .map((path) => path.filter((pos) => pos.id !== start.id))
    .map((path) => {
      path.splice(0, path.length - stepsLeft);
      return path;
    })
    .flat();
};

export const getClosestPaths = (start: Position, end: Position, hasKey: boolean) => {
  let queue: Position[][] = _getQueue(start, end, hasKey);
  let paths: Position[][] = [[end]];

  for (let path of paths) {
    for (let pos of path) {
      if (pos.id === path[path.length - 1].id) {
        let i = _getPlaceInQueue(pos, queue) - 1;
        let neighbours = _getNeighbours(pos).filter((neighbour) => queue[i].find((p) => p.id === neighbour.id));
        if (!hasKey) {
          neighbours = neighbours.filter((pos) => !pos.requireKey);
        }
        if (neighbours.length === 1) {
          path.push(neighbours[0]);
        } else if (neighbours.length === 2) {
          let newPath = path.slice();
          newPath.push(neighbours[0]);
          paths.push(newPath);
          path.push(neighbours[1]);
        } else if (neighbours.length === 3) {
          let firstNewPath = path.slice();
          let secondNewPath = path.slice();
          firstNewPath.push(neighbours[0]);
          secondNewPath.push(neighbours[1]);
          path.push(neighbours[2]);
          paths.push(firstNewPath);
          paths.push(secondNewPath);
        }
        if (path.find((pos) => pos.id === start.id)) {
          break;
        }
      }
    }
  }
  paths.forEach((path) => path.push(start));
  return paths;
};

export const getClosestWayToPath = (start: Position, path: Position[], stepsLeft: number) => {
  let allPaths: Position[][] = [];
  let shortestPathLength = 100; //magic number, max distance bw any pos board
  for (let position of path) {
    let paths = getClosestPaths(start, position, true);
    if (paths[0].length < shortestPathLength) {
      shortestPathLength = paths[0].length;
    }
    allPaths = allPaths.concat(paths);
  }

  return allPaths
    .filter((path) => path.length === shortestPathLength)
    .map((path) => path.filter((pos) => pos.id !== start.id))
    .map((path) => {
      path.splice(0, path.length - stepsLeft);
      return path;
    })
    .flat();
};

const _getQueue = (start: Position, end: Position, hasKey: boolean) => {
  let tested: Position[] = [start];
  let queue: Position[][] = [[start]];

  for (let stepArr of queue) {
    let nextStep: Position[] = [];
    for (let pos of stepArr) {
      let neighbours = _getNeighbours(pos);
      neighbours = neighbours.filter((neighbour) => !tested.find((pos) => neighbour.id === pos.id));
      if (!hasKey) {
        neighbours = neighbours.filter((neighbour) => !neighbour.requireKey);
      }
      tested = tested.concat(neighbours);
      nextStep = nextStep.concat(neighbours);
    }
    queue.push(nextStep);
    if (nextStep.find((pos) => pos.id === end.id)) {
      break;
    }
  }
  return queue;
};

const _getPlaceInQueue = (position: Position, queue: Position[][]) => {
  return queue.findIndex((place) => place.find((pos) => pos.id === position.id));
};

export const isHeard = (playerPos: Position, enemies: Enemies, sound: number, enemyID: 'e1' | 'e2') => {
  const enemyPos = enemies[enemyID].position;
  const reaches: Position[] = getReachable(playerPos, sound, true, true, enemies);

  if (reaches.find((pos) => pos.id === enemyPos.id)) {
    const soundPaths: Position[][] = getClosestPaths(playerPos, enemyPos, true);

    let tokenPositions: Position[] = [];
    for (let path of soundPaths) {
      if (!tokenPositions.find((pos) => pos.id === path[1].id)) {
        tokenPositions.push(path[1]);
      }
    }
    return tokenPositions.map((pos) => ({ id: pos.id, enemyID }));
  } else {
    return;
  }
};

export const getRandomSound = () => {
  return Math.floor(Math.random() * 6) + 1;
};

export const getSoundReach = (pace: string, sound: number) => {
  return pace === 'stand' ? sound - 3 : pace === 'sneak' ? sound - 2 : pace === 'walk' ? sound - 1 : sound;
};

export const isSeen = (position: Position, enemyPos: Position, enemyLastPos: Position) => {
  if (!enemyPos.inSight.includes(position.id)) {
    return false;
  }

  const isVisibleFromDirection = (axis: 'x' | 'y') => {
    if (enemyPos[axis] < enemyLastPos[axis]) {
      return position[axis] <= enemyPos[axis];
    }
    return position[axis] >= enemyPos[axis];
  };

  if (enemyPos.x !== enemyLastPos.x && enemyPos.y !== enemyLastPos.y) {
    if (Math.abs(enemyPos.y - enemyLastPos.y) >= Math.abs(enemyPos.x - enemyLastPos.x)) {
      return isVisibleFromDirection('y');
    }
    return isVisibleFromDirection('x');
  }

  return isVisibleFromDirection(enemyPos.x === enemyLastPos.x ? 'y' : 'x');
};
