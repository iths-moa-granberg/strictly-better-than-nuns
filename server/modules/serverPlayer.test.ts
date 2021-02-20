import { emitLogProgress } from '../controllers/sharedEmitFunctions';
import Player from './serverPlayer';
import positions from '../../src/shared/positions';

jest.mock('../controllers/sharedEmitFunctions', () => ({
  emitLogProgress: jest.fn(),
}));

describe('serverPlayer', () => {
  let player: Player;

  beforeEach(() => {
    jest.resetAllMocks();

    player = new Player({
      id: '1',
      home: positions[1],
      key: positions[2],
      goal: positions[3],
      username: 'test',
    });
  });

  describe('constructor', () => {
    it('sets up proper defaults', () => {
      expect(player.id).toEqual('1');
      expect(player.home).toEqual(positions[1]);
      expect(player.key).toEqual(positions[2]);
      expect(player.goal).toEqual(positions[3]);
      expect(player.position).toEqual(player.home);
      expect(player.isEvil).toEqual(false);
      expect(player.visible).toEqual(false);
      expect(player.pace).toEqual('');
      expect(player.stepsLeft).toEqual(0);
      expect(player.path).toEqual([{ position: player.home, visible: false, enemyID: [] }]);
      expect(player.hasKey).toEqual(false);
      expect(player.hasGoal).toEqual(false);
      expect(player.caught).toEqual(false);
      expect(player.username).toEqual('test');
    });
  });

  describe('isCaught', () => {
    it('updates player correctly', () => {
      player.isCaught();

      expect(player.caught).toEqual(true);
      expect(player.hasGoal).toEqual(false);
    });
  });

  describe('checkTarget', () => {
    let socket: any;

    beforeEach(() => {
      socket = { game: { winners: [] } };
      player = new Player({
        id: '1',
        home: positions[1],
        key: positions[2],
        goal: positions[3],
        username: 'test',
      });
    });

    it('receives key correctly', () => {
      player.position = positions[2];
      player.checkTarget(socket);

      expect(player.hasKey).toEqual(true);
      expect(player.hasGoal).toEqual(false);
      expect(emitLogProgress).toHaveBeenCalledWith([{ text: `You have reached your key!` }], { socket });
    });

    it('receives goal correctly', () => {
      player.hasKey = true;
      player.position = positions[3];

      player.checkTarget(socket);

      expect(player.hasKey).toEqual(true);
      expect(player.hasGoal).toEqual(true);
      expect(emitLogProgress).toHaveBeenCalledWith([{ text: `You have reached your goal!` }], { socket });
    });

    it('is added to winners correctly', () => {
      player.hasKey = true;
      player.hasGoal = true;
      player.checkTarget(socket);

      const expectedOutput = [{ username: 'test', userID: '1' }];
      expect(socket.game.winners).toEqual(expectedOutput);
    });

    it('does nothing if not meeting conditions', () => {
      player.checkTarget(socket);

      expect(player.hasKey).toEqual(false);

      player.hasKey = true;
      player.checkTarget(socket);

      expect(player.hasGoal).toEqual(false);

      player.hasGoal = true;
      player.position = positions[5];
      player.checkTarget(socket);

      expect(socket.game.winners).toEqual([]);
      expect(emitLogProgress).not.toHaveBeenCalled();
    });
  });

  describe('resetPath', () => {
    it('resets path correctly with input', () => {
      player.path.push({ position: positions[2], visible: false, enemyID: [] });
      player.resetPath(['e1']);

      expect(player.path.length).toEqual(1);
      expect(player.path[0].position).toEqual(player.position);
      expect(player.path[0].visible).toEqual(player.visible);
      expect(player.path[0].enemyID).toEqual(['e1']);
    });

    it('resets path correctly with empty input', () => {
      player.path.push({ position: positions[2], visible: false, enemyID: [] });
      player.resetPath([]);

      expect(player.path.length).toEqual(1);
      expect(player.path[0].position).toEqual(player.position);
      expect(player.path[0].visible).toEqual(player.visible);
      expect(player.path[0].enemyID).toEqual([]);
    });
  });

  describe('resetMove', () => {
    it('should update correctly', () => {
      player.path = [
        { position: positions[10], visible: true, enemyID: ['e1'] },
        { position: positions[11], visible: false, enemyID: [] },
        { position: positions[12], visible: false, enemyID: [] },
      ];

      player.resetMove();

      const expectedPath = [{ position: positions[10], visible: true, enemyID: ['e1'] }];

      expect(player.position).toBe(positions[10]);
      expect(player.visible).toBe(true);
      expect(player.path).toEqual(expectedPath);
    });
  });

  describe('updatePathVisibility', () => {
    beforeEach(() => {
      player.path.push({ position: positions[2], visible: false, enemyID: [] });
    });

    it('updates targeted position properly', () => {
      const expectedOutput = [{ ...player.path[0] }, { position: positions[2], visible: true, enemyID: ['e1'] }];

      player.updatePathVisibility(positions[2], ['e1']);

      expect(player.path).toEqual(expectedOutput);
    });

    it('does not update path if called improperly', () => {
      const expectedOutput = [{ ...player.path[0] }, { position: positions[2], visible: false, enemyID: [] }];

      player.updatePathVisibility(positions[2], []);

      expect(player.path).toEqual(expectedOutput);
    });
  });

  describe('selectPace', () => {
    describe('sets pace correctly', () => {
      it.each`
        pace       | expectedStepsLeft
        ${'stand'} | ${0}
        ${'sneak'} | ${2}
        ${'walk'}  | ${3}
        ${'run'}   | ${5}
      `('pace $pace sets steps left to $expectedStepsLeft', ({ pace, expectedStepsLeft }) => {
        player.selectPace(pace);

        expect(player.pace).toEqual(pace);
        expect(player.stepsLeft).toEqual(expectedStepsLeft);
      });
    });

    describe('handles first turn correctly', () => {
      it.each`
        pace       | expectedStepsLeft
        ${'stand'} | ${0}
        ${'sneak'} | ${4}
        ${'walk'}  | ${6}
        ${'run'}   | ${8}
      `('pace $pace sets steps left to $expectedStepsLeft', ({ pace, expectedStepsLeft }) => {
        player.selectPace(pace, true);

        expect(player.pace).toEqual(pace);
        expect(player.stepsLeft).toEqual(expectedStepsLeft);
      });
    });
  });

  describe('takeStep', () => {
    it('should update correctly', () => {
      player.stepsLeft = 1;

      player.takeStep(2);

      expect(player.position).toEqual(positions[2]);
      expect(player.stepsLeft).toEqual(0);
    });
  });

  describe('addToPath', () => {
    it('should update correctly', () => {
      player.position = positions[2];
      player.visible = true;

      player.addToPath(['e1']);

      const expectedResult = [
        {
          position: positions[1],
          visible: false,
          enemyID: [],
        },
        {
          position: positions[2],
          visible: true,
          enemyID: ['e1'],
        },
      ];

      expect(player.path).toEqual(expectedResult);
    });
  });
});
