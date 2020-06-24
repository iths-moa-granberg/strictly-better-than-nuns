import React from 'react';

const Position = ({ position, className, children }) => {  
  return (
    <div className={className} style={{ top: `${position.y}px`, left: `${position.x}px` }}>
      <p>{position.id}</p>
      {children}
    </div>
  );
};

export default Position;
