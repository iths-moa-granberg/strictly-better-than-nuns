import Game from './serverGame';
import { gameOver, logProgress, updateEnemyWinCounterClient, updatePlayer } from '../controllers/sharedFunctions';
import Enemy from './serverEnemy';
import Player from './serverPlayer';
import positions from '../../src/shared/positions';
import keys from '../../src/shared/keys';

jest.mock('../controllers/sharedFunctions', () => ({
  logProgress: jest.fn(),
  gameOver: jest.fn(),
  updatePlayer: jest.fn(),
  updateEnemyWinCounterClient: jest.fn(),
}));

describe('serverGame', () => {
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

  describe('constructor', () => {
    it('should have correct props', () => {
      expect(game.id.length).toBe(10);
      expect(game.roundCounter).toBe(0);
      expect(game.players).toEqual([]);
      expect(game.caughtPlayers).toEqual([]);
      expect(game.winners).toEqual([]);
      expect(game.enemyWinCounter).toBe(0);
      expect(game.playerTurnCompleted).toBe(0);
      expect(game.placedSoundCounter).toBe(0);
      expect(game.soundTokens).toEqual([]);
      expect(game.sightTokens).toEqual([]);
      expect(game.newSoundLog).toEqual([]);
      expect(game.enemyJoined).toBe(false);
      expect(game.enemyMovesCompleted).toBe(0);
      expect(game.enemyListened).toBe(0);

      expect(game.enemies.e1).toBeInstanceOf(Enemy);
      expect(game.enemies.e2).toBeInstanceOf(Enemy);

      expect(game.claimedKeys).toEqual([]);
    });
  });

  describe('generateGameID', () => {
    it('should return id correctly', () => {
      const result = game.generateGameID();

      expect(result.length).toBe(10);
    });
  });

  describe('addPlayer', () => {
    it('should add player to players', () => {
      const previousLength = game.players.length;

      game.addPlayer(player);

      expect(game.players).toContain(player);
      expect(game.players.length).toBe(previousLength + 1);
    });
  });

  describe('startNextTurn', () => {
    it('should increase roundcounter', () => {
      const previousRoundCounter = game.roundCounter;
      game.startNextTurn();

      expect(game.roundCounter).toBe(previousRoundCounter + 1);
    });

    it('should call gameOver correctly', () => {
      game.roundCounter = 15;

      game.startNextTurn();

      const expectedWinner = [{ username: '', userID: 'e1' }];
      expect(gameOver).toHaveBeenCalledWith(expectedWinner, game.id);
    });
  });

  describe('addToken', () => {
    it('should add sound tokens correctly', () => {
      game.addToken(1, 'sound', 'e1');

      const expectedResult = [{ id: 1, enemyID: 'e1' }];
      expect(game.soundTokens).toEqual(expectedResult);
    });

    it('should add sight tokens correctly', () => {
      game.addToken(1, 'sight', ['e1']);

      const expectedResult = [{ id: 1, enemyID: ['e1'] }];
      expect(game.sightTokens).toEqual(expectedResult);
    });

    it('should not do anything with incorrect params', () => {
      game.addToken(1, '', ['e1']);

      expect(game.sightTokens).toEqual([]);
      expect(game.soundTokens).toEqual([]);
    });
  });

  describe('seenSomeone', () => {
    it('should return true correctly', () => {
      game.sightTokens = [{ id: 1, enemyID: ['e1'] }];

      const result = game.seenSomeone('e1');

      expect(result).toBe(true);
    });

    it('should return false correctly', () => {
      game.sightTokens = [{ id: 1, enemyID: [] }];

      const result = game.seenSomeone('e1');

      expect(result).toBe(false);
    });
  });

  describe('heardSomeone', () => {
    it('should return true correctly', () => {
      game.soundTokens = [{ id: 1, enemyID: 'e1' }];

      const result = game.heardSomeone('e1');

      expect(result).toBe(true);
    });

    it('should return false correctly', () => {
      game.soundTokens = [{ id: 1, enemyID: 'e2' }];

      const result = game.heardSomeone('e1');

      expect(result).toBe(false);
    });
  });

  describe('getVisiblePlayers', () => {
    it('should return visible players', () => {
      const visiblePlayer = new Player({
        id: '2',
        home: positions[4],
        key: positions[5],
        goal: positions[6],
        username: 'visible',
      });
      visiblePlayer.visible = true;
      game.players = [visiblePlayer, player];

      const result = game.getVisiblePlayers();

      const expectedResult = [{ id: '2', position: positions[4] }];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('checkEnemyTarget', () => {
    beforeEach(() => {
      player.position = positions[26];
      game.players = [player];
    });

    it('should update data correctly when a player is caught', () => {
      expect(player.caught).toBe(false);
      expect(game.caughtPlayers).toEqual([]);

      const previousEnemyWinCounter = game.enemyWinCounter;

      game.checkEnemyTarget(new Enemy('e1'));

      expect(game.enemyWinCounter).toBe(previousEnemyWinCounter + 1);
      expect(player.caught).toBe(true);
      expect(game.caughtPlayers).toEqual(['1']);
    });

    it('should not add caught player twice', () => {
      expect(game.enemyWinCounter).toBe(0);

      game.checkEnemyTarget(new Enemy('e1'));

      expect(game.enemyWinCounter).toBe(1);

      game.checkEnemyTarget(new Enemy('e2'));

      expect(game.enemyWinCounter).toBe(1);
    });

    it('should call socket.emits correctly', () => {
      game.checkEnemyTarget(new Enemy('e1'));

      expect(updatePlayer).toHaveBeenCalledWith(player, game.id);
      const expectedMessage = [{ text: 'username', id: '1' }, { text: ' is caught! Enemy win counter is now 1' }];
      expect(logProgress).toHaveBeenCalledWith(expectedMessage, { room: game.id });
      expect(updateEnemyWinCounterClient).toHaveBeenCalledWith(game.id);
    });

    it('should call game over correctly', () => {
      game.enemyWinCounter = 1;
      game.checkEnemyTarget(new Enemy('e1'));

      expect(gameOver).toHaveBeenCalledWith([{ username: '', userID: 'e1' }], game.id);
    });
  });

  describe('addCaughtPlayer', () => {
    it('should update caughtPlayers correctly', () => {
      expect(game.caughtPlayers).toEqual([]);

      game.addCaughtPlayer(player);

      expect(game.caughtPlayers).toEqual(['1']);
    });
  });

  describe('removeCaughtPlayer', () => {
    beforeEach(() => {
      game.caughtPlayers = ['1', '2'];
    });

    it('should remove player from caughtPlayers correctly', () => {
      game.removeCaughtPlayer(player);

      expect(game.caughtPlayers).toEqual(['2']);
    });

    it('should call filterPlayersVisible correctly', () => {
      const spy = jest.spyOn(game, 'filterPlayersVisible').mockImplementation();

      game.removeCaughtPlayer(player);

      expect(spy).toHaveBeenCalledWith('1');
      spy.mockRestore();
    });
  });

  describe('filterPlayersVisible', () => {
    it("should remove playerID from enemies' playerVisible", () => {
      game.enemies.e1.playersVisible = ['1', '2'];
      game.enemies.e2.playersVisible = ['1'];

      game.filterPlayersVisible('1');

      expect(game.enemies.e1.playersVisible).toEqual(['2']);
      expect(game.enemies.e2.playersVisible).toEqual([]);
    });
  });

  describe('isCaught', () => {
    it('should return true if player is included in caughtPlayers', () => {
      game.caughtPlayers = ['1'];

      const result = game.isCaught('1');

      expect(result).toBe(true);
    });

    it('should return false if player is not included in caughtPlayers', () => {
      game.caughtPlayers = ['2'];

      const result = game.isCaught('1');

      expect(result).toBe(false);
    });
  });

  describe('generatePlayerInfo', () => {
    it('should return player info correctly', () => {
      const result = game.generatePlayerInfo('username');

      expect(Number(result.id)).toBeLessThan(7);
      expect(Number(result.id)).toBeGreaterThan(0);

      expect(result.home.id).toBe(Number(result.id));

      const resultKeyIsAKey = Boolean(keys.find((k) => k.id === result.key.id));
      expect(resultKeyIsAKey).toBe(true);

      const resultGoalIsLinkedToKey = Boolean(keys.find((k) => k.goal === result.goal.id));
      expect(resultGoalIsLinkedToKey).toBe(true);

      expect(result.username).toBe('username');
    });

    it('should return unique key', () => {
      game.claimedKeys = [10, 36, 67, 82, 72, 107, 130]; //all possible keyID:n except 149

      const result = game.generatePlayerInfo('username');

      expect(result.key.id).toBe(149);
    });

    it('should return unique playerID', () => {
      const players = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }] as Player[]; //all possible playerID:n execpt 6
      game.players = players;

      const result = game.generatePlayerInfo('username');

      expect(result.id).toBe('6');
    });

    it('should add key to claimedKeys', () => {
      expect(game.claimedKeys).toEqual([]);
      const result = game.generatePlayerInfo('username');

      expect(game.claimedKeys).toEqual([result.key.id]);
    });
  });

  describe('getServerPosition', () => {
    it('should return server-position correctly', () => {
      const result = game.getServerPosition(1);

      expect(result).toBe(positions[1]);
    });
  });
});
