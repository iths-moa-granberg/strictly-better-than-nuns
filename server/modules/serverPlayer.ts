import enemyPaths from './enemyPaths';
import { logProgress } from '../controllers/sharedFunctions';
import { Position } from '../../src/shared/sharedTypes';

interface Player {
  id: string;
  position: Position;
  home: Position;
  key: Position;
  goal: Position;
  visible: boolean;
  isEvil: boolean;
  pace: string;
  stepsLeft: number;
  path: PlayerPathPosition[];
  hasKey: boolean;
  hasGoal: boolean;
  caught: boolean;
  username: string;
}

interface Enemy {
  id: 'e1' | 'e2';
  position: Position;
  isEvil: boolean;
  stepsLeft: number;
  pace: string;

  playersVisible: boolean;
  path: Position[];
  pathName: string;
  lastPosition: Position;
}

interface PlayerPathPosition {
  position: Position;
  visible: boolean;
  enemyID: ('e1' | 'e2')[];
}

interface PlayerConstructor {
  id: string;
  home: Position;
  key: Position;
  goal: Position;
  username: string;
}

class Player {
  constructor({ id, home, key, goal, username }: PlayerConstructor) {
    this.id = id;
    this.position = home;

    this.home = home;
    this.key = key;
    this.goal = goal;

    this.visible = false;
    this.isEvil = false;

    this.pace = '';
    this.stepsLeft = 0;
    this.path = [{ position: home, visible: this.visible, enemyID: [] }];

    this.hasKey = false;
    this.hasGoal = false;

    this.caught = false;

    this.username = username;
  }

  isCaught = () => {
    this.caught = true;
    this.hasGoal = false;
  };

  checkTarget = (socket: any, room: string) => {
    if (this.hasKey) {
      if (this.hasGoal) {
        if (this.home.id === this.position.id) {
          logProgress(`${this.username} has won!`, { room });
        }
      } else if (this.goal.id === this.position.id) {
        this.hasGoal = true;
        logProgress(`You have reached your goal!`, { socket });
      }
    } else if (this.key.id === this.position.id) {
      this.hasKey = true;
      logProgress(`You have reached your key!`, { socket });
    }
  };

  resetPath = (enemyID: ('e1' | 'e2')[]) => {
    this.path = [{ position: this.position, visible: this.visible, enemyID }];
  };

  updatePathVisibility = (position: Position, enemyID: ('e1' | 'e2')[]) => {
    this.path.forEach((obj) => {
      if (obj.position.id === position.id) {
        obj.visible = true;
        obj.enemyID = enemyID;
      }
    });
  };
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

    this.playersVisible = false;
  }

  move = (position: Position) => {
    this.stepsLeft--;
    this.lastPosition = this.position;
    this.position = position;
  };

  checkTarget = (player: Player) => {
    return player.position.id === this.position.id;
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

export { Player, Enemy };
