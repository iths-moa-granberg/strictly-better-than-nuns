import { getClassName, stepIsValid } from './boardUtils';

import ClientPlayer from '../../modules/clientPlayer';
import ClientEnemy from '../../modules/clientEnemy';

import { Position } from '../../shared/sharedTypes';

describe('boardUtils', () => {
  const home = { id: 1, neighbours: [2] } as Position;
  const goodPlayer = new ClientPlayer('1', home, {} as Position, {} as Position);

  const evilPlayers = {
    e1: new ClientEnemy('e1', { id: 1, neighbours: [2] } as Position),
    e2: new ClientEnemy('e2', { id: 1, neighbours: [2] } as Position),
    isEvil: true,
  };

  describe('getClassName', () => {
    describe('gets reachable-class if reachable', () => {
      it.each`
        myPlayer       | currentPlayerID | expectedResult
        ${goodPlayer}  | ${null}         | ${{ reachable: 'reachable-1', clickable: '' }}
        ${evilPlayers} | ${'e1'}         | ${{ reachable: 'reachable-e1', clickable: '' }}
        ${evilPlayers} | ${'e2'}         | ${{ reachable: 'reachable-e2', clickable: '' }}
      `(
        'works when player is $currentPlayerID (null meaning good player)',
        ({ myPlayer, currentPlayerID, expectedResult }) => {
          const reachablePos = { id: 10, neighbours: [0] } as Position;
          const reachables = [reachablePos];

          const result = getClassName(myPlayer, currentPlayerID, reachablePos, reachables);
          expect(result).toEqual(expectedResult);
        }
      );
    });

    describe('gets clickable-class if clickable', () => {
      it.each`
        myPlayer       | currentPlayerID | expectedResult
        ${goodPlayer}  | ${null}         | ${{ reachable: 'reachable-1', clickable: 'clickable' }}
        ${evilPlayers} | ${'e1'}         | ${{ reachable: 'reachable-e1', clickable: 'clickable' }}
        ${evilPlayers} | ${'e2'}         | ${{ reachable: 'reachable-e2', clickable: 'clickable' }}
      `(
        'works when player is $currentPlayerID (null meaning good player)',
        ({ myPlayer, currentPlayerID, expectedResult }) => {
          const reachablePos = { id: 10, neighbours: [1] } as Position;
          const reachables = [reachablePos];

          const result = getClassName(myPlayer, currentPlayerID, reachablePos, reachables);

          expect(result).toEqual(expectedResult);
        }
      );
    });

    describe('is not clickable or reachable if not reachable', () => {
      it.each`
        myPlayer       | currentPlayerID
        ${goodPlayer}  | ${null}
        ${evilPlayers} | ${'e1'}
        ${evilPlayers} | ${'e2'}
      `('works when player is $currentPlayerID (null meaning good player)', ({ myPlayer, currentPlayerID }) => {
        const reachablePos = { id: 10, neighbours: [1] } as Position;
        const reachables: Position[] = [];

        const result = getClassName(myPlayer, currentPlayerID, reachablePos, reachables);

        expect(result).toEqual({ reachable: '', clickable: '' });
      });
    });
  });

  describe('stepIsValid', () => {
    describe('returns valid correctly', () => {
      it.each`
        myPlayer       | currentPlayerID
        ${goodPlayer}  | ${null}
        ${evilPlayers} | ${'e1'}
        ${evilPlayers} | ${'e2'}
      `('works when player is $currentPlayerID (null meaning good player)', ({ myPlayer, currentPlayerID }) => {
        const position = { id: 2 } as Position;
        const possibleSteps = [position];

        const result = stepIsValid(myPlayer, currentPlayerID, position, possibleSteps);

        expect(result).toEqual(true);
      });
    });

    describe('returns false if not neighbours', () => {
      it.each`
        myPlayer       | currentPlayerID
        ${goodPlayer}  | ${null}
        ${evilPlayers} | ${'e1'}
        ${evilPlayers} | ${'e2'}
      `('works when player is $currentPlayerID (null meaning good player)', ({ myPlayer, currentPlayerID }) => {
        const position = { id: 10 } as Position;
        const possibleSteps = [position];

        const result = stepIsValid(myPlayer, currentPlayerID, position, possibleSteps);

        expect(result).toEqual(false);
      });
    });

    describe('returns false if position is not part of possibleSteps', () => {
      it.each`
        myPlayer       | currentPlayerID
        ${goodPlayer}  | ${null}
        ${evilPlayers} | ${'e1'}
        ${evilPlayers} | ${'e2'}
      `('works when player is $currentPlayerID (null meaning good player)', ({ myPlayer, currentPlayerID }) => {
        const position = { id: 2 } as Position;
        const possibleSteps: Position[] = [];

        const result = stepIsValid(myPlayer, currentPlayerID, position, possibleSteps);

        expect(result).toEqual(false);
      });
    });
  });
});
