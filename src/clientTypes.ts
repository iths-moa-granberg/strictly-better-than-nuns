import ClientPlayer from './modules/clientPlayer';
import ClientEnemy from './modules/clientEnemy';

export interface ClientEnemies {
  e1: ClientEnemy;
  e2: ClientEnemy;
  isEvil: boolean;
}

export type MyPlayer = ClientPlayer | ClientEnemies;

export interface ActionStateParams {
  pathNames: string[];
  selectInitial?: boolean;
}
