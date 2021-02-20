import * as serverEnemyActionsUtils from './serverEnemyActionsUtils';

import Player from './serverPlayer';

import positions from '../../src/shared/positions';
import Game from './serverGame';
import enemyPaths from './enemyPaths';

jest.mock('../controllers/sharedEmitFunctions', () => {});

describe('serverEnemyActionsUtils', () => {
  let game: Game;
  let player: Player;

  beforeEach(() => {
    jest.resetAllMocks();

    game = new Game();

    player = new Player({
      id: '1',
      home: positions[1],
      key: positions[2],
      goal: positions[3],
      username: 'username',
    });
  });

  describe('getEnemyPossibleSteps', () => {
    describe('should work when the enemy has seen, heard or are seeing a player', () => {
      const expectedResult = [
        positions[40],
        positions[25],
        positions[19],
        positions[39],
        positions[41],
        positions[24],
        positions[18],
        positions[20],
        positions[3],
      ];

      it('should work when the enemy has seen someone', () => {
        game.sightTokens = [{ id: 1, enemyID: ['e1'] }];
        game.enemies.e1.stepsLeft = 2;

        const result = serverEnemyActionsUtils.getEnemyPossibleSteps(game, game.enemies.e1);

        expect(result).toEqual(expectedResult);
      });

      it('should work when the enemy has heard someone', () => {
        game.soundTokens = [{ id: 1, enemyID: 'e1' }];
        game.enemies.e1.stepsLeft = 2;

        const result = serverEnemyActionsUtils.getEnemyPossibleSteps(game, game.enemies.e1);

        expect(result).toEqual(expectedResult);
      });

      it('should work when the enemy are seeing someone', () => {
        game.enemies.e1.playersVisible = ['1'];
        game.enemies.e1.stepsLeft = 2;

        const result = serverEnemyActionsUtils.getEnemyPossibleSteps(game, game.enemies.e1);

        expect(result).toEqual(expectedResult);
      });
    });

    it('should work when the enemy is on their path', () => {
      game.enemies.e1.path = enemyPaths.pinkA;
      game.enemies.e1.stepsLeft = 3;

      const result = serverEnemyActionsUtils.getEnemyPossibleSteps(game, game.enemies.e1);

      const expectedResult = [positions[40], positions[39], positions[38]];

      expect(result).toEqual(expectedResult);
    });

    it('should work when the enemy is going back to their path', () => {
      game.enemies.e1.path = enemyPaths.pinkA;
      game.enemies.e1.stepsLeft = 3;
      game.enemies.e1.position = positions[55];

      const result = serverEnemyActionsUtils.getEnemyPossibleSteps(game, game.enemies.e1);

      const expectedResult = [positions[52], positions[53], positions[54]];

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getEnemySeenMessages', () => {
    let player2: Player;

    beforeEach(() => {
      player2 = new Player({
        id: '2',
        home: positions[1],
        key: positions[2],
        goal: positions[3],
        username: 'username2',
      });
    });

    it.each`
      activeEnemyID
      ${'e1'}
      ${'e2'}
    `(
      'should return messages for player seen by $activeEnemyID correctly',
      ({ activeEnemyID }: { activeEnemyID: 'e1' | 'e2' }) => {
        game.players = [player, player2];
        player.position = positions[20];
        player2.position = positions[21];
        game.enemies[activeEnemyID].position = positions[19];

        const result = serverEnemyActionsUtils.getEnemySeenMessages(game.players, game.enemies, activeEnemyID);

        const expectedResult = [
          [
            {
              text: 'username',
              id: '1',
            },
            { text: ' is seen by' },
            {
              text: ` Enemy ${activeEnemyID.split('')[1]}`,
              id: activeEnemyID,
            },
          ],
          [
            {
              text: 'username2',
              id: '2',
            },
            { text: ' is seen by' },
            {
              text: ` Enemy ${activeEnemyID.split('')[1]}`,
              id: activeEnemyID,
            },
          ],
        ];

        expect(result).toEqual(expectedResult);
      }
    );

    it('should return messages for a player seen by both enemy correctly', () => {
      game.players = [player, player2];
      player.position = positions[20];
      game.enemies.e1.position = positions[19];
      game.enemies.e2.position = positions[19];

      const result = serverEnemyActionsUtils.getEnemySeenMessages(game.players, game.enemies, 'e1');

      const expectedResult = [
        [
          {
            text: 'username',
            id: '1',
          },
          {
            text: ' is seen by both enemies',
          },
        ],
      ];

      expect(result).toEqual(expectedResult);
    });

    it('should not return messages for invisible player', () => {
      game.players = [player, player2];
      player.position = positions[20];

      const result = serverEnemyActionsUtils.getEnemySeenMessages(game.players, game.enemies, 'e1');

      expect(result).toEqual([]);
    });

    it('should not return messages for player visible only by inactive enemy', () => {
      game.players = [player, player2];
      player.position = positions[20];
      game.enemies.e1.position = positions[19];

      const result = serverEnemyActionsUtils.getEnemySeenMessages(game.players, game.enemies, 'e2');

      expect(result).toEqual([]);
    });
  });
});
