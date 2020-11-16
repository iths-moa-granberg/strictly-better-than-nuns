export interface Position {
  id: number;
  x: number;
  y: number;
  neighbours: number[];
  inSight: number[];
  requireKey?: boolean;
}

export interface Users {
  [key: string]: User;
}

interface User {
  username: string;
  role: string;
  playerId: string;
}

export interface ClientUser {
  username: string;
  userID: string;
}

export interface SightToken {
  id: number;
  enemyID: ('e1' | 'e2')[];
}

export interface SoundToken {
  id: number;
  enemyID: 'e1' | 'e2';
}

export type VisiblePlayers = { id: string; position: Position; direction?: string }[];

export interface ProgressLogObject {
  text: string;
  id?: string;
}

export interface ChatMessage {
  text: string;
  id: string;
}

export interface OnUpdateBoard {
  visiblePlayers: VisiblePlayers;
  soundTokens: SoundToken[];
  sightTokens: SightToken[];
  enemyPaths: string[];
  reachablePositions: Position[];
}

export interface OnPlayerSelectToken {
  heardTo: SoundToken[];
  id: string;
  turn: 'enemy' | 'player';
  enemyID: 'e1' | 'e2';
  sound: number;
}

export interface OnChooseNewPath {
  pathNames: string[];
}

export interface OnPossibleSteps {
  possibleSteps: Position[];
  stepsLeft?: number;
}

export interface OnEnemyTakesStep {
  position: Position;
}

export interface OnPlayerTakesStep {
  position: Position;
}

export interface OnPlayerPlacedToken {
  position: Position;
  turn: 'player' | 'enemy';
  enemyID: 'e1' | 'e2';
  sound: number;
}

export interface OnUpdatePlayer {
  id: string;
  hasKey: boolean;
  hasGoal: boolean;
  visible: boolean;
}

export interface OnSelectEnemy {
  enemyID: 'e1' | 'e2';
}

export interface OnPlayersTurn {
  resetPosition?: Position;
  caughtPlayers: string[];
}

export interface OnPlayerSelectsPace {
  pace: string;
}

export interface OnEnemySelectsPace {
  pace: string;
}

export interface OnSelectPath {
  pathName: string;
}

export interface OnProgress {
  msg: ProgressLogObject[];
}

export interface OpenGame {
  id: string;
  name: string;
  users: Users;
  status: 'open' | 'full';
}

export interface OnStartScreen {
  openGames: OpenGame[];
}

export interface OnUpdateOpenGames {
  openGames: OpenGame[];
}

export interface OnInit {
  enemyJoined: boolean;
  allGoodPlayersJoined: boolean;
}

export interface OnSetUpPlayer {
  id: string;
  home: Position;
  key: Position;
  goal: Position;
  isEvil: boolean;
}

export interface OnSetUpEnemy {
  startPositions: Position[];
}

export interface OnJoinGame {
  gameID: string;
  user: ClientUser;
}

export interface OnPlayerJoined {
  good: boolean;
  user: ClientUser;
}

export interface OnInitNewGame {
  user: ClientUser;
}

export interface OnGameOver {
  winner: ClientUser;
}

export interface OnSetEnemyWinGoal {
  num: number;
}

export interface OnSendMessage {
  msg: ChatMessage;
}

export interface OnCheckPulseDistance {
  position: Position;
}

export interface OnUpdatePulseFrequency {
  newPulseFrequency: number;
}

export interface OnInitialPlayerIDs {
  playerIDs: string[];
}
