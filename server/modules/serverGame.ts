import positions from '../../src/shared/positions';
import { Player, Enemy } from './serverPlayer';
import Board from './serverBoard';
import { gameOver, logProgress, updateEnemyWinCounterClient, updatePlayer } from '../controllers/sharedFunctions';
import { Enemies } from '../serverTypes';
import { SoundToken, SightToken, VisiblePlayers } from '../../src/shared/sharedTypes';
import keys from '../../src/shared/keys';

interface Game {
  id: string;
  roundCounter: number;
  players: Player[];
  caughtPlayers: string[];
  enemyWinCounter: number;
  playerTurnCompleted: number;
  placedSoundCounter: number;

  soundTokens: SoundToken[];
  sightTokens: SightToken[];

  enemyJoined: boolean;
  enemyMovesCompleted: number;
  enemyListened: number;
  board: Board;
  enemies: Enemies;

  claimedKeys: number[];
}

class Game {
  constructor() {
    this.id = this.generateGameID();
    this.roundCounter = 0;
    this.players = [];
    this.caughtPlayers = [];
    this.enemyWinCounter = 0;
    this.playerTurnCompleted = 0;
    this.placedSoundCounter = 0;
    this.soundTokens = [];
    this.sightTokens = [];
    this.enemyJoined = false;
    this.enemyMovesCompleted = 0;
    this.enemyListened = 0;

    this.board = new Board();
    this.enemies = { e1: new Enemy('e1'), e2: new Enemy('e2'), username: '' };

    this.claimedKeys = [];
  }

  generateGameID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  addPlayer = (newPlayer: Player) => {
    this.players.push(newPlayer);
  };

  startNextTurn = () => {
    this.roundCounter++;
    if (this.roundCounter > 15) {
      gameOver({ username: this.enemies.username, userID: 'e1' }, this.id);
    }
  };

  addToken = (positionID: number, type: string, enemyID: ('e1' | 'e2')[] | 'e1' | 'e2') => {
    if (type === 'sound') {
      this.soundTokens.push({ id: positionID, enemyID: enemyID as 'e1' | 'e2' });
    } else if (type === 'sight') {
      this.sightTokens.push({ id: positionID, enemyID: enemyID as ('e1' | 'e2')[] });
    }
  };

  seenSomeone = (enemyID: 'e1' | 'e2') => {
    return Boolean(this.sightTokens.find((token) => token.enemyID.includes(enemyID)));
  };

  heardSomeone = (enemyID: 'e1' | 'e2') => {
    return Boolean(this.soundTokens.find((token) => token.enemyID === enemyID));
  };

  getVisiblePlayers = () => {
    return this.players
      .filter((player) => player.visible)
      .map((player) => ({ id: player.id, position: player.position })) as VisiblePlayers;
  };

  checkEnemyTarget = (enemy: Enemy) => {
    for (let player of this.players) {
      if (enemy.checkTarget(player) && !this.caughtPlayers.includes(player.id)) {
        this.enemyWinCounter++;
        player.isCaught();
        this.addCaughtPlayer(player);

        updatePlayer(player, this.id);

        const msg = [
          { text: player.username, id: player.id },
          { text: ` is caught! Enemy win counter is now ${this.enemyWinCounter}` },
        ];
        logProgress(msg, { room: this.id });

        updateEnemyWinCounterClient(this.id);
      }
    }
    if (this.enemyWinCounter > this.players.length) {
      gameOver({ username: this.enemies.username, userID: 'e1' }, this.id);
    }
  };

  addCaughtPlayer = (player: Player) => {
    this.caughtPlayers.push(player.id);
  };

  removeCaughtPlayer = (player: Player) => {
    this.caughtPlayers = this.caughtPlayers.filter((id) => id != player.id);

    this.enemies.e1.playersVisible = this.enemies.e1.playersVisible.filter((id) => id !== player.id);
    this.enemies.e2.playersVisible = this.enemies.e2.playersVisible.filter((id) => id !== player.id);
  };

  isCaught = (player: Player) => {
    return this.caughtPlayers.includes(player.id);
  };

  generatePlayerInfo = (username: string) => {
    let key = keys[Math.round(Math.random() * 7)];

    while (this.claimedKeys.find((id) => id === key.id)) {
      key = keys[Math.round(Math.random() * 7)];
    }

    this.claimedKeys.push(key.id);

    let id = (Math.round(Math.random() * 5) + 1).toString(); //id starts with 1, max 6 players

    while (this.players.find((player) => player.id === id)) {
      id = (Math.round(Math.random() * 5) + 1).toString();
    }

    return {
      id,
      home: positions[Number(id)],
      key: positions[key.id],
      goal: positions[key.goal],
      username,
    };
  };

  getServerPosition = (id: number) => {
    return positions[id];
  };
}

export default Game;
