import ClientPlayer from './modules/clientPlayer';
import ClientEnemy from './modules/clientEnemy';

export interface ClientEnemies {
  e1: ClientEnemy;
  e2: ClientEnemy;
  isEvil: boolean;
}

export type MyPlayer = ClientPlayer | ClientEnemies;

interface ActionStateParams {
  pathNames: string[];
  selectInitial?: boolean;
}

export interface ActionState {
  key: string;
  params?: ActionStateParams;
}
