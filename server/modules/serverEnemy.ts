import enemyPaths from './enemyPaths';
import { Position } from '../../src/shared/sharedTypes';
import Player from './serverPlayer';

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
    if (id === 'e1') {
      this.path = enemyPaths.purpleA;
      this.pathName = 'purpleA';
    } else {
      this.path = enemyPaths.lightPurpleB;
      this.pathName = 'lightPurpleB';
    }

    this.id = id;
    this.position = this.path[0];
    this.lastPosition = this.path[0];

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
