import React from 'react';

const BoardPosition = ({ position, className, children, clickHandler }) => {
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
