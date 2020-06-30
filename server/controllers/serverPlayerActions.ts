import { io } from '../index';
import { updateBoard, logProgress, logSound, isSeen } from './sharedFunctions';
import { PlayerSocket, Position, ClientPosition } from '../types';
import { Player, Enemy } from '../modules/serverPlayer';

io.on('connection', (socket: PlayerSocket) => {
  socket.on('player selects pace', ({ pace }: { pace: string }) => {
    socket.player.pace = pace;
    socket.player.stepsLeft = pace === 'stand' ? 0 : pace === 'sneak' ? 1 : pace === 'walk' ? 3 : 5;
    playerStepOptions();
  });

  const playerStepOptions = () => {
    let possibleSteps = [];
    if (socket.game.isCaught(socket.player)) {
      possibleSteps = socket.game.board.getClosestWayHome(
        socket.player.position,
        socket.player.home,
        socket.player.hasKey
      );
    } else {
      possibleSteps = socket.game.board.getReachable(
        socket.player.position,
        socket.player.stepsLeft,
        socket.player.hasKey
      );
    }
    socket.emit('possible steps', { possibleSteps });
  };

  socket.on('player takes step', ({ position }: { position: ClientPosition }) => {
    const serverPosition = socket.game.getServerPosition(position.id);
    socket.player.position = serverPosition;
    socket.player.stepsLeft--;

    const seenBy = isSeen(socket.player, socket.game);
    socket.player.visible = Boolean(seenBy.length);
    if (seenBy.length) {
      logProgress(`You are seen! Click back if you want to take a different route`, { socket });
    }

    if (socket.game.isCaught(socket.player) && !socket.player.visible) {
      socket.game.removeCaughtPlayer(socket.player);
      logProgress(`You are out of sight and can move freely again`, { socket });
    }
    socket.player.path.push({ position: socket.player.position, visible: socket.player.visible, enemyID: seenBy });

    playerStepOptions();
  });

  socket.on('player reset move', () => {
    socket.player.position = socket.player.path[0].position;
    socket.player.visible = socket.player.path[0].visible;
    socket.player.resetPath(socket.player.path[0].enemyID);
    if (socket.player.caught) {
      socket.game.addCaughtPlayer(socket.player);
    }
    socket.emit('players turn', { resetPosition: socket.player.position, caughtPlayers: socket.game.caughtPlayers });
  });

  socket.on('player move completed', () => {
    socket.player.checkTarget(socket, socket.game.id);

    if (socket.player.visible || socket.player.caught) {
      endPlayerTurn();
    } else {
      socket.player.caught = false;
      leaveSight(socket.player);

      const sound = socket.game.board.getSoundReach(socket.player.pace, socket.game.board.getRandomSound());
      playerMakeSound(socket.player, sound);
    }
  });

  const leaveSight = (player: Player) => {
    let path = player.path.reverse();
    for (let obj of path) {
      if (obj.visible && obj != path[0]) {
        socket.game.addToken(obj.position.id, 'sight', obj.enemyID);
        logProgress(`${player.username} has disappeared`, { room: socket.game.id });
        return;
      }
    }
  };

  const playerMakeSound = (player: Player, sound: number) => {
    if (socket.game.enemyListened === 0) {
      socket.game.enemyListened++;
      makeSound(player, sound, socket.game.enemies.e1);
    } else if (socket.game.enemyListened === 1) {
      socket.game.enemyListened++;
      makeSound(player, sound, socket.game.enemies.e2);
    } else {
      socket.game.enemyListened = 0;
      endPlayerTurn();
    }
  };

  const makeSound = (player: Player, sound: number, enemy: Enemy) => {
    const heardTo = socket.game.board.isHeard(player.position, enemy.position, sound);
    if (heardTo) {
      if (heardTo.length > 1) {
        socket.emit('player select token', { heardTo, id: player.id, turn: 'player', enemyID: enemy.id, sound });
        return;
      } else {
        socket.game.addToken(heardTo[0].id, 'sound', enemy.id);
      }
    }
    playerMakeSound(player, sound);
  };

  socket.on(
    'player placed token',
    ({ position, turn, enemyID, sound }: { position: Position; turn: string; enemyID: string; sound: number }) => {
      if (turn === 'player') {
        socket.game.addToken(position.id, 'sound', enemyID);
        playerMakeSound(socket.player, sound);
      }
    }
  );

  const endPlayerTurn = () => {
    socket.player.resetPath(socket.player.path[0].enemyID);

    socket.emit('update player', {
      hasKey: socket.player.hasKey,
      hasGoal: socket.player.hasGoal,
      visible: socket.player.visible,
    });
    socket.game.playerTurnCompleted++;
    if (socket.game.playerTurnCompleted === socket.game.players.length) {
      socket.game.playerTurnCompleted = 0;
      logSound(socket.game);
      startEnemyTurn();
    }
  };

  const startEnemyTurn = () => {
    updateBoard(socket.game);
    io.in(socket.game.id).emit('enemy turn');

    logProgress(`Enemy turn`, { room: socket.game.id });
  };
});
