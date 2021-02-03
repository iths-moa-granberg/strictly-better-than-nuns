import { formatProgressLogObjects } from './chatModule';
import Player from './serverPlayer';

import { Position } from '../../src/shared/sharedTypes';

jest.mock('../controllers/sharedFunctions', () => ({
  logProgress: jest.fn(),
}));

describe('chatModule', () => {
  describe('formatProgressLogObject', () => {
    let players: Player[];

    beforeEach(() => {
      jest.resetAllMocks();

      players = [
        new Player({
          id: '1',
          home: {} as Position,
          key: {} as Position,
          goal: {} as Position,
          username: 'playerUsername',
        }),
      ];
    });

    it('returns message in correct format for good players', () => {
      const enemyUsername = 'enemy';
      const msg = {
        text: 'This is the message',
        id: '1',
      };

      const progressLogObject = formatProgressLogObjects(enemyUsername, players, msg);

      const expectedResult = [{ text: 'playerUsername: ', id: '1' }, { text: 'This is the message' }];
      expect(progressLogObject).toEqual(expectedResult);
    });

    it('returns message in correct format for enemy player', () => {
      const enemyUsername = 'enemy';
      const msg = {
        text: 'This is the message',
        id: 'e1',
      };

      const progressLogObject = formatProgressLogObjects(enemyUsername, players, msg);

      const expectedResult = [{ text: 'enemy: ', id: 'e1' }, { text: 'This is the message' }];
      expect(progressLogObject).toEqual(expectedResult);
    });

    it('sets no username if no user is found', () => {
      const enemyUsername = 'enemy';
      const msg = {
        text: 'This is the message',
        id: '123',
      };

      const progressLogObject = formatProgressLogObjects(enemyUsername, players, msg);

      const expectedResult = [{ text: ': ', id: '123' }, { text: 'This is the message' }];
      expect(progressLogObject).toEqual(expectedResult);
    });
  });
});
