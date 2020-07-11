import React from 'react';

interface SelectEnemyButtonsProps {
  selectEnemyHandler: Function;
}

const SelectEnemyButtons = ({ selectEnemyHandler }: SelectEnemyButtonsProps) => {
  return (
    <>
      <p>Choose which enemy to start with</p>
      <button onClick={() => selectEnemyHandler('e1')}>Enemy 1</button>
      <button onClick={() => selectEnemyHandler('e2')}>Enemy 2</button>
    </>
  );
};

export default SelectEnemyButtons;
