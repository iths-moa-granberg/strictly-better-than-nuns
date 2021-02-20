import * as serverPlayerActionsUtils from './serverPlayerActionsUtils';

import Game from './serverGame';
import Player from './serverPlayer';
import positions from '../../src/shared/positions';

jest.mock('../controllers/sharedEmitFunctions', () => {});

describe('serverPlayerActionsUtils', () => {
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

  describe('playerStepOptions', () => {
    it('should return possibleSteps for free player correctly', () => {
      player.stepsLeft = 3;

      const result = serverPlayerActionsUtils.playerStepOptions(player, game);

      const expectedResult = [positions[21], positions[20], positions[22], positions[19], positions[2], positions[23]];

      expect(result).toEqual(expectedResult);
    });

    it('should return possibleSteps for caught player correctly', () => {
      player.stepsLeft = 3;
      player.position = positions[40];
      game.caughtPlayers = ['1'];

      const result = serverPlayerActionsUtils.playerStepOptions(player, game);

      const expectedResult = [positions[18], positions[27], positions[39]];

      expect(result).toEqual(expectedResult);
    });
  });

  describe('updatePlayerOnStep', () => {
    it('should call correct functions (spies)', () => {
      const takeStepSpy = jest.spyOn(player, 'takeStep').mockImplementation();
      const addToPathSpy = jest.spyOn(player, 'addToPath').mockImplementation();

      serverPlayerActionsUtils.updatePlayerOnStep(player, 2, game.enemies);

      expect(takeStepSpy).toHaveBeenCalledWith(2);
      expect(addToPathSpy).toHaveBeenCalledWith([]);
    });

    it('should set visible correctly', () => {
      player.position = positions[19];
      game.enemies.e1.position = positions[18];
      game.enemies.e1.lastPosition = positions[17];

      serverPlayerActionsUtils.updatePlayerOnStep(player, 20, game.enemies);

      expect(player.visible).toBe(true);
    });
  });

  describe('getPlayerStatus', () => {
    it('should return seen & free correctly', () => {
      player.position = positions[18];
      game.enemies.e1.position = positions[19];

      const result = serverPlayerActionsUtils.getPlayerStatus(player, game);

      const expectedResult = { seen: true, setFree: false };

      expect(result).toEqual(expectedResult);
    });

    it('should return setFree & invisible correctly and with correct sideeffects', () => {
      const spy = jest.spyOn(game, 'removeCaughtPlayer').mockImplementation();

      game.caughtPlayers = ['1'];

      const result = serverPlayerActionsUtils.getPlayerStatus(player, game);

      const expectedResult = { seen: false, setFree: true };

      expect(result).toEqual(expectedResult);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return invisible & free correctly', () => {
      const result = serverPlayerActionsUtils.getPlayerStatus(player, game);

      const expectedResult = { seen: false, setFree: false };

      expect(result).toEqual(expectedResult);
    });

    it('should return visible & caught correctly', () => {
      player.visible = true;
      game.caughtPlayers = ['1'];

      const result = serverPlayerActionsUtils.getPlayerStatus(player, game);

      const expectedResult = { seen: false, setFree: false };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('actOnPlayerResetMove', () => {
    let resetMoveSpy: jest.SpyInstance;
    let filterPlayersVisibleSpy: jest.SpyInstance;
    let addCaughtPlayerSpy: jest.SpyInstance;

    beforeEach(() => {
      resetMoveSpy = jest.spyOn(player, 'resetMove').mockImplementation();
      filterPlayersVisibleSpy = jest.spyOn(game, 'filterPlayersVisible').mockImplementation();
      addCaughtPlayerSpy = jest.spyOn(game, 'addCaughtPlayer').mockImplementation();
    });

    it('should call correct functions when player is caught', () => {
      player.caught = true;

      serverPlayerActionsUtils.actOnPlayerResetMove(player, game);

      expect(resetMoveSpy).toHaveBeenCalledTimes(1);
      expect(filterPlayersVisibleSpy).toHaveBeenCalledTimes(1);
      expect(filterPlayersVisibleSpy).toHaveBeenCalledWith('1');
      expect(addCaughtPlayerSpy).toHaveBeenCalledTimes(1);
      expect(addCaughtPlayerSpy).toHaveBeenCalledWith(player);
    });

    it('should call correct functions when player is free', () => {
      serverPlayerActionsUtils.actOnPlayerResetMove(player, game);

      expect(resetMoveSpy).toHaveBeenCalledTimes(1);
      expect(filterPlayersVisibleSpy).toHaveBeenCalledTimes(1);
      expect(filterPlayersVisibleSpy).toHaveBeenCalledWith('1');
      expect(addCaughtPlayerSpy).toHaveBeenCalledTimes(0);
    });
  });
});
