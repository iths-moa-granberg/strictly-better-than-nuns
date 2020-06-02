import Game from './modules/serverGame';
import { Player, Enemy } from './modules/serverPlayer';

export interface Position {
    id: number,
    x: number;
    y: number;
    neighbours: number[];
    inSight: number[];
    requireKey?: boolean;
}

export interface ExtendedSocket extends SocketIO.Socket {
    game: Game;
    player: Player | Enemies;
}

export interface Enemies {
    e1: Enemy;
    e2: Enemy;
}