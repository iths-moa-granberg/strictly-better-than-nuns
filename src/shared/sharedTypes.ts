export interface Position {
  id: number;
  x: number;
  y: number;
  neighbours: number[];
  inSight: number[];
  requireKey?: boolean;
}

export interface Users {
  [key: string]: User;
}

interface User {
  username: string;
  role: string;
}

export interface SightToken {
  id: number;
  enemyID: string[];
}

export interface SoundToken {
  id: number;
  enemyID: string;
}
