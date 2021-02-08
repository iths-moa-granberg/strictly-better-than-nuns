import { gameOver, logProgress, updateEnemyWinCounterClient, updatePlayer } from '../controllers/sharedFunctions';
import positions from '../../src/shared/positions';
import keys from '../../src/shared/keys';
import Enemy from './serverEnemy';

import Player from './serverPlayer';
import { Enemies } from '../serverTypes';
import { SoundToken, SightToken, VisiblePlayers, ClientUser, Position } from '../../src/shared/sharedTypes';

interface Game {
  id: string;
  roundCounter: number;
  players: Player[];
  caughtPlayers: string[];
  winners: ClientUser[];
  enemyWinCounter: number;
  playerTurnCompleted: number;
  placedSoundCounter: number;

  soundTokens: SoundToken[];
  sightTokens: SightToken[];
  newSoundLog: string[];

  enemyJoined: boolean;
  enemyMovesCompleted: number;
  enemyListened: number;
  enemies: Enemies;

  claimedKeys: number[];
}

class Game {
  constructor() {
    this.id = this.generateGameID();
    this.roundCounter = 0;
    this.players = [];
    this.caughtPlayers = [];
    this.winners = [];
    this.enemyWinCounter = 0;
    this.playerTurnCompleted = 0;
    this.placedSoundCounter = 0;
    this.soundTokens = [];
    this.sightTokens = [];
    this.newSoundLog = [];
    this.enemyJoined = false;
    this.enemyMovesCompleted = 0;
    this.enemyListened = 0;

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
      gameOver([{ username: this.enemies.username, userID: 'e1' }], this.id);
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
      gameOver([{ username: this.enemies.username, userID: 'e1' }], this.id);
    }
  };

  addCaughtPlayer = (player: Player) => {
    this.caughtPlayers.push(player.id);
  };

  removeCaughtPlayer = (player: Player) => {
    this.caughtPlayers = this.caughtPlayers.filter((id) => id != player.id);
    this.filterPlayersVisible(player.id);
  };

  filterPlayersVisible = (id: string) => {
    this.enemies.e1.playersVisible = this.enemies.e1.playersVisible.filter((playerID) => playerID !== id);
    this.enemies.e2.playersVisible = this.enemies.e2.playersVisible.filter((playerID) => playerID !== id);
  };

  isCaught = (playerID: string) => {
    return this.caughtPlayers.includes(playerID);
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

  logSound = () => {
    if (this.newSoundLog.find((id) => id === 'e1') && this.newSoundLog.find((id) => id === 'e2')) {
      const msg = [{ text: 'Both enemies heard someone!' }];
      logProgress(msg, { room: this.id });
    } else {
      if (this.newSoundLog.find((id) => id === 'e1')) {
        const msg = [
          {
            text: 'Enemy 1',
            id: 'e1',
          },
          { text: ' heard someone!' },
        ];
        logProgress(msg, { room: this.id });
      }
      if (this.newSoundLog.find((id) => id === 'e2')) {
        const msg = [
          {
            text: 'Enemy 2',
            id: 'e2',
          },
          { text: ' heard someone!' },
        ];
        logProgress(msg, { room: this.id });
      }
    }
    this.newSoundLog = [];
  };

  _getVisiblePlayers = () => {
    return this.players
      .filter((player) => player.visible)
      .map((player) => ({ id: player.id, position: player.position })) as VisiblePlayers;
  };

  _getDirection = (position: Position, lastPosition: Position) => {
    if (position.x !== lastPosition.x && position.y !== lastPosition.y) {
      if (Math.abs(position.x - lastPosition.x) > Math.abs(position.y - lastPosition.y)) {
        return position.x > lastPosition.x ? 'right' : 'left';
      }
      return position.y > lastPosition.y ? 'down' : 'up';
    } else if (position.x === lastPosition.x) {
      return position.y > lastPosition.y ? 'down' : 'up';
    } else {
      return position.x > lastPosition.x ? 'right' : 'left';
    }
  };

  getUpdatedBoardData = () => {
    const visiblePlayers = this._getVisiblePlayers();
    visiblePlayers.push({
      id: 'e1',
      position: this.enemies.e1.position,
      direction: this._getDirection(this.enemies.e1.position, this.enemies.e1.lastPosition),
    });
    visiblePlayers.push({
      id: 'e2',
      position: this.enemies.e2.position,
      direction: this._getDirection(this.enemies.e2.position, this.enemies.e2.lastPosition),
    });

    const reachablePositions: Position[] = [];

    return {
      visiblePlayers,
      soundTokens: this.soundTokens,
      sightTokens: this.sightTokens,
      enemyPaths: [this.enemies.e1.pathName, this.enemies.e2.pathName],
      reachablePositions,
    };
  };
}

export default Game;
