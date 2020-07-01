import { Position } from '../shared/sharedTypes';

interface Player {
  id: string;
  isEvil: boolean;
  home: Position;
  key: Position;
  goal: Position;
  position: Position;
  hasKey: boolean;
  hasGoal: boolean;
}

interface Enemy {
  id: string;
  position: Position;
  isEvil: boolean;
}

class Player {
  constructor(id: string, home: Position, key: Position, goal: Position, isEvil: boolean) {
    this.id = id;
    this.isEvil = isEvil;

    this.home = home;
    this.key = key;
    this.goal = goal;

    this.position = home;

    this.hasKey = false;
    this.hasGoal = false;
  }
}

class Enemy {
  constructor(id: string, position: Position) {
    this.id = id;
    this.position = position;
    this.isEvil = true;
  }
}

export { Player, Enemy };
