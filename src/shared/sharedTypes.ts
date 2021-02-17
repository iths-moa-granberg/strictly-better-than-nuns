export interface Position {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly neighbours: number[];
  readonly inSight: number[];
  readonly requireKey?: boolean;
}

export interface Users {
  [key: string]: User;
}

interface User {
  username: string;
  role: string;
  playerID: string;
}

export interface ClientUser {
  readonly username: string;
  readonly userID: string;
}

export interface SightToken {
  readonly id: number;
  readonly enemyID: ('e1' | 'e2')[];
}

export interface SoundToken {
  readonly id: number;
  readonly enemyID: 'e1' | 'e2';
}

export type VisiblePlayers = {
  readonly id: string;
  readonly position: Position;
  readonly direction?: string;
  readonly adjustPosition?: number;
}[];

export interface ProgressLogObject {
  readonly text: string;
  readonly id?: string;
}

export interface ChatMessage {
  readonly text: string;
  readonly id: string;
}

export interface OnUpdateBoard {
  readonly visiblePlayers: VisiblePlayers;
  readonly soundTokens: SoundToken[];
  readonly sightTokens: SightToken[];
  readonly enemyPaths: string[];
  readonly reachablePositions: Position[];
}

export interface OnPlayerSelectToken {
  readonly heardTo: SoundToken[];
  readonly id: string;
  readonly turn: 'enemy' | 'player';
  readonly enemyID: 'e1' | 'e2';
  readonly sound: number;
}

export interface OnChooseNewPath {
  readonly pathNames: string[];
}

export interface OnPossibleSteps {
  readonly possibleSteps: Position[];
  readonly stepsLeft?: number;
}

export interface OnEnemyTakesStep {
  readonly position: Position;
}

export interface OnPlayerTakesStep {
  readonly position: Position;
}

export interface OnPlayerPlacedToken {
  readonly position: Position;
  readonly turn: 'player' | 'enemy';
  readonly enemyID: 'e1' | 'e2';
  readonly sound: number;
}

export interface OnUpdatePlayer {
  readonly id: string;
  readonly hasKey: boolean;
  readonly hasGoal: boolean;
  readonly visible: boolean;
}

export interface OnSelectEnemy {
  readonly enemyID: 'e1' | 'e2';
}

export interface OnPlayersTurn {
  readonly resetPosition?: Position;
  readonly caughtPlayers: string[];
}

export interface OnPlayerSelectsPace {
  readonly pace: string;
  readonly firstTurn?: boolean;
}

export interface OnEnemySelectsPace {
  readonly pace: string;
}

export interface OnSelectPath {
  readonly pathName: string;
}

export interface OnProgress {
  readonly msg: ProgressLogObject[];
}

export interface OpenGame {
  readonly id: string;
  readonly name: string;
  readonly users: Users;
  readonly status: 'open' | 'full';
}

export interface OnStartScreen {
  readonly openGames: OpenGame[];
}

export interface OnUpdateOpenGames {
  readonly openGames: OpenGame[];
}

export interface OnInit {
  readonly enemyJoined: boolean;
  readonly allGoodPlayersJoined: boolean;
}

export interface OnSetUpPlayer {
  readonly id: string;
  readonly home: Position;
  readonly key: Position;
  readonly goal: Position;
}

export interface OnSetUpEnemy {
  readonly startPositions: Position[];
}

export interface OnJoinGame {
  readonly gameID: string;
  readonly user: ClientUser;
}

export interface OnPlayerJoined {
  readonly good: boolean;
  readonly user: ClientUser;
}

export interface OnInitNewGame {
  readonly user: ClientUser;
}

export interface OnGameOver {
  readonly winners: ClientUser[];
}

export interface OnSetEnemyWinGoal {
  readonly num: number;
}

export interface OnSendMessage {
  readonly msg: ChatMessage;
}

export interface OnCheckPulseDistance {
  readonly position: Position;
}

export interface OnUpdatePulseFrequency {
  readonly newPulseFrequency: number;
}

export interface OnInitialPlayerIDs {
  readonly playerIDs: string[];
}

export interface OnPlayersFirstTurn {
  readonly resetPosition?: Position;
}

export interface OnSetInitialPath {
  readonly pathName: string;
}

export interface OnSelectInitialPaths {
  readonly pathNames: string[];
}
