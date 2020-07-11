import { Position } from '../shared/sharedTypes';

interface ClientPlayer {
  id: string;
  isEvil: boolean;
  home: Position;
  key: Position;
  goal: Position;
  position: Position;
  hasKey: boolean;
  hasGoal: boolean;
  visible: boolean;
}

interface ClientEnemy {
  id: string;
  position: Position;
  isEvil: boolean;
}

class ClientPlayer {
  constructor(id: string, home: Position, key: Position, goal: Position, isEvil: boolean) {
    this.id = id;
    this.isEvil = isEvil;

    this.home = home;
    this.key = key;
    this.goal = goal;

    this.position = home;

    this.hasKey = false;
    this.hasGoal = false;
    this.visible = false;
  }
}

class ClientEnemy {
  constructor(id: string, position: Position) {
    this.id = id;
    this.position = position;
    this.isEvil = true;
  }
}

export { ClientPlayer, ClientEnemy };
