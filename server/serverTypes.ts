import Game from './modules/serverGame';
import { Player, Enemy } from './modules/serverPlayer';

export interface ExtendedSocket extends SocketIO.Socket {
  game: Game;
  player: Player | Enemies;
}

export interface PlayerSocket extends SocketIO.Socket {
  game: Game;
  player: Player;
}

export interface Enemies {
  e1: Enemy;
  e2: Enemy;
  username: string;
}
