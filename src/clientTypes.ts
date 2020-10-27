import { ClientPlayer, ClientEnemy } from './modules/player';

export interface ClientEnemies {
  e1: ClientEnemy;
  e2: ClientEnemy;
  isEvil: boolean;
}

export type MyPlayer = ClientPlayer | ClientEnemies;

export interface ActionStateParams {
  pathNames: string[];
}
