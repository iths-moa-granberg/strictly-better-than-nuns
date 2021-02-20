import { io } from '../index';

import {
  emitUpdateBoard,
  emitStartNextTurn,
  emitLogProgress,
  emitUpdateBoardSocket,
  emitSelectInitialPaths,
} from './sharedEmitFunctions';
import { getEnemySeenMessages, getEnemyPossibleSteps } from '../modules/serverEnemyActionsUtils';
import { getRandomSound, isHeard, getSoundReach } from '../modules/boardUtils';

import { ExtendedSocket } from '../serverTypes';
import {
  OnPlayerSelectToken,
  OnChooseNewPath,
  OnPossibleSteps,
  OnEnemyTakesStep,
  OnSelectEnemy,
  OnEnemySelectsPace,
  OnSelectPath,
  OnPlayerPlacedToken,
  OnSetInitialPath,
  SoundToken,
} from '../../src/shared/sharedTypes';
import Enemy from '../modules/serverEnemy';

io.on('connection', (socket: ExtendedSocket) => {
  let currentEnemy: Enemy;

  socket.on('select enemy', ({ enemyID }: OnSelectEnemy) => {
    currentEnemy = socket.game.enemies[enemyID];
  });

  socket.on('enemy selects pace', ({ pace }: OnEnemySelectsPace) => {
    currentEnemy.selectPace(pace);
    emitPossibleSteps();
  });

  const emitPossibleSteps = () => {
    const possibleSteps = getEnemyPossibleSteps(socket.game, currentEnemy);

    const params: OnPossibleSteps = { possibleSteps, stepsLeft: currentEnemy.stepsLeft };
    socket.emit('possible steps', params);
  };

  socket.on('enemy takes step', ({ position }: OnEnemyTakesStep) => {
    if (currentEnemy.isFirstStep()) {
      const msg = [
        { text: currentEnemy.id === 'e1' ? 'Enemy 1' : 'Enemy 2', id: currentEnemy.id },
        { text: ` is ${currentEnemy.pace === 'run' ? 'running' : 'walking'}` },
      ];
      emitLogProgress(msg, { room: socket.game.id });
    }

    currentEnemy.move(position.id);
    socket.game.checkEnemyTarget(currentEnemy);

    const messages = getEnemySeenMessages(socket.game.players, socket.game.enemies, currentEnemy.id);
    messages.forEach((msg) => {
      emitLogProgress(msg, { room: socket.game.id });
    });

    emitUpdateBoard(socket.game);

    if (currentEnemy.endOfPath()) {
      emitChooseNewPath(currentEnemy.getNewPossiblePaths());
    } else {
      emitPossibleSteps();
    }
  });

  const emitChooseNewPath = (pathNames: string[]) => {
    const params: OnChooseNewPath = { pathNames };
    socket.emit('choose new path', params);
  };

  socket.on('set initial path', ({ pathName }: OnSetInitialPath) => {
    if (!socket.game.enemies.e1.pathName) {
      socket.game.enemies.e1.setNewPath(pathName);
      emitUpdateBoard(socket.game);
      emitSelectInitialPaths(socket.game);
    } else {
      socket.game.enemies.e2.setNewPath(pathName);
      emitUpdateBoard(socket.game);

      socket.game.startNextTurn();
      emitStartNextTurn(socket.game);
    }
  });

  socket.on('select path', ({ pathName }: OnSelectPath) => {
    currentEnemy.setNewPath(pathName);

    emitUpdateBoard(socket.game);
    emitPossibleSteps();
  });

  socket.on('enemy move completed', () => {
    socket.game.enemyMovesCompleted++;

    if (socket.game.enemyMovesCompleted < 2) {
      emitUpdateBoardSocket(socket);
      socket.emit('next enemy turn');
    } else {
      socket.game.enemyMovesCompleted = 0;
      enemiesMovesCompleted();
    }
  });

  const enemiesMovesCompleted = () => {
    socket.game.soundTokens = [];
    socket.game.sightTokens = [];
    socket.game.enemies.e1.playersVisible = [];
    socket.game.enemies.e2.playersVisible = [];

    enemyListen(socket.game.enemies.e1);
  };

  const enemyListen = (enemy: Enemy) => {
    if (enemy.pace === 'run') {
      waitForTokenPlacement(true);
      return;
    }

    const sound = getRandomSound();

    for (let player of socket.game.players) {
      if (!socket.game.isCaught(player.id) && !player.visible) {
        const playerSound = getSoundReach(player.pace, sound);
        const heardTo = isHeard(player.position, socket.game.enemies, playerSound, enemy.id);

        if (!heardTo) {
          waitForTokenPlacement();
        } else if (heardTo.length === 1) {
          socket.game.playerPlacedToken(heardTo[0].id, enemy.id);
          waitForTokenPlacement();
        } else {
          emitPlayerSelectToken(heardTo, player.id, enemy.id, sound);
        }
      } else {
        waitForTokenPlacement();
      }
    }
  };

  const emitPlayerSelectToken = (heardTo: SoundToken[], playerID: string, enemyID: 'e1' | 'e2', sound: number) => {
    const params: OnPlayerSelectToken = {
      heardTo,
      id: playerID,
      turn: 'enemy',
      enemyID,
      sound,
    };
    io.in(socket.game.id).emit('player select token', params);
  };

  socket.on('player placed token', ({ position, turn, enemyID }: OnPlayerPlacedToken) => {
    if (turn === 'enemy') {
      socket.game.playerPlacedToken(position.id, enemyID);
      waitForTokenPlacement();
    }
  });

  const waitForTokenPlacement = (run?: boolean) => {
    socket.game.placedSoundCounter++;

    if (socket.game.placedSoundCounter === socket.game.players.length || run) {
      socket.game.placedSoundCounter = 0;
      endEnemyTurn();
    }
  };

  const endEnemyTurn = () => {
    socket.game.enemyListened++;

    if (socket.game.enemyListened == 1) {
      enemyListen(socket.game.enemies.e2);
    } else if (socket.game.enemyListened == 2) {
      socket.game.logSound();

      socket.game.enemyListened = 0;
      emitUpdateBoard(socket.game);

      socket.game.startNextTurn();
      emitStartNextTurn(socket.game);
    }
  };
});
