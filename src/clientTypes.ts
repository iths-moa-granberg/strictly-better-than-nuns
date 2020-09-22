import { Position } from './shared/sharedTypes';
import { ClientPlayer, ClientEnemy } from './modules/player';

export interface ClientUser {
  username: string;
  userID: string;
}

export interface ClientEnemies {
  e1: ClientEnemy;
  e2: ClientEnemy;
  isEvil: boolean;
}

export type MyPlayer = ClientPlayer | ClientEnemies;

export interface ActionStateParams {
  pathNames: string[];
}
