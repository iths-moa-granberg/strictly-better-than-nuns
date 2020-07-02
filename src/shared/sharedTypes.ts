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

export type Players = { id: string; position: Position }[];

export interface OnUpdateBoard {
  players: Players;
  soundTokens: SoundToken[];
  sightTokens: SightToken[];
  enemyPaths: Position[][];
  reachablePositions: Position[];
}

export interface OnPlayerSelectToken {
  heardTo: SoundToken[];
  id: string;
  turn: 'enemy' | 'player';
  enemyID: string;
  sound?: number;
}

export interface OnChooseNewPath {
  paths: Position[][];
}

export interface OnPossibleSteps {
  possibleSteps: Position[];
  stepsLeft?: number;
}

export interface OnEnemyTakesStep {
  position: Position;
}

export interface OnPlayerTakesStep {
  position: Position;
}

