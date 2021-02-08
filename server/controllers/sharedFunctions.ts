import { io } from '../index';

import ClientPlayer from '../../src/modules/clientPlayer';

import Game from '../modules/serverGame';
import { ExtendedSocket } from '../serverTypes';
import {
  ClientUser,
  OnUpdateBoard,
  OnPlayersTurn,
  OnProgress,
  OnUpdatePlayer,
  OnGameOver,
  ProgressLogObject,
  OnSelectInitialPaths,
} from '../../src/shared/sharedTypes';

export const updateBoard = (game: Game) => {
  const params: OnUpdateBoard = game.getUpdatedBoardData();
  io.in(game.id).emit('update board', params);
};

export const updateBoardSocket = (socket: ExtendedSocket) => {
  const params: OnUpdateBoard = socket.game.getUpdatedBoardData();
  socket.emit('update board', params);
};

export const updatePlayer = (player: ClientPlayer, room: string) => {
  const params: OnUpdatePlayer = {
    id: player.id,
    hasKey: player.hasKey,
    hasGoal: player.hasGoal,
    visible: player.visible,
  };

  io.in(room).emit('update player', params);
};

export const selectInitialPaths = (game: Game) => {
  const params: OnSelectInitialPaths = { pathNames: game.enemies.e1.getNewPossiblePaths() };
  io.in(game.id).emit('select initial paths', params);
};

export const startNextTurn = (game: Game) => {
  io.in(game.id).emit('update round counter');

  const msg = [{ text: 'Players turn' }];
  logProgress(msg, { room: game.id });

  game.startNextTurn();

  if (game.roundCounter === 1) {
    io.in(game.id).emit('players first turn', {});
  } else {
    const params: OnPlayersTurn = { caughtPlayers: game.caughtPlayers };
    io.in(game.id).emit('players turn', params);
  }
};

export const logProgress = (msg: ProgressLogObject[], { socket, room }: { socket?: ExtendedSocket; room?: string }) => {
  const params: OnProgress = { msg };
  if (room) {
    io.in(room).emit('progress', params);
  } else if (socket) {
    socket.emit('progress', params);
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const gameOver = (winners: ClientUser[], room: string) => {
  const params: OnGameOver = { winners };
  io.in(room).emit('game over', params);
};

export const updateEnemyWinCounterClient = (room: string) => {
  io.in(room).emit('update enemy win counter');
};
