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

class ClientPlayer {
  constructor(id: string, home: Position, key: Position, goal: Position) {
    this.id = id;
    this.isEvil = false;

    this.home = home;
    this.key = key;
    this.goal = goal;

    this.position = home;

    this.hasKey = false;
    this.hasGoal = false;
    this.visible = false;
  }
}

export default ClientPlayer;
