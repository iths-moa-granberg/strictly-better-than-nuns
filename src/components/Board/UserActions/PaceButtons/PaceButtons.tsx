import React, { useState, useEffect } from 'react';
import { socket } from '../../../../App';
import { MyPlayer } from '../../../../clientTypes';
import { OnPlayerSelectsPace, OnEnemySelectsPace } from '../../../../shared/sharedTypes';
import styles from '../Buttons.module.scss';

interface PaceButtonsProps {
  myPlayer: MyPlayer;
  playersTurn: boolean;
  caught: boolean;
}

const PaceButtons = ({ myPlayer, playersTurn, caught }: PaceButtonsProps) => {
  const [selectedPace, setSelectedPace] = useState<string>('');
  const [enemyDisabled, setEnemyDisabled] = useState<boolean>(true);
  const [playerDisabled, setPlayerDisabled] = useState<boolean>(true);
  const [hover, setHover] = useState<string>('');

  useEffect(() => {
    setEnemyDisabled(playersTurn);
    setPlayerDisabled(!playersTurn);
  }, [playersTurn]);

  useEffect(() => {
    if (!myPlayer.isEvil && caught && !selectedPace) {
      setSelectedPace('walk');
      setPlayerDisabled(true);

      const params: OnPlayerSelectsPace = { pace: 'walk' };
      socket.emit('player selects pace', params);
    }
  }, [caught, myPlayer, selectedPace]);

  const handleSelectsPace = (pace: string) => {
    if (myPlayer.isEvil) {
      const params: OnEnemySelectsPace = { pace };
      socket.emit('enemy selects pace', params);
    } else {
      const params: OnPlayerSelectsPace = { pace };
      socket.emit('player selects pace', params);
    }
    setSelectedPace(pace);
  };

  const Button = ({ disabled, text }: { disabled: boolean; text: string }) => {
    return (
      <button
        disabled={disabled}
        className={
          selectedPace && selectedPace === text.toLowerCase() ? `${styles.button} ${styles.active}` : styles.button
        }
        onClick={(e) => handleSelectsPace((e.target as HTMLElement).innerHTML.toLowerCase())}
        onMouseOver={(e) => setHover((e.target as HTMLElement).innerHTML.toLowerCase())}
        onMouseLeave={() => setHover('')}>
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

  if (caught) {
    return (
      <>
        <h1>You are caught!</h1>
        <p>Walk straight home until no longer in view</p>
      </>
    );
  }

  return (
    <>
      <h1>Choose your pace</h1>
      <div>
        <Button disabled={playerDisabled} text="Stand" />
        <Button disabled={playerDisabled} text="Sneak" />
        <Button disabled={playerDisabled} text="Walk" />
        <Button disabled={playerDisabled} text="Run" />
      </div>
      {hover === 'stand' && <p>When standing, you can move 0 steps and makes noise up to 3 spaces away</p>}
      {hover === 'sneak' && <p>When sneaking, you can move 2 steps and makes noise up to 4 spaces away</p>}
      {hover === 'walk' && <p>When walking, you can move 3 steps and makes noise up to 5 spaces away</p>}
      {hover === 'run' && <p>When running, you can move 5 steps and makes noise up to 6 spaces away</p>}
      {hover === '' && (
        <p>
          <br></br>
          <br></br>
        </p>
      )}
      {selectedPace && <p>Click on position next to your player to take a step</p>}
    </>
  );
};

export default PaceButtons;
