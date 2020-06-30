import React from 'react';

const SelectEnemyButtons = ({ selectEnemyHandler }) => {
  return (
    <>
      <p>Choose which enemy to start with</p>
      <button onClick={() => selectEnemyHandler('e1')}>Enemy 1</button>
      <button onClick={() => selectEnemyHandler('e2')}>Enemy 2</button>
    </>
  );
};

export default SelectEnemyButtons;
