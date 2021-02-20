import * as boardUtils from './boardUtils';
import positions from '../../src/shared/positions';
import enemyPaths from './enemyPaths';
import Enemy from './serverEnemy';
import Player from './serverPlayer';

import { Position } from '../../src/shared/sharedTypes';
import { Enemies } from '../serverTypes';

jest.mock('../controllers/sharedEmitFunctions', () => ({}));

describe('board-utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const filterDuplicates = (arr: Position[]) => {
    return arr.filter((position: Position, index: number) => arr.indexOf(position) === index);
  };

  describe('getReachable', () => {
    const start = positions[1];

    it('should return reachable positions', () => {
      const totalSteps = 3;
      const hasKey = true;
      const isEvil = true;
      const enemiesPositionsIDn = [10, 11];

      const result = boardUtils.getReachable(start, totalSteps, hasKey, isEvil, enemiesPositionsIDn);

      const expectedResult = [positions[21], positions[20], positions[22], positions[19], positions[2], positions[23]];
      expect(result).toEqual(expectedResult);
    });

    it('should remove enemy positions for good players', () => {
      const totalSteps = 3;
      const hasKey = true;
      const isEvil = false;
      const enemiesPositionsIDn = [20, 11];

      const result = boardUtils.getReachable(start, totalSteps, hasKey, isEvil, enemiesPositionsIDn);

      const expectedResult = [positions[21], positions[22], positions[23]];
      expect(result).toEqual(expectedResult);
    });

    it('should require keys for locked doors', () => {
      const totalSteps = 4;
      const hasKey = false;
      const isEvil = false;
      const enemiesPositionsIDn = [10, 11];

      const result = boardUtils.getReachable(start, totalSteps, hasKey, isEvil, enemiesPositionsIDn);

      const expectedResult = [
        positions[21],
        positions[20],
        positions[22],
        positions[19],
        positions[2],
        positions[23],
        positions[18],
        positions[3],
        positions[43],
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getEnemyStandardReachable', () => {
    it('should return positions enemy can reach along their path', () => {
      const path = enemyPaths.lightPurpleA;
      const result = boardUtils.getEnemyStandardReachable(positions[101], path, 3);

      expect(result).toEqual([positions[100], positions[93], positions[94]]);
    });
  });

  describe('getClosestWayHome', () => {
    it('should return postions leading the closest way home', () => {
      const result = boardUtils.getClosestWayHome(positions[17], positions[1], true, 5);

      const expectedResult = [positions[1], positions[21], positions[20], positions[19], positions[18]];

      expect(result).toEqual(expectedResult);
    });

    it('should return positions correctly with multiple possible paths', () => {
      const result = boardUtils.getClosestWayHome(positions[44], positions[24], true, 5);

      const filteredResult = filterDuplicates(result);
      const expectedResult = [positions[24], positions[42], positions[43], positions[45]];

      expect(filteredResult).toEqual(expectedResult);
    });
  });

  describe('getClosestPaths', () => {
    it('should return closest paths with one path', () => {
      const result = boardUtils.getClosestPaths(positions[1], positions[19], true);

      const filteredResult = result.map((path) => filterDuplicates(path));
      const expectedResult = [[positions[19], positions[20], positions[21], positions[1]]];

      expect(filteredResult).toEqual(expectedResult);
    });

    it('should return closest paths with multiple paths', () => {
      const result = boardUtils.getClosestPaths(positions[105], positions[79], true);

      const filteredResult = result.map((path) => filterDuplicates(path));
      const expectedResult = [
        [positions[79], positions[78], positions[88], positions[105]],
        [positions[79], positions[87], positions[88], positions[105]],
        [positions[79], positions[87], positions[106], positions[105]],
      ];

      expect(filteredResult).toEqual(expectedResult);
    });

    it('should filter positions behind locked doors if player has no key', () => {
      const result = boardUtils.getClosestPaths(positions[19], positions[40], false);

      const filteredResult = result.map((path) => filterDuplicates(path));
      const expectedResult = [[positions[40], positions[39], positions[27], positions[18], positions[19]]];

      expect(filteredResult).toEqual(expectedResult);
    });
  });

  describe('getClosestWayToPath', () => {
    it('should get closest way to enemy path', () => {
      const result = boardUtils.getClosestWayToPath(positions[20], enemyPaths.lightPurpleA, 4);

      const filteredResult = filterDuplicates(result);
      const expectedResult = [positions[26], positions[19]];

      expect(filteredResult).toEqual(expectedResult);
    });

    it('should limit path-lengths based on steps left', () => {
      const result = boardUtils.getClosestWayToPath(positions[16], enemyPaths.lightPurpleA, 2);

      const filteredResult = filterDuplicates(result);
      const expectedResult = [positions[18], positions[17]];

      expect(filteredResult).toEqual(expectedResult);
    });
  });

  describe('isHeard', () => {
    it('should return heard player from one direction correctly', () => {
      const playerPosition = positions[3];
      const enemies = {
        e1: new Enemy('e1'),
        e2: new Enemy('e2'),
        username: 'username',
      };
      const sound = 3;
      const enemyID = 'e1';

      const result = boardUtils.isHeard(playerPosition, enemies, sound, enemyID);

      const expectedResult = [{ id: 19, enemyID: 'e1' }];
      expect(result).toEqual(expectedResult);
    });

    it('should return heard player from multiple directions correctly', () => {
      const playerPosition = positions[27];
      const enemies = {
        e1: new Enemy('e1'),
        e2: new Enemy('e2'),
        username: 'username',
      };
      const sound = 4;
      const enemyID = 'e1';

      const result = boardUtils.isHeard(playerPosition, enemies, sound, enemyID);

      const expectedResult = [
        { id: 19, enemyID: 'e1' },
        { id: 40, enemyID: 'e1' },
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return silent player correctly', () => {
      const playerPosition = positions[3];
      const enemies = {
        e1: new Enemy('e1'),
        e2: new Enemy('e2'),
        username: 'username',
      };
      const sound = 1;
      const enemyID = 'e1';

      const result = boardUtils.isHeard(playerPosition, enemies, sound, enemyID);

      expect(result).toBe(undefined);
    });
  });

  describe('getRandomSound', () => {
    it('stays between limit of 1 to 6', () => {
      for (let i = 0; i < 1000; i++) {
        const sound = boardUtils.getRandomSound();
        expect(sound).toBeLessThan(7);
        expect(sound).toBeGreaterThan(0);
      }
    });
  });

  describe('getSoundReach', () => {
    [1, 2, 3, 4, 5, 6].forEach((num) => {
      it(`w/ sound ${num}`, () => {
        expect(boardUtils.getSoundReach('stand', num)).toEqual(num - 3);
        expect(boardUtils.getSoundReach('sneak', num)).toEqual(num - 2);
        expect(boardUtils.getSoundReach('walk', num)).toEqual(num - 1);
        expect(boardUtils.getSoundReach('run', num)).toEqual(num);
      });
    });
  });

  describe('getSeenBy', () => {
    let player: Player;
    let enemies: Enemies;

    beforeEach(() => {
      player = new Player({
        id: '1',
        home: positions[1],
        key: positions[2],
        goal: positions[3],
        username: 'username',
      });

      enemies = {
        e1: new Enemy('e1'),
        e2: new Enemy('e2'),
        username: 'enemyUsername',
      };
    });

    it('should return player visible by both enemies correctly', () => {
      player.position = positions[21];

      enemies.e1.lastPosition = positions[4];
      enemies.e1.position = positions[18];
      enemies.e2.lastPosition = positions[27];
      enemies.e2.position = positions[18];

      const result = boardUtils.getSeenBy(player, enemies);

      expect(result).toEqual(['e1', 'e2']);
    });

    it('should return player visible by one enemy correctly', () => {
      player.position = positions[21];
      enemies.e1.lastPosition = positions[17];
      enemies.e1.position = positions[18];

      const result = boardUtils.getSeenBy(player, enemies);

      expect(result).toEqual(['e1']);
    });

    it('should return invisible player correctly', () => {
      const result = boardUtils.getSeenBy(player, enemies);

      expect(result).toEqual([]);
    });

    it('should return already visible player correctly', () => {
      player.position = positions[21];

      enemies.e1.lastPosition = positions[4];
      enemies.e1.position = positions[18];
      enemies.e1.playersVisible = [player.id];
      enemies.e2.lastPosition = positions[27];
      enemies.e2.position = positions[18];
      enemies.e2.playersVisible = [player.id];

      const result = boardUtils.getSeenBy(player, enemies);

      expect(result).toEqual(['e1', 'e2']);
    });

    it('should return player visible diagonally up/down correctly', () => {
      player.position = positions[64];

      enemies.e1.lastPosition = positions[91];
      enemies.e1.position = positions[75];
      enemies.e2.lastPosition = positions[48];
      enemies.e2.position = positions[63];

      const result = boardUtils.getSeenBy(player, enemies);

      expect(result).toEqual(['e1', 'e2']);
    });

    it('should return player visible diagonally right/left correctly', () => {
      player.position = positions[63];

      enemies.e1.lastPosition = positions[46];
      enemies.e1.position = positions[47];
      enemies.e2.lastPosition = positions[75];
      enemies.e2.position = positions[64];

      const result = boardUtils.getSeenBy(player, enemies);

      expect(result).toEqual(['e1', 'e2']);
    });
  });
});
