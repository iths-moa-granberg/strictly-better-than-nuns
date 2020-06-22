import Game from './modules/serverGame';
import { Player, Enemy } from './modules/serverPlayer';

export interface Position {
  id: number;
  x: number;
  y: number;
  neighbours: number[];
  inSight: number[];
  requireKey?: boolean;
}

export interface ClientPosition {
  id: number;
  x: number;
  y: number;
  neighbours: number[];
}

export interface ExtendedSocket extends SocketIO.Socket {
  game: Game;
  player: Player | Enemies;
}

export interface PlayerSocket extends SocketIO.Socket {
  game: Game;
  player: Player;
}

export interface Enemies {
  [key: string]: Enemy;
}

export interface Users {
  [key: string]: User;
}

interface User {
  username: string;
  role: string;
}
