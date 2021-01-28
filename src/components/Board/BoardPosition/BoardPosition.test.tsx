import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import BoardPosition from './BoardPosition';

describe('BoardPosition', () => {
  it('renders correctly with one child and no classnames', () => {
    const position = { id: 1, x: 20, y: 30, neighbours: [], inSight: [] };
    const className = { reachable: '', clickable: '' };
    const children = [<div key="1">Child</div>];
    const clickHandler = jest.fn();

    const { container } = render(
      <BoardPosition position={position} className={className} children={children} clickHandler={clickHandler} />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders correctly with one child, reachable & clickable', () => {
    const position = { id: 1, x: 20, y: 30, neighbours: [], inSight: [] };
    const className = { reachable: 'reachable-1', clickable: 'clickable' };
    const children = [<div key="1">Child</div>];
    const clickHandler = jest.fn();

    const { container } = render(
      <BoardPosition position={position} className={className} children={children} clickHandler={clickHandler} />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders correctly with multiple children, reachable & clickable', () => {
    const position = { id: 1, x: 20, y: 30, neighbours: [], inSight: [] };
    const className = { reachable: 'reachable-1', clickable: 'clickable' };
    const children = [<div key="1">Child</div>, <div key="2">Another child</div>];
    const clickHandler = jest.fn();

    const { container } = render(
      <BoardPosition position={position} className={className} children={children} clickHandler={clickHandler} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should send position to clickhandler when clicked', () => {
    const position = { id: 1, x: 20, y: 30, neighbours: [], inSight: [] };
    const className = { reachable: 'reachable-1', clickable: 'clickable' };
    const children = [<div key="1">Child</div>];
    const clickHandler = jest.fn();

    const { container } = render(
      <BoardPosition position={position} className={className} children={children} clickHandler={clickHandler} />
    );

    const div = container.querySelector('div');
    fireEvent.click(div!);

    expect(clickHandler).toHaveBeenCalledWith(position);
  });
});
