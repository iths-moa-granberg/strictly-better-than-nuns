import enemyPaths from './enemyPaths';

import { Position } from '../../src/shared/sharedTypes';
import Player from './serverPlayer';
import positions from '../../src/shared/positions';

interface Enemy {
  id: 'e1' | 'e2';
  position: Position;
  isEvil: boolean;
  stepsLeft: number;
  pace: string;

  playersVisible: string[];
  path: Position[];
  pathName: string;
  lastPosition: Position;
}

class Enemy {
  constructor(id: 'e1' | 'e2') {
    this.path = [];
    this.pathName = '';

    this.id = id;
    this.position = positions[26];
    this.lastPosition = positions[26];

    this.isEvil = true;

    this.playersVisible = [];
  }

  move = (position: Position) => {
    this.stepsLeft--;
    this.lastPosition = this.position;
    this.position = position;
  };

  checkTarget = (player: Player) => {
    return player.position.id === this.position.id && player.position.id !== player.home.id;
  };

  isOnPath = () => {
    return Boolean(this.path.find((pos) => pos.id === this.position.id));
  };

  endOfPath = () => {
    return this.isOnPath() && this.path[this.path.length - 1].id === this.position.id;
  };

  getNewPossiblePaths = () => {
    return Object.keys(enemyPaths).filter((pathName) => enemyPaths[pathName][0].id === this.position.id);
  };

  setNewPath = (pathName: string) => {
    this.pathName = pathName;
    this.path = enemyPaths[pathName];
  };
}

export default Enemy;
