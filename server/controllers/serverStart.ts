import { io } from '../index';

import * as startModule from '../modules/serverStartModule';
import { emitUpdateBoard, sleep, emitSelectInitialPaths } from './sharedEmitFunctions';

import { ExtendedSocket } from '../serverTypes';
import {
  OnStartScreen,
  OnUpdateOpenGames,
  OnInit,
  OnSetUpPlayer,
  OnSetUpEnemy,
  OnJoinGame,
  OnPlayerJoined,
  OnInitNewGame,
  OnSetEnemyWinGoal,
  OnInitialPlayerIDs,
  ClientUser,
} from '../../src/shared/sharedTypes';

io.on('connection', (socket: ExtendedSocket) => {
  const params: OnStartScreen = { openGames: startModule.getOpenGames() };
  socket.emit('start screen', params);

  const emitUpdateOpenGames = () => {
    const params: OnUpdateOpenGames = { openGames: startModule.getOpenGames() };
    io.emit('update open games', params);
  };

  const joinGame = (user: ClientUser, gameID?: string) => {
    if (gameID) {
      socket.game = startModule.joinGame(user, gameID);
    } else {
      socket.game = startModule.initNewGame(user);
    }

    emitUpdateOpenGames();

    socket.join(socket.game.id);

    const paramsInit: OnInit = {
      enemyJoined: socket.game.enemyJoined,
      allGoodPlayersJoined: socket.game.players.length === 6,
    };
    socket.emit('init', paramsInit);
  };

  socket.on('init new game', ({ user }: OnInitNewGame) => {
    joinGame(user);
  });

  socket.on('join game', ({ gameID, user }: OnJoinGame) => {
    joinGame(user, gameID);

    io.in(socket.game.id).emit('waiting for players');
  });

  socket.on('player joined', ({ good, user }: OnPlayerJoined) => {
    if (good) {
      socket.player = startModule.setUpGoodPlayer(user, socket.game.id);

      const params: OnSetUpPlayer = {
        id: socket.player.id,
        home: socket.player.home,
        key: socket.player.key,
        goal: socket.player.goal,
      };
      socket.emit('set up player', params);

      if (socket.game.players.length === 6) {
        io.in(socket.game.id).emit('disable join as good');
      }
    } else {
      socket.player = startModule.setUpEvilPlayer(user, socket.game.id);

      const params: OnSetUpEnemy = {
        startPositions: [socket.player.e1.position, socket.player.e2.position],
      };
      socket.emit('set up enemy', params);

      io.in(socket.game.id).emit('disable join as evil');
    }

    emitUpdateOpenGames();

    emitUpdateBoard(socket.game);

    if (startModule.arePlayersReady(socket.game.id)) {
      io.in(socket.game.id).emit('players ready');
    } else {
      io.in(socket.game.id).emit('waiting for players');
    }
  });

  socket.on('start', async () => {
    io.in(socket.game.id).emit('game started');

    startModule.closeGame(socket.game.id);

    emitUpdateOpenGames();

    await sleep(1000);

    const setEnemyWinGoalParams: OnSetEnemyWinGoal = { num: socket.game.players.length + 1 };
    io.in(socket.game.id).emit('set enemy win goal', setEnemyWinGoalParams);

    emitUpdateBoard(socket.game);

    //used to render players' homes after board is rendered for the first time
    const initialPlayerIDParams: OnInitialPlayerIDs = { playerIDs: socket.game.players.map((p) => p.id) };
    io.in(socket.game.id).emit('inital players id', initialPlayerIDParams);

    emitSelectInitialPaths(socket.game);
  });
});
