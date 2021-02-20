import * as serverStartModule from './serverStartModule';

import Game from './serverGame';
import Player from './serverPlayer';
import Enemy from './serverEnemy';

jest.mock('../controllers/sharedEmitFunctions', () => ({}));

describe('serverStartModule', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    Object.keys(serverStartModule.games).forEach(function (key) {
      delete serverStartModule.games[key];
    });
  });

  describe('getOpenGames', () => {
    it('should return open games', () => {
      const user = { username: 'username', role: '', playerID: '' };
      const startGame = {
        game: {} as Game,
        name: 'gameName',
        status: 'open',
        users: { user },
      };

      serverStartModule.games['gameID'] = startGame;

      const result = serverStartModule.getOpenGames();

      const expectedResult = [{ id: 'gameID', name: 'gameName', users: { user }, status: 'open' }];
      expect(result).toEqual(expectedResult);
    });

    it('should filter closed games', () => {
      const user = { username: 'username', role: '', playerID: '' };
      const startGame = {
        game: {} as Game,
        name: 'gameName',
        status: 'open',
        users: { user },
      };
      const closedGame = {
        game: {} as Game,
        name: 'gameName2',
        status: 'closed',
        users: { user },
      };

      serverStartModule.games['gameID'] = startGame;
      serverStartModule.games['gameID2'] = closedGame;

      const result = serverStartModule.getOpenGames();

      const expectedResult = [{ id: 'gameID', name: 'gameName', users: { user }, status: 'open' }];
      expect(result).toEqual(expectedResult);
    });

    it('should work when there is no games', () => {
      const result = serverStartModule.getOpenGames();

      expect(result).toEqual([]);
    });
  });

  describe('arePlayersReady', () => {
    beforeEach(() => {
      const startGame = {
        game: {} as Game,
        name: 'gameName',
        status: 'open',
        users: {},
      };

      serverStartModule.games['gameID'] = startGame;
    });

    it('should return true if all players are ready', () => {
      serverStartModule.games['gameID'].users = {
        user1: { username: 'user1', role: 'good', playerID: '1' },
        user3: { username: 'user2', role: 'evil', playerID: '2' },
      };
      const result = serverStartModule.arePlayersReady('gameID');

      expect(result).toBe(true);
    });

    it('should return false if no enemy has joined', () => {
      serverStartModule.games['gameID'].users = {
        user1: { username: 'user1', role: 'good', playerID: '1' },
        user2: { username: 'user2', role: 'good', playerID: '2' },
      };
      const result = serverStartModule.arePlayersReady('gameID');

      expect(result).toBe(false);
    });

    it('should return false if too few players has joined', () => {
      serverStartModule.games['gameID'].users = {
        user1: { username: 'user1', role: 'good', playerID: '1' },
      };
      const result = serverStartModule.arePlayersReady('gameID');

      expect(result).toBe(false);
    });

    it('should return false if a player has not choosen role', () => {
      serverStartModule.games['gameID'].users = {
        user1: { username: 'user1', role: 'good', playerID: '1' },
        user2: { username: 'user2', role: 'evil', playerID: '2' },
        user3: { username: 'user3', role: '', playerID: '3' },
      };
      const result = serverStartModule.arePlayersReady('gameID');

      expect(result).toBe(false);
    });
  });

  describe('initNewGame', () => {
    it('should return new game correctly', () => {
      const user = { username: 'username', userID: 'userID' };
      const result = serverStartModule.initNewGame(user);

      expect(result).toBeInstanceOf(Game);
    });

    it('should add new game to games correctly', () => {
      const user = { username: 'username', userID: 'userID' };

      const newGame = serverStartModule.initNewGame(user);
      const result = serverStartModule.games[newGame.id];

      expect(result.game).toBe(newGame);
      expect(result.status).toBe('open');
      expect(result.name).toBe("username's game");
      expect(result.users).toEqual({ userID: { username: 'username', role: '', playerID: '' } });
    });
  });

  describe('joinGame', () => {
    beforeEach(() => {
      const startGame = {
        game: {} as Game,
        name: 'gameName',
        status: 'open',
        users: {},
      };

      serverStartModule.games['gameID'] = startGame;
    });

    it('should add user to targeted game', () => {
      const user = { username: 'username', userID: 'userID' };

      serverStartModule.joinGame(user, 'gameID');
      const result = serverStartModule.games['gameID'];

      expect(result.users).toEqual({ userID: { username: 'username', role: '', playerID: '' } });
    });

    it('should change game status to full correctly', () => {
      for (let i = 0; i < 7; i++) {
        const user = { username: 'username', userID: `userID${i}` };
        serverStartModule.joinGame(user, 'gameID');
      }

      const result = serverStartModule.games['gameID'];

      expect(result.status).toEqual('full');
    });

    it('should return joined game correctly', () => {
      const user = { username: 'username', userID: 'userID' };

      const result = serverStartModule.joinGame(user, 'gameID');
      const joinedGame = serverStartModule.games['gameID'].game;

      expect(result).toBe(joinedGame);
    });
  });

  describe('setUpGoodPlayer', () => {
    const user = { username: 'username', userID: 'userID' };
    let gameID = '';

    beforeEach(() => {
      const newGame = serverStartModule.initNewGame(user);
      gameID = newGame.id;
    });

    it('should change user correctly', () => {
      const result = serverStartModule.setUpGoodPlayer(user, gameID);

      const userRole = serverStartModule.games[gameID].users['userID'].role;
      const userID = serverStartModule.games[gameID].users['userID'].playerID;

      expect(userRole).toBe('good');
      expect(userID).toBe(result.id);
    });

    it('should add new player to joined game', () => {
      const joinedGame = serverStartModule.games[gameID].game;
      const previousPlayersLength = joinedGame.players.length;

      serverStartModule.setUpGoodPlayer(user, gameID);

      const usernameExistsInPlayerList = Boolean(joinedGame.players.find((p) => p.username === 'username'));

      expect(usernameExistsInPlayerList).toBe(true);
      expect(joinedGame.players.length).toBe(previousPlayersLength + 1);
    });

    it('should return new player correctly', () => {
      const result = serverStartModule.setUpGoodPlayer(user, gameID);

      expect(result).toBeInstanceOf(Player);
    });
  });

  describe('setUpEvilPlayer', () => {
    const user = { username: 'username', userID: 'userID' };
    let gameID = '';

    beforeEach(() => {
      const newGame = serverStartModule.initNewGame(user);
      gameID = newGame.id;
    });

    it('should update user correctly', () => {
      serverStartModule.setUpEvilPlayer(user, gameID);

      const userRole = serverStartModule.games[gameID].users['userID'].role;
      const playerID = serverStartModule.games[gameID].users['userID'].playerID;

      expect(userRole).toBe('evil');
      expect(playerID).toBe('e1');
    });

    it('should update enemyJoined', () => {
      const game = serverStartModule.games[gameID].game;

      expect(game.enemyJoined).toBe(false);

      serverStartModule.setUpEvilPlayer(user, gameID);

      expect(game.enemyJoined).toBe(true);
    });

    it('should return new player correctly', () => {
      const result = serverStartModule.setUpEvilPlayer(user, gameID);

      expect(result).toBe(serverStartModule.games[gameID].game.enemies);
      expect(result.e1).toBeInstanceOf(Enemy);
      expect(result.e2).toBeInstanceOf(Enemy);
      expect(result.username).toBe('username');
    });
  });

  describe('closeGame', () => {
    it('changes game status correctly', () => {
      const user = { username: 'username', userID: 'userID' };
      const game = serverStartModule.initNewGame(user);
      const gameID = game.id;
      const previousGameStatus = serverStartModule.games[gameID].status;

      serverStartModule.closeGame(gameID);
      const updatedGameStatus = serverStartModule.games[gameID].status;

      expect(previousGameStatus).toBe('open');
      expect(updatedGameStatus).toBe('closed');
    });
  });
});
