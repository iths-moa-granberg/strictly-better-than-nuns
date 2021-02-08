import { io } from '../index';

import { updateBoard, logProgress, updatePlayer, updateBoardSocket, gameOver } from './sharedFunctions';
import {
  getClosestWayHome,
  getReachable,
  getSeenBy,
  getSoundReach,
  getRandomSound,
  isHeard,
} from '../modules/boardUtils';

import { PlayerSocket, Enemies } from '../serverTypes';
import {
  Position,
  OnPlayerSelectToken,
  OnPossibleSteps,
  OnPlayersTurn,
  OnPlayerSelectsPace,
  OnPlayerPlacedToken,
  OnPlayerTakesStep,
  OnPlayersFirstTurn,
} from '../../src/shared/sharedTypes';
import Player from '../modules/serverPlayer';
import Enemy from '../modules/serverEnemy';

io.on('connection', (socket: PlayerSocket) => {
  socket.on('player selects pace', ({ pace, firstTurn }: OnPlayerSelectsPace) => {
    socket.player.pace = pace;
    socket.player.stepsLeft = pace === 'stand' ? 0 : pace === 'sneak' ? 2 : pace === 'walk' ? 3 : 5;

    if (firstTurn) {
      socket.player.stepsLeft = pace === 'run' ? 8 : socket.player.stepsLeft * 2;
    }

    playerStepOptions();
  });

  const playerStepOptions = () => {
    let possibleSteps: Position[] = [];
    if (socket.game.isCaught(socket.player.id)) {
      possibleSteps = getClosestWayHome(
        socket.player.position,
        socket.player.home,
        socket.player.hasKey,
        socket.player.stepsLeft
      );
    } else {
      const enemiesPositionsIDn = [socket.game.enemies.e1.position.id, socket.game.enemies.e2.position.id];
      possibleSteps = getReachable(
        socket.player.position,
        socket.player.stepsLeft,
        socket.player.hasKey,
        socket.player.isEvil,
        enemiesPositionsIDn
      );
    }
    const params: OnPossibleSteps = { possibleSteps };
    socket.emit('possible steps', params);
  };

  socket.on('player takes step', ({ position }: OnPlayerTakesStep) => {
    const serverPosition = socket.game.getServerPosition(position.id);
    socket.player.position = serverPosition;
    socket.player.stepsLeft--;

    const seenBy = getSeenBy(socket.player, socket.game.enemies);
    socket.player.visible = Boolean(seenBy.length);
    if (seenBy.length && !socket.game.isCaught(socket.player.id)) {
      const msg = [{ text: 'You are seen! Click back if you want to take a different route' }];
      logProgress(msg, { socket });
    }

    if (socket.game.isCaught(socket.player.id) && !socket.player.visible) {
      socket.game.removeCaughtPlayer(socket.player);

      const msg = [{ text: 'You are out of sight and can move freely again' }];
      logProgress(msg, { socket });
    }
    socket.player.path.push({ position: socket.player.position, visible: socket.player.visible, enemyID: seenBy });

    playerStepOptions();
  });

  socket.on('player reset move', () => {
    socket.player.position = socket.player.path[0].position;
    socket.player.visible = socket.player.path[0].visible;
    socket.player.resetPath(socket.player.path[0].enemyID);
    socket.game.filterPlayersVisible(socket.player.id);

    if (socket.player.caught) {
      socket.game.addCaughtPlayer(socket.player);
    }

    if (socket.game.roundCounter === 1) {
      const params: OnPlayersFirstTurn = { resetPosition: socket.player.position };
      socket.emit('players first turn', params);
    } else {
      const params: OnPlayersTurn = { resetPosition: socket.player.position, caughtPlayers: socket.game.caughtPlayers };
      socket.emit('players turn', params);
    }
    updateBoardSocket(socket);
  });

  socket.on('player move completed', () => {
    socket.player.checkTarget(socket);

    if (socket.player.visible) {
      endPlayerTurn();
    } else if (socket.player.caught) {
      socket.player.caught = false;
      endPlayerTurn();
    } else {
      const sound = getSoundReach(socket.player.pace, getRandomSound());
      playerMakeSound(socket.player, sound);
    }
  });

  const playerMakeSound = (player: Player, sound: number) => {
    if (socket.game.enemyListened === 0) {
      socket.game.enemyListened++;
      makeSound(player, sound, socket.game.enemies.e1, socket.game.enemies);
    } else if (socket.game.enemyListened === 1) {
      socket.game.enemyListened++;
      makeSound(player, sound, socket.game.enemies.e2, socket.game.enemies);
    } else {
      socket.game.enemyListened = 0;
      endPlayerTurn();
    }
  };

  const makeSound = (player: Player, sound: number, enemy: Enemy, enemies: Enemies) => {
    const heardTo = isHeard(player.position, enemies, sound, enemy.id);
    if (heardTo) {
      if (heardTo.length > 1) {
        const params: OnPlayerSelectToken = {
          heardTo,
          id: player.id,
          turn: 'player',
          enemyID: enemy.id,
          sound,
        };
        socket.emit('player select token', params);
        return;
      } else {
        socket.game.addToken(heardTo[0].id, 'sound', enemy.id);
        socket.game.newSoundLog.push(enemy.id);
      }
    }
    playerMakeSound(player, sound);
  };

  socket.on('player placed token', ({ position, turn, enemyID, sound }: OnPlayerPlacedToken) => {
    if (turn === 'player') {
      socket.game.addToken(position.id, 'sound', enemyID);
      socket.game.newSoundLog.push(enemyID);
      playerMakeSound(socket.player, sound);
    }
  });

  const leaveSight = (player: Player) => {
    let path = player.path.reverse();
    for (let obj of path) {
      if (obj.visible && obj != path[0]) {
        socket.game.addToken(obj.position.id, 'sight', obj.enemyID);

        const msg = [{ text: player.username, id: player.id }, { text: ' has disappeared' }];
        logProgress(msg, { room: socket.game.id });
        return;
      }
    }
  };

  const endPlayerTurn = () => {
    socket.game.playerTurnCompleted++;

    const msg = [
      { text: socket.player.username, id: socket.player.id },
      { text: ` is ${socket.player.pace === 'run' ? 'runn' : socket.player.pace}ing` },
    ];
    logProgress(msg, { room: socket.game.id });

    if (socket.game.playerTurnCompleted === socket.game.players.length) {
      socket.game.playerTurnCompleted = 0;

      for (let player of socket.game.players) {
        leaveSight(player);
        socket.player.resetPath(socket.player.path[0].enemyID);

        updatePlayer(player, socket.game.id);
      }

      socket.game.logSound();

      if (socket.game.winners.length) {
        gameOver(socket.game.winners, socket.game.id);
      }

      startEnemyTurn();
    } else {
      socket.emit('enemy turn');
    }
  };

  const startEnemyTurn = () => {
    updateBoard(socket.game);
    io.in(socket.game.id).emit('enemy turn');

    const msg = [{ text: 'Enemy turn' }];
    logProgress(msg, { room: socket.game.id });
  };
});
