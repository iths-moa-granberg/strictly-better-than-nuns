import { io } from '../index';
import Game from '../modules/serverGame';
import { Player } from '../modules/serverPlayer';
import { ExtendedSocket } from '../serverTypes';
import {
  ClientUser,
  Position,
  OnUpdateBoard,
  OnPlayersTurn,
  OnProgress,
  OnUpdatePlayer,
  OnGameOver,
  ProgressLogObject,
} from '../../src/shared/sharedTypes';
import { ClientPlayer } from '../../src/modules/player';

const _updateBoard = (game: Game) => {
  const visiblePlayers = game.getVisiblePlayers();
  visiblePlayers.push({
    id: 'e1',
    position: game.enemies.e1.position,
    direction: getDirection(game.enemies.e1.position, game.enemies.e1.lastPosition),
  });
  visiblePlayers.push({
    id: 'e2',
    position: game.enemies.e2.position,
    direction: getDirection(game.enemies.e2.position, game.enemies.e2.lastPosition),
  });

  const reachablePositions: Position[] = [];

  return {
    visiblePlayers,
    soundTokens: game.soundTokens,
    sightTokens: game.sightTokens,
    enemyPaths: [game.enemies.e1.pathName, game.enemies.e2.pathName],
    reachablePositions,
  };
};

export const updateBoard = (game: Game) => {
  const params: OnUpdateBoard = _updateBoard(game);
  io.in(game.id).emit('update board', params);
};

export const updateBoardSocket = (game: Game, socket: ExtendedSocket) => {
  const params: OnUpdateBoard = _updateBoard(game);
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

const getDirection = (position: Position, lastPosition: Position) => {
  if (position.x !== lastPosition.x && position.y !== lastPosition.y) {
    if (Math.abs(position.x - lastPosition.x) > Math.abs(position.y - lastPosition.y)) {
      return position.x > lastPosition.x ? 'right' : 'left';
    }
    return position.y > lastPosition.y ? 'down' : 'up';
  } else if (position.x === lastPosition.x) {
    return position.y > lastPosition.y ? 'down' : 'up';
  } else if (position.y === lastPosition.y) {
    return position.x > lastPosition.x ? 'right' : 'left';
  }
  return 'up';
};

export const startNextTurn = (game: Game) => {
  io.in(game.id).emit('update round counter');

  game.startNextTurn();

  const params: OnPlayersTurn = { caughtPlayers: game.caughtPlayers };
  io.in(game.id).emit('players turn', params);
};

export const logProgress = (msg: ProgressLogObject[], { socket, room }: { socket?: ExtendedSocket; room?: string }) => {
  const params: OnProgress = { msg };
  if (room) {
    io.in(room).emit('progress', params);
  } else if (socket) {
    socket.emit('progress', params);
  }
};

export const logSound = (game: Game) => {
  if (
    game.soundTokens.find((token) => token.enemyID === 'e1') &&
    game.soundTokens.find((token) => token.enemyID === 'e2')
  ) {
    const msg = [{ text: 'Both enemies heard someone!' }];
    logProgress(msg, { room: game.id });
  } else {
    if (game.soundTokens.find((token) => token.enemyID === 'e1')) {
      const msg = [
        {
          text: 'Enemy 1',
          id: 'e1',
        },
        { text: ' heard someone!' },
      ];
      logProgress(msg, { room: game.id });
    }
    if (game.soundTokens.find((token) => token.enemyID === 'e2')) {
      const msg = [
        {
          text: 'Enemy 2',
          id: 'e2',
        },
        { text: ' heard someone!' },
      ];
      logProgress(msg, { room: game.id });
    }
  }
};

export const isSeen = (player: Player, game: Game) => {
  let seenBy: ('e1' | 'e2')[] = [];
  if (
    game.board.isSeen(player.position, game.enemies.e1.position, game.enemies.e1.lastPosition) ||
    game.enemies.e1.position.id === player.position.id
  ) {
    seenBy.push('e1');
    if (!game.enemies.e1.playersVisible.includes(player.id)) {
      game.enemies.e1.playersVisible.push(player.id);
    }
  }
  if (
    game.board.isSeen(player.position, game.enemies.e2.position, game.enemies.e2.lastPosition) ||
    game.enemies.e2.position.id === player.position.id
  ) {
    seenBy.push('e2');
    if (!game.enemies.e2.playersVisible.includes(player.id)) {
      game.enemies.e2.playersVisible.push(player.id);
    }
  }
  return seenBy;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const gameOver = (winner: ClientUser, room: string) => {
  const params: OnGameOver = { winner };
  io.in(room).emit('game over', params);
};

export const updateEnemyWinCounterClient = (room: string) => {
  io.in(room).emit('update enemy win counter');
};
