export const createUser = (username: string) => ({
  username,
  userID: username + '_' + Math.random().toString(36).substr(2, 9),
});
