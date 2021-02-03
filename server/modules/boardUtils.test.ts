import * as boardUtils from './boardUtils';
import positions from '../../src/shared/positions';

import { Position } from '../../src/shared/sharedTypes';

describe('server-board', () => {
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
