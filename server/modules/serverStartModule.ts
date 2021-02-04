import Game from './serverGame';
import Player from './serverPlayer';

import { ClientUser, OpenGame, Users } from '../../src/shared/sharedTypes';

interface Games {
  [key: string]: StartGame;
}

interface StartGame {
  game: Game;
  name: string;
  status: string;
  users: Users;
}

export const games: Games = {};

export const getOpenGames = () => {
  return Object.keys(games)
    .map((id) => {
      if (games[id].status !== 'closed') {
        return { id, name: games[id].name, users: games[id].users, status: games[id].status };
      }
    })
    .filter((game) => game != null) as OpenGame[];
};

export const arePlayersReady = (gameID: string) => {
  let users = games[gameID].users;
  if (Object.values(users).length < 2) {
    return false;
  }
  if (Object.values(users).find((user) => user.role === '')) {
    return false;
  }
  return Boolean(Object.values(users).filter((user) => user.role === 'evil').length);
};

export const initNewGame = (user: ClientUser) => {
  const newGame = new Game();

  games[newGame.id] = {
    game: newGame,
    name: `${user.username}'s game`,
    status: 'open',
    users: { [user.userID]: { username: user.username, role: '', playerId: '' } },
  };

  return newGame;
};

export const joinGame = (user: ClientUser, gameID: string) => {
  const currentGame = games[gameID];
  currentGame.users[user.userID] = { username: user.username, role: '', playerId: '' };

  if (Object.values(currentGame.users).length === 7) {
    currentGame.status = 'full';
  }

  return currentGame.game;
};

export const setUpGoodPlayer = (user: ClientUser, gameID: string) => {
  games[gameID].users[user.userID].role = 'good';

  const currentGame = games[gameID].game;
  const newPlayer = new Player(currentGame.generatePlayerInfo(user.username));

  currentGame.addPlayer(newPlayer);

  return newPlayer;
};

export const setUpEvilPlayer = (user: ClientUser, gameID: string) => {
  games[gameID].users[user.userID].role = 'evil';
  games[gameID].users[user.userID].playerId = 'e1';

  const currentGame = games[gameID].game;
  const newPlayer = currentGame.enemies;
  newPlayer.username = user.username;
  currentGame.enemyJoined = true;

  return newPlayer;
};

export const closeGame = (gameID: string) => {
  games[gameID].status = 'closed';
};
