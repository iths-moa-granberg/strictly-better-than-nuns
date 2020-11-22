import { ClientPlayer, ClientEnemy } from './player';
import positions from '../shared/positions';

describe('player', () => {
  it('ClientPlayer gets proper defaults', () => {
    const clientPlayer = new ClientPlayer('test', positions[1], positions[2], positions[3], false);

    expect(clientPlayer.id).toEqual('test');
    expect(clientPlayer.isEvil).toEqual(false);

    expect(clientPlayer.home).toEqual(positions[1]);
    expect(clientPlayer.key).toEqual(positions[2]);
    expect(clientPlayer.goal).toEqual(positions[3]);

    expect(clientPlayer.home).toEqual(clientPlayer.position);

    expect(clientPlayer.hasKey).toEqual(false);
    expect(clientPlayer.hasGoal).toEqual(false);
    expect(clientPlayer.visible).toEqual(false);
  });

  it('ClientEnemy gets proper defaults', () => {
    const clientEnemy = new ClientEnemy('test', positions[1]);

    expect(clientEnemy.id).toEqual('test');
    expect(clientEnemy.position).toEqual(positions[1]);
    expect(clientEnemy.isEvil).toEqual(true);
  });
});
