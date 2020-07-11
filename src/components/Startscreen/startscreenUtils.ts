import { Users } from '../../shared/sharedTypes';

export const createUser = (username: string) => ({
  username,
  userID: username + '_' + Math.random().toString(36).substr(2, 9),
});

export const getUsernames = (users: Users) => {
  return Object.values(users)
    .map((user) => user.username)
    .join(', ');
};
