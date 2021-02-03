import { getNewPulseFrequency } from './serverPlayerAnimationsModule';
import positions from '../../src/shared/positions';

import { Enemies } from '../serverTypes';

describe('serverPlayerAnimationsModule', () => {
  const enemies = {
    e1: { position: positions[1] },
    e2: { position: positions[1] },
  } as Enemies;

  describe('getNewPulseFrequency', () => {
    it('returns standard pace if same position as either enemy', () => {
      const position = positions[1];

      const result = getNewPulseFrequency(enemies, position);

      expect(result).toBe(0.3);
    });

    it('returns correct pace if the distance is big', () => {
      const position = positions[100];

      const result = getNewPulseFrequency(enemies, position);

      expect(result).toBe(2.4);
    });

    describe('returns correct pace', () => {
      it.each`
        position         | expectedPace
        ${positions[21]} | ${0.7}
        ${positions[20]} | ${0.9}
        ${positions[19]} | ${1.1}
        ${positions[18]} | ${1.3}
        ${positions[17]} | ${1.5}
        ${positions[16]} | ${1.7}
        ${positions[15]} | ${2.4}
      `('pace $expectedPace is working', ({ position, expectedPace }) => {
        const result = getNewPulseFrequency(enemies, position);
        expect(result).toEqual(expectedPace);
      });
    });
  });
});
