import Enemy from './serverEnemy';
import enemyPaths from './enemyPaths';
import positions from '../../src/shared/positions';
import Player from './serverPlayer';

describe('serverEnemy', () => {
  let enemy: Enemy;

  beforeEach(() => {
    enemy = new Enemy('e1');
  });

  describe('constructor', () => {
    it('sets up proper defaults', () => {
      expect(enemy.id).toEqual('e1');
      expect(enemy.position).toEqual(enemy.path[0]);
      expect(enemy.lastPosition).toEqual(enemy.path[0]);
      expect(enemy.isEvil).toEqual(true);
      expect(enemy.playersVisible).toEqual([]);

      expect(enemy.path).toEqual(enemyPaths.purpleA);
      expect(enemy.pathName).toEqual('purpleA');
    });
  });

  describe('move', () => {
    it('updates correctly when moving', () => {
      const currentPositionID = enemy.position.id;
      enemy.stepsLeft = 2;

      enemy.move(positions[1]);

      expect(enemy.stepsLeft).toEqual(1);
      expect(enemy.lastPosition.id).toEqual(currentPositionID);
      expect(enemy.position).toEqual(positions[1]);
    });
  });

  describe('checkTarget', () => {
    it('should return true correct', () => {
      const mockedPlayer = { position: positions[1], home: positions[2] } as Player;
      enemy.position = positions[1];

      expect(enemy.checkTarget(mockedPlayer)).toEqual(true);
    });

    it('should return false if not same position', () => {
      const mockedPlayer = { position: positions[1], home: positions[2] } as Player;
      enemy.position = positions[3];

      expect(enemy.checkTarget(mockedPlayer)).toEqual(false);
    });

    it("should return false if at player's home", () => {
      const mockedPlayer = { position: positions[1], home: positions[1] } as Player;
      enemy.position = positions[1];

      expect(enemy.checkTarget(mockedPlayer)).toEqual(false);
    });
  });

  describe('isOnPath', () => {
    it('should return true if on path', () => {
      expect(enemy.isOnPath()).toEqual(true);
    });

    it('should return false if not path', () => {
      enemy.position = positions[1];
      expect(enemy.isOnPath()).toEqual(false);
    });
  });

  describe('endOfPath', () => {
    it('returns true if on end of path', () => {
      enemy.path = [positions[1], positions[2], positions[3]];
      enemy.position = positions[3];

      expect(enemy.endOfPath()).toEqual(true);
    });

    it('returns false if not end of path', () => {
      enemy.path = [positions[1], positions[2], positions[3]];
      enemy.position = positions[2];

      expect(enemy.endOfPath()).toEqual(false);

      enemy.position = positions[22];

      expect(enemy.endOfPath()).toEqual(false);
    });
  });

  describe('getNewPossiblePaths', () => {
    it('returns available paths correctly', () => {
      enemy.path = enemyPaths.purpleA;
      const expectedOutput = ['pinkB', 'purpleA', 'babyBlueA', 'peaA', 'darkGreenA'];
      expect(enemy.getNewPossiblePaths()).toEqual(expectedOutput);
    });
  });

  describe('setNewPath', () => {
    it('updates values correctly', () => {
      enemy.setNewPath('pinkA');

      expect(enemy.pathName).toEqual('pinkA');
      expect(enemy.path).toEqual(enemyPaths.pinkA);
    });
  });
});
