import { Users, Position } from './shared/sharedTypes';
import { ClientPlayer, ClientEnemy } from './modules/player';

export interface ClientUser {
  username: string;
  userID: string;
}

export interface OpenGame {
  id: string;
  name: string;
  users: Users;
}

export type OpenGames = {
  id: string;
  name: string;
  users: Users;
}[];

export interface ClientEnemies {
  e1: ClientEnemy;
  e2: ClientEnemy;
  isEvil: boolean;
}

export type MyPlayer = ClientPlayer | ClientEnemies;

export interface ActionStateParams {
  paths: Position[][];
  showNewPathHandler: Function;
}
