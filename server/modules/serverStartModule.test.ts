import * as serverStartModule from './serverStartModule';

import Game from './serverGame';

jest.mock('../controllers/sharedFunctions', () => ({}));

describe('serverStartModule', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getOpenGames', () => {
    it('should work when there is no games', () => {
      const result = serverStartModule.getOpenGames();

      expect(result).toEqual([]);
    });

    it('should return open games', () => {
      const user = { username: 'username', role: '', playerId: '' };
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
      const user = { username: 'username', role: '', playerId: '' };
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
  });
});
