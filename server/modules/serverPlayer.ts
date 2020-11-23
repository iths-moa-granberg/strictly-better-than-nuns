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

  checkTarget = (socket: any) => {
    if (this.hasKey) {
      if (this.hasGoal) {
        if (this.home.id === this.position.id) {
          socket.game.winners.push({ username: this.username, userID: this.id });
        }
      } else if (this.goal.id === this.position.id) {
        this.hasGoal = true;

        const msg = [{ text: `You have reached your goal!` }];
        logProgress(msg, { socket });
      }
    } else if (this.key.id === this.position.id) {
      this.hasKey = true;

      const msg = [{ text: `You have reached your key!` }];
      logProgress(msg, { socket });
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

export default Player;
