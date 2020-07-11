import React from 'react';
import { Position } from '../../../shared/sharedTypes';

interface BoardPositionProps {
  position: Position;
  className: string;
  children: JSX.Element[];
  clickHandler: Function;
}

const BoardPosition = ({ position, className, children, clickHandler }: BoardPositionProps) => {
  return (
    <div
      className={className}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      onClick={() => clickHandler(position)}>
      <p>{position.id}</p>
      {children}
    </div>
  );
};

export default BoardPosition;
