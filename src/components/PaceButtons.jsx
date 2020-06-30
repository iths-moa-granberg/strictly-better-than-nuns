import React, { useState, useEffect } from 'react';
import { socket } from '../App';

const PaceButtons = ({ myPlayer, playersTurn, caught }) => {
  const [selectedPace, setSelectedPace] = useState('');
  const [enemyDisabled, setEnemyDisabled] = useState(true);
  const [playerDisabled, setPlayerDisabled] = useState(true);

  useEffect(() => {
    setEnemyDisabled(playersTurn);
    setPlayerDisabled(!playersTurn);
  }, [playersTurn]);

  useEffect(() => {
    if (!myPlayer.isEvil && caught && !selectedPace) {
      setSelectedPace('walk');
      setPlayerDisabled(true);
      socket.emit('player selects pace', { pace: 'walk' });
    }
  }, [caught, myPlayer, selectedPace]);

  const handleSelectsPace = (pace) => {
    if (myPlayer.isEvil) {
      socket.emit('enemy selects pace', { pace });
    } else {
      socket.emit('player selects pace', { pace });
    }
    setSelectedPace(pace);
  };

  const Button = ({ disabled, text }) => {
    return (
      <button
        disabled={disabled}
        className={selectedPace && selectedPace !== text.toLowerCase() ? 'disabled' : ''}
        onClick={(e) => handleSelectsPace(e.target.innerHTML.toLowerCase())}>
        {text}
      </button>
    );
  };

  if (myPlayer.isEvil) {
    return (
      <>
        <Button disabled={enemyDisabled} text="Walk" />
        <Button disabled={enemyDisabled} text="Run" />
      </>
    );
  }

  return (
    <>
      {caught && <p>you are caught, walk straight to home until no longer in view</p>}
      <Button disabled={playerDisabled} text="Stand" />
      <Button disabled={playerDisabled} text="Sneak" />
      <Button disabled={playerDisabled} text="Walk" />
      <Button disabled={playerDisabled} text="Run" />
    </>
  );
};

export default PaceButtons;
