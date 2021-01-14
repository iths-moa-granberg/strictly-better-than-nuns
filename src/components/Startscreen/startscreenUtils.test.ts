import { createUser, getUsernames } from './startscreenUtils';

describe('startscreenUtils', () => {
  describe('createUser', () => {
    it('should return user correctly', () => {
      const output = createUser('testUsername');

      expect(output.username).toEqual('testUsername');
      expect(output.userID).toMatch(/(testUsername)/i);
    });
  });

  describe('getUsernames', () => {
    it('should return string with users listed correctly', () => {
      const users = {
        Ann_123abc: { username: 'Ann', role: 'evil', playerId: 'e1' },
        Ben_123abc: { username: 'Ben', role: 'good', playerId: '1' },
        Cece_123abc: { username: 'Cece', role: 'good', playerId: '2' },
      };
      const expectedOutput = 'Ann, Ben, Cece';

      expect(getUsernames(users)).toEqual(expectedOutput);
    });
  });
});
