import { Users } from './shared/sharedTypes';

export interface ClientUser {
  username: string;
  userID: string;
}

export interface OpenGame {
  id: string;
  name: string;
  users: Users;
}

export type OpenGames = {
  id: string;
  name: string;
  users: Users;
}[];
