import { io } from '../index';

import {
  actOnPlayerResetMove,
  getPlayerStatus,
  playerStepOptions,
  updatePlayerOnStep,
} from '../modules/serverPlayerActionsUtils';

import { updateBoard, logProgress, updatePlayer, updateBoardSocket, gameOver } from './sharedFunctions';
import { getSoundReach, getRandomSound, isHeard } from '../modules/boardUtils';

import { PlayerSocket, Enemies } from '../serverTypes';
import {
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
  const emitPossibleSteps = () => {
    const possibleSteps = playerStepOptions(socket.player, socket.game);
    const params: OnPossibleSteps = { possibleSteps };
    socket.emit('possible steps', params);
  };

  socket.on('player selects pace', ({ pace, firstTurn }: OnPlayerSelectsPace) => {
    socket.player.selectPace(pace, firstTurn);

    emitPossibleSteps();
  });

  socket.on('player takes step', ({ position }: OnPlayerTakesStep) => {
    updatePlayerOnStep(socket.player, position.id, socket.game.enemies);

    const playerStatus = getPlayerStatus(socket.player, socket.game);

    if (playerStatus.seen) {
      const msg = [{ text: 'You are seen! Click back if you want to take a different route' }];
      logProgress(msg, { socket });
    }

    if (playerStatus.setFree) {
      const msg = [{ text: 'You are out of sight and can move freely again' }];
      logProgress(msg, { socket });
    }

    emitPossibleSteps();
  });

  socket.on('player reset move', () => {
    actOnPlayerResetMove(socket.player, socket.game);

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
      makeSound(socket.player);
    }
  });

  const makeSound = (player: Player, sound?: number) => {
    if (!sound) {
      sound = getSoundReach(player.pace, getRandomSound());
    }

    if (socket.game.enemyListened === 0) {
      socket.game.enemyListened++;
      emitSound(player, sound, socket.game.enemies.e1, socket.game.enemies);
    } else if (socket.game.enemyListened === 1) {
      socket.game.enemyListened++;
      emitSound(player, sound, socket.game.enemies.e2, socket.game.enemies);
    } else {
      socket.game.enemyListened = 0;
      endPlayerTurn();
    }
  };

  const emitSound = (player: Player, sound: number, enemy: Enemy, enemies: Enemies) => {
    const heardTo = isHeard(player.position, enemies, sound, enemy.id);

    if (!heardTo) {
      makeSound(player, sound);
    } else if (heardTo.length === 1) {
      socket.game.playerPlacedToken(heardTo[0].id, enemy.id);
      makeSound(player, sound);
    } else if (heardTo.length > 1) {
      const params: OnPlayerSelectToken = {
        heardTo,
        id: player.id,
        turn: 'player',
        enemyID: enemy.id,
        sound,
      };
      socket.emit('player select token', params);
    }
  };

  socket.on('player placed token', ({ position, turn, enemyID, sound }: OnPlayerPlacedToken) => {
    if (turn === 'player') {
      socket.game.playerPlacedToken(position.id, enemyID);
      makeSound(socket.player, sound);
    }
  });

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
        socket.game.playerLeavesSight(player);
        socket.player.resetPath(socket.player.path[0].enemyID);

        updatePlayer(player, socket.game.id);
      }

      socket.game.logSound();

      if (socket.game.winners.length) {
        gameOver(socket.game.winners, socket.game.id);
      }

      emitStartEnemyTurn();
    } else {
      socket.emit('enemy turn');
    }
  };

  const emitStartEnemyTurn = () => {
    updateBoard(socket.game);
    io.in(socket.game.id).emit('enemy turn');

    const msg = [{ text: 'Enemy turn' }];
    logProgress(msg, { room: socket.game.id });
  };
});
