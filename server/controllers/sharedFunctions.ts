import { io } from '../index';
import Game from '../modules/serverGame';
import { Player } from '../modules/serverPlayer';
import { ExtendedSocket } from '../serverTypes';
import { Position, OnUpdateBoard } from '../../src/shared/sharedTypes';

export const updateBoard = (game: Game) => {
  const players = game.getVisiblePlayers();
  players.push({ id: 'e1', position: game.enemies.e1.position });
  players.push({ id: 'e2', position: game.enemies.e2.position });

  const reachablePositions: Position[] = [];

  const params: OnUpdateBoard = {
    players,
    soundTokens: game.soundTokens,
    sightTokens: game.sightTokens,
    enemyPaths: [game.enemies.e1.path, game.enemies.e2.path],
    reachablePositions,
  };
  io.in(game.id).emit('update board', params);
};

export const startNextTurn = (game: Game) => {
  game.startNextTurn();
  io.in(game.id).emit('players turn', { caughtPlayers: game.caughtPlayers });
};

export const logProgress = (msg: string, { socket, room }: { socket?: ExtendedSocket; room?: string }) => {
  if (room) {
    io.in(room).emit('progress', { msg });
  } else if (socket) {
    socket.emit('progress', { msg });
  }
};

export const logSound = (game: Game) => {
  if (
    game.soundTokens.find((token) => token.enemyID === 'e1') &&
    game.soundTokens.find((token) => token.enemyID === 'e2')
  ) {
    logProgress(`Both enemies heard someone!`, { room: game.id });
  } else {
    if (game.soundTokens.find((token) => token.enemyID === 'e1')) {
      logProgress(`e1 heard someone!`, { room: game.id });
    }
    if (game.soundTokens.find((token) => token.enemyID === 'e2')) {
      logProgress(`e2 heard someone!`, { room: game.id });
    }
  }
};

export const isSeen = (player: Player, game: Game) => {
  let seenBy = [];
  if (
    game.board.isSeen(player.position, game.enemies.e1.position, game.enemies.e1.lastPosition) ||
    game.enemies.e1.position.id === player.position.id
  ) {
    seenBy.push('e1');
    game.enemies.e1.playersVisible = true;
  }
  if (
    game.board.isSeen(player.position, game.enemies.e2.position, game.enemies.e2.lastPosition) ||
    game.enemies.e2.position.id === player.position.id
  ) {
    seenBy.push('e2');
    game.enemies.e2.playersVisible = true;
  }
  return seenBy;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
