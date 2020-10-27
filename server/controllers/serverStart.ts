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
  OnJoinGame,
  OnPlayerJoined,
  OnInitNewGame,
  OpenGame,
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
      if (games[id].status !== 'closed') {
        return { id, name: games[id].name, users: games[id].users, status: games[id].status };
      }
    })
    .filter((game) => game != null) as OpenGame[];
};

io.on('connection', (socket: ExtendedSocket) => {
  const params: OnStartScreen = { openGames: getOpenGames() };
  socket.emit('start screen', params);

  const updateOpenGames = () => {
    const params: OnUpdateOpenGames = { openGames: getOpenGames() };
    io.emit('update open games', params);
  };

  socket.on('init new game', ({ user }: OnInitNewGame) => {
    socket.game = new Game();

    games[socket.game.id] = {
      game: socket.game,
      name: `${user.username}'s game`,
      status: 'open',
      users: { [user.userID]: { username: user.username, role: '', playerId: '' } },
    };

    updateOpenGames();

    socket.join(socket.game.id);

    const paramsInit: OnInit = {
      enemyJoined: socket.game.enemyJoined,
      allGoodPlayersJoined: socket.game.players.length === 6,
    };
    socket.emit('init', paramsInit);

    logProgress(`${user.username} has joined`, { room: socket.game.id });
  });

  socket.on('join game', ({ gameID, user }: OnJoinGame) => {
    games[gameID].users[user.userID] = { username: user.username, role: '', playerId: '' };
    socket.game = games[gameID].game;

    if (Object.values(games[gameID].users).length === 7) {
      games[socket.game.id].status = 'full';
    }

    updateOpenGames();

    socket.join(socket.game.id);

    const paramsInit: OnInit = {
      enemyJoined: socket.game.enemyJoined,
      allGoodPlayersJoined: socket.game.players.length === 6,
    };
    socket.emit('init', paramsInit);

    io.in(socket.game.id).emit('waiting for players');

    logProgress(`${user.username} has joined`, { room: socket.game.id });
  });

  socket.on('player joined', ({ good, user }: OnPlayerJoined) => {
    if (good) {
      games[socket.game.id].users[user.userID].role = 'good';

      socket.player = new Player(socket.game.generatePlayerInfo(user.username));

      socket.game.addPlayer(socket.player as Player);
      games[socket.game.id].users[user.userID].playerId = socket.player.id;

      const params: OnSetUpPlayer = {
        id: socket.player.id,
        home: socket.player.home,
        key: socket.player.key,
        goal: socket.player.goal,
        isEvil: socket.player.isEvil,
      };
      socket.emit('set up player', params);

      if (socket.game.players.length === 6) {
        io.in(socket.game.id).emit('disable join as good');
      }
      updateOpenGames();
    } else {
      games[socket.game.id].users[user.userID].role = 'evil';
      games[socket.game.id].users[user.userID].playerId = 'e1';
      socket.player = socket.game.enemies;
      socket.player.username = user.username;
      socket.game.enemyJoined = true;
      const params: OnSetUpEnemy = {
        startPositions: [socket.player.e1.position, socket.player.e2.position],
      };
      socket.emit('set up enemy', params);
      io.in(socket.game.id).emit('disable join as evil');
      updateOpenGames();
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

    updateOpenGames();

    await sleep(1000);

    updateBoard(socket.game);
    startNextTurn(socket.game);
    logProgress(`Players turn`, { room: socket.game.id });
  });
});
