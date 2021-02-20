import { emitLogProgress } from '../controllers/sharedEmitFunctions';

import { Position } from '../../src/shared/sharedTypes';
import { PlayerSocket } from '../serverTypes';
import positions from '../../src/shared/positions';

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
  readonly position: Position;
  visible: boolean;
  enemyID: ('e1' | 'e2')[];
}

interface PlayerConstructor {
  readonly id: string;
  readonly home: Position;
  readonly key: Position;
  readonly goal: Position;
  readonly username: string;
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

  checkTarget = (socket: PlayerSocket) => {
    if (this.hasKey) {
      if (this.hasGoal) {
        if (this.home.id === this.position.id) {
          socket.game.winners.push({ username: this.username, userID: this.id });
        }
      } else if (this.goal.id === this.position.id) {
        this.hasGoal = true;

        const msg = [{ text: `You have reached your goal!` }];
        emitLogProgress(msg, { socket });
      }
    } else if (this.key.id === this.position.id) {
      this.hasKey = true;

      const msg = [{ text: `You have reached your key!` }];
      emitLogProgress(msg, { socket });
    }
  };

  resetPath = (enemyID: ('e1' | 'e2')[]) => {
    this.path = [{ position: this.position, visible: this.visible, enemyID }];
  };

  resetMove = () => {
    this.position = this.path[0].position;
    this.visible = this.path[0].visible;
    this.resetPath(this.path[0].enemyID);
  };

  updatePathVisibility = (position: Position, enemyID: ('e1' | 'e2')[]) => {
    if (enemyID.length) {
      this.path.forEach((obj) => {
        if (obj.position.id === position.id) {
          obj.visible = true;
          obj.enemyID = enemyID;
        }
      });
    } else {
      console.log('Error: player.updatePathVisibility called with empty enemyID');
    }
  };

  selectPace = (pace: string, firstTurn?: boolean) => {
    this.pace = pace;
    this.stepsLeft = pace === 'stand' ? 0 : pace === 'sneak' ? 2 : pace === 'walk' ? 3 : 5;

    if (firstTurn) {
      this.stepsLeft = pace === 'run' ? 8 : this.stepsLeft * 2;
    }
  };

  takeStep = (positionID: number) => {
    this.position = positions[positionID];
    this.stepsLeft--;
  };

  addToPath = (enemyID: ('e1' | 'e2')[]) => {
    this.path.push({
      position: this.position,
      visible: this.visible,
      enemyID,
    });
  };
}

export default Player;
