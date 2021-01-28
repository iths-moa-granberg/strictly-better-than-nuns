import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import GameOverScreen from './GameOverScreen';

describe('GameOverScreen component', () => {
  it('renders with one winner', () => {
    const winners = [{ username: 'winner', userID: 'a1' }];
    const { container } = render(<GameOverScreen winners={winners} />);

    expect(container).toMatchSnapshot();
  });

  it('renders with two winners', () => {
    const winners = [
      { username: 'winner', userID: 'a1' },
      { username: 'winner nr 2', userID: 'b2' },
    ];
    const { container } = render(<GameOverScreen winners={winners} />);

    expect(container).toMatchSnapshot();
  });

  it('renders with multiple winners', () => {
    const winners = [
      { username: 'winner', userID: 'a1' },
      { username: 'winner nr 2', userID: 'b2' },
      { username: 'winner nr 3', userID: 'c3' },
      { username: 'winner nr 4', userID: 'd4' },
    ];
    const { container } = render(<GameOverScreen winners={winners} />);

    expect(container).toMatchSnapshot();
  });

  it('should reload on click', () => {
    const winners = [{ username: 'winner', userID: 'a1' }];
    const { getByText } = render(<GameOverScreen winners={winners} />);
    window.location.reload = jest.fn();

    fireEvent.click(getByText('New game'));

    expect(window.location.reload).toHaveBeenCalled();
  });
});
