import ClientEnemy from './clientEnemy';
import positions from '../shared/positions';

describe('enemy', () => {
  it('ClientEnemy gets proper defaults', () => {
    const clientEnemy = new ClientEnemy('test', positions[1]);

    expect(clientEnemy.id).toEqual('test');
    expect(clientEnemy.position).toEqual(positions[1]);
    expect(clientEnemy.isEvil).toEqual(true);
  });
});
