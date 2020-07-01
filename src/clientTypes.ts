//export?
export interface Users {
  [key: string]: User;
}

interface User {
  username: string;
  role: string;
}

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
