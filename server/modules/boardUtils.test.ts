import * as boardUtils from './boardUtils';
import positions from '../../src/shared/positions';
import enemyPaths from './enemyPaths';

import { Position } from '../../src/shared/sharedTypes';
import Enemy from './serverEnemy';

describe('board-utils', () => {
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

  describe('isSeen', () => {
    it('is invisible behinds wall', () => {
      const hiddenPosition = { x: 3, y: 2, id: 2 } as Position;
      const enemyPos = { x: 2, y: 2, inSight: [1] } as Position;
      const enemyLastPos = { x: 1, y: 2 } as Position;

      expect(boardUtils.isSeen(hiddenPosition, enemyPos, enemyLastPos)).toEqual(false);
    });

    describe('should work when walking straight', () => {
      const enemyPos = { x: 2, y: 2, inSight: [1] } as Position;
      const enemyLastPos = { x: 1, y: 2 } as Position;

      const positions = [
        { direction: 'same position', pos: { x: 2, y: 2, id: 1 } },
        { direction: 'straight', pos: { x: 3, y: 2, id: 1 } },
        { direction: 'right', pos: { x: 2, y: 3, id: 1 } },
        { direction: 'left', pos: { x: 2, y: 1, id: 1 } },
        { direction: 'diagonally right', pos: { x: 3, y: 3, id: 1 } },
        { direction: 'diagonally left', pos: { x: 3, y: 1, id: 1 } },
      ] as { direction: string; pos: Position }[];

      const hiddenPositions = [
        { direction: 'right behind', pos: { x: 1, y: 2, id: 1 } },
        { direction: 'behind diagonally right', pos: { x: 1, y: 3, id: 1 } },
        { direction: 'behind diagonally left', pos: { x: 1, y: 1, id: 1 } },
      ] as { direction: string; pos: Position }[];

      positions.forEach(({ direction, pos }) => {
        it(`is seen ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPos)).toEqual(true);
        });
      });

      hiddenPositions.forEach(({ direction, pos }) => {
        it(`is not seen when ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPos)).toEqual(false);
        });
      });
    });

    const enemyPos = { x: 3, y: 3, inSight: [1] } as Position;

    describe('should work when walking diagonally up', () => {
      const enemyLastPosUp = { x: 2, y: 5 } as Position;

      const positionsUp = [
        { direction: 'up', pos: { x: 3, y: 2, id: 1 } },
        { direction: 'right', pos: { x: 4, y: 3, id: 1 } },
        { direction: 'left', pos: { x: 2, y: 1, id: 1 } },
      ] as { direction: string; pos: Position }[];

      const hiddenPositionsUp = [
        { direction: 'down', pos: { x: 3, y: 4, id: 1 } },
        { direction: 'behind right', pos: { x: 4, y: 4, id: 1 } },
        { direction: 'behind left', pos: { x: 2, y: 4, id: 1 } },
      ] as { direction: string; pos: Position }[];

      positionsUp.forEach(({ direction, pos }) => {
        it(`when walkin up, is seen ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosUp)).toEqual(true);
        });
      });

      hiddenPositionsUp.forEach(({ direction, pos }) => {
        it(`when walking up, is not seen when ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosUp)).toEqual(false);
        });
      });
    });

    describe('should work when walking diagonally down', () => {
      const enemyLastPosDown = { x: 2, y: 1 } as Position;

      const positionsDown = [
        { direction: 'down', pos: { x: 3, y: 4, id: 1 } },
        { direction: 'right', pos: { x: 4, y: 3, id: 1 } },
        { direction: 'left', pos: { x: 2, y: 3, id: 1 } },
      ] as { direction: string; pos: Position }[];

      const hiddenPositionsDown = [
        { direction: 'up', pos: { x: 3, y: 2, id: 1 } },
        { direction: 'behind right', pos: { x: 4, y: 2, id: 1 } },
        { direction: 'behind left', pos: { x: 2, y: 2, id: 1 } },
      ] as { direction: string; pos: Position }[];

      positionsDown.forEach(({ direction, pos }) => {
        it(`when walkin Down, is seen ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosDown)).toEqual(true);
        });
      });

      hiddenPositionsDown.forEach(({ direction, pos }) => {
        it(`when walking Down, is not seen when ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosDown)).toEqual(false);
        });
      });
    });

    describe('should work when walking diagonally left', () => {
      const enemyLastPosLeft = { x: 6, y: 2 } as Position;

      const positionsLeft = [
        { direction: 'up', pos: { x: 3, y: 2, id: 1 } },
        { direction: 'down', pos: { x: 3, y: 4, id: 1 } },
        { direction: 'left', pos: { x: 2, y: 3, id: 1 } },
      ] as { direction: string; pos: Position }[];

      const hiddenPositionsLeft = [
        { direction: 'right', pos: { x: 4, y: 3, id: 1 } },
        { direction: 'behind up', pos: { x: 4, y: 2, id: 1 } },
        { direction: 'behind down', pos: { x: 4, y: 4, id: 1 } },
      ] as { direction: string; pos: Position }[];

      positionsLeft.forEach(({ direction, pos }) => {
        it(`when walkin Left, is seen ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosLeft)).toEqual(true);
        });
      });

      hiddenPositionsLeft.forEach(({ direction, pos }) => {
        it(`when walking Left, is not seen when ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosLeft)).toEqual(false);
        });
      });
    });

    describe('should work when walking diagonally right', () => {
      const enemyLastPosRight = { x: 1, y: 2 } as Position;

      const positionsRight = [
        { direction: 'down', pos: { x: 3, y: 4, id: 1 } },
        { direction: 'up', pos: { x: 3, y: 2, id: 1 } },
        { direction: 'right', pos: { x: 5, y: 3, id: 1 } },
      ] as { direction: string; pos: Position }[];

      const hiddenPositionsRight = [
        { direction: 'left', pos: { x: 2, y: 3, id: 1 } },
        { direction: 'behind up', pos: { x: 2, y: 1, id: 1 } },
        { direction: 'behind down', pos: { x: 2, y: 5, id: 1 } },
      ] as { direction: string; pos: Position }[];

      positionsRight.forEach(({ direction, pos }) => {
        it(`when walkin Right, is seen ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosRight)).toEqual(true);
        });
      });

      hiddenPositionsRight.forEach(({ direction, pos }) => {
        it(`when walking Right, is not seen when ${direction}`, () => {
          expect(boardUtils.isSeen(pos, enemyPos, enemyLastPosRight)).toEqual(false);
        });
      });
    });
  });
});
