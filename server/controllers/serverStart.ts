import { io } from '../index';
import Game from '../modules/serverGame';
import { Player } from '../modules/serverPlayer';
import { updateBoard, startNextTurn, logProgress, sleep } from './sharedFunctions';
import { ExtendedSocket } from '../serverTypes';
import {
  Users,
  OnStartScreen,
  OnUpdateOpenGames,
  OnInit,
  OnSetUpPlayer,
  OnSetUpEnemy,
} from '../../src/shared/sharedTypes';

interface Games {
  [key: string]: StartGame;
}

interface StartGame {
  game: Game;
  name: string;
  status: string;
  users: Users;
}

let games: Games = {};

const getOpenGames = () => {
  return Object.keys(games)
    .map((id) => {
      if (games[id].status === 'open') {
        return { id, name: games[id].name, users: games[id].users };
      }
    })
    .filter((game) => game != null);
};

io.on('connection', (socket: ExtendedSocket) => {
  const params: OnStartScreen = { openGames: getOpenGames() };
  socket.emit('start screen', params);

  socket.on('init new game', ({ user }: { user: { username: string; userID: string } }) => {
    socket.game = new Game();

    games[socket.game.id] = {
      game: socket.game,
      name: `${user.username}'s game`,
      status: 'open',
      users: { [user.userID]: { username: user.username, role: '' } },
    };

    const params: OnUpdateOpenGames = { openGames: getOpenGames() };
    io.emit('update open games', params);

    socket.join(socket.game.id);

    const paramsInit: OnInit = { enemyJoined: socket.game.enemyJoined };
    socket.emit('init', paramsInit);

    logProgress(`${user.username} has joined`, { room: socket.game.id });
  });

  socket.on('join game', ({ gameID, user }: { gameID: string; user: { username: string; userID: string } }) => {
    games[gameID].users[user.userID] = { username: user.username, role: '' };
    socket.game = games[gameID].game;

    const params: OnUpdateOpenGames = { openGames: getOpenGames() };
    io.emit('update open games', params);

    socket.join(socket.game.id);

    const paramsInit: OnInit = { enemyJoined: socket.game.enemyJoined };
    socket.emit('init', paramsInit);
    io.in(socket.game.id).emit('waiting for players');

    logProgress(`${user.username} has joined`, { room: socket.game.id });
  });

  socket.on('player joined', ({ good, user }: { good: boolean; user: { username: string; userID: string } }) => {
    if (good) {
      games[socket.game.id].users[user.userID].role = 'good';
      socket.player = new Player(socket.game.generatePlayerInfo(user.username));

      socket.game.addPlayer(socket.player as Player);

      const params: OnSetUpPlayer = {
        id: socket.player.id,
        home: socket.player.home,
        key: socket.player.key,
        goal: socket.player.goal,
        isEvil: socket.player.isEvil,
      };
      socket.emit('set up player', params);
    } else {
      games[socket.game.id].users[user.userID].role = 'evil';
      socket.player = socket.game.enemies;
      socket.game.enemyJoined = true;
      const params: OnSetUpEnemy = {
        startPositions: [socket.player.e1.position, socket.player.e2.position],
      };
      socket.emit('set up enemy', params);
      io.in(socket.game.id).emit('disable join as evil');
    }

    logProgress(`${user.username} is ${games[socket.game.id].users[user.userID].role}`, { room: socket.game.id });

    updateBoard(socket.game);
    if (playersReady()) {
      io.in(socket.game.id).emit('players ready');
    } else {
      io.in(socket.game.id).emit('waiting for players');
    }
  });

  const playersReady = () => {
    let users = games[socket.game.id].users;
    if (Object.values(users).length < 2) {
      return false;
    }
    if (Object.values(users).find((user) => user.role === '')) {
      return false;
    }
    return Boolean(Object.values(users).filter((user) => user.role === 'evil').length);
  };

  socket.on('start', async () => {
    logProgress(`The game has started!`, { room: socket.game.id });
    io.in(socket.game.id).emit('game started');

    games[socket.game.id].status = 'closed';

    const params: OnUpdateOpenGames = { openGames: getOpenGames() };
    io.emit('update open games', params);

    await sleep(1000);

    updateBoard(socket.game);
    startNextTurn(socket.game);
    logProgress(`Players turn`, { room: socket.game.id });
  });
});
