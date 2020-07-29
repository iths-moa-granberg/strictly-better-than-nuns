import { Users } from '../../shared/sharedTypes';
import { ClientUser } from '../../clientTypes';

export const createUser = (username: string) =>
  ({
    username,
    userID: username + '_' + Math.random().toString(36).substr(2, 9),
  } as ClientUser);

export const getUsernames = (users: Users) => {
  return Object.values(users)
    .map((user) => user.username)
    .join(', ');
};
