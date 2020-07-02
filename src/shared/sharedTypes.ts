import { OpenGame, ClientUser } from '../clientTypes';
import { Client } from 'socket.io';

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
  sound: number;
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

export interface OnPlayerPlacedToken {
  position: Position;
  turn: 'player' | 'enemy';
  enemyID: string;
  sound: number;
}

export interface OnUpdatePlayer {
  hasKey: boolean;
  hasGoal: boolean;
  visible: boolean;
}

export interface OnSelectEnemy {
  enemyID: string;
}

export interface OnPlayersTurn {
  resetPosition?: Position;
  caughtPlayers: string[];
}

export interface OnPlayerSelectsPace {
  pace: string;
}

export interface OnEnemySelectsPace {
  pace: string;
}

export interface OnSelectPath {
  path: Position[];
}

export interface OnProgress {
  msg: string;
}

export interface OnStartScreen {
  openGames: OpenGame[];
}

export interface OnUpdateOpenGames {
  openGames: OpenGame[];
}

export interface OnInit {
  enemyJoined: boolean;
}

export interface OnSetUpPlayer {
  id: string;
  home: Position;
  key: Position;
  goal: Position;
  isEvil: boolean;
}

export interface OnSetUpEnemy {
  startPositions: Position[];
}

export interface OnJoinGame {
  gameID: string;
  user: ClientUser;
}

export interface OnPlayerJoined {
  good: boolean;
  user: ClientUser;
}

export interface OnInitNewGame {
  user: ClientUser;
}
