import React, { useState, useEffect } from 'react';
import { socket } from '../../../../App';
import { MyPlayer } from '../../../../clientTypes';
import { OnPlayerSelectsPace, OnEnemySelectsPace } from '../../../../shared/sharedTypes';
import styles from '../../../../scss/Buttons.module.scss';

interface PaceButtonsProps {
  myPlayer: MyPlayer;
  playersTurn: boolean;
  caught: boolean;
}

const PaceButtons = ({ myPlayer, playersTurn, caught }: PaceButtonsProps) => {
  const [selectedPace, setSelectedPace] = useState<string>('');
  const [hover, setHover] = useState<string>('');

  useEffect(() => {
    if (!myPlayer.isEvil && caught && !selectedPace) {
      setSelectedPace('walk');

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

  const Button = ({ text }: { text: string }) => {
    return (
      <button
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
    if (playersTurn) {
      return <h1>Waiting for your turn</h1>;
    }

    return (
      <>
        <h1>Choose your pace</h1>

        <div>
          <Button text="Walk" />
          <Button text="Run" />
        </div>

        {hover === 'walk' && (
          <p>When walking, you can move 3-4 steps and listen after players at the end of your turn</p>
        )}
        {hover === 'run' && (
          <p>
            When running, you can move 5-6 steps and but <span>won't</span> listen for players
          </p>
        )}
        {hover === '' && (
          <p>
            <br></br>
            <br></br>
          </p>
        )}

        {selectedPace && <p>Click on position next to your player to take a step</p>}
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

  if (!playersTurn) {
    return <h1>Waiting for your turn</h1>;
  }

  return (
    <>
      <h1>Choose your pace</h1>

      <div>
        <Button text="Stand" />
        <Button text="Sneak" />
        <Button text="Walk" />
        <Button text="Run" />
      </div>

      {hover === 'stand' && <p>When standing, you can move 0 steps and make noise up to 3 spaces away</p>}
      {hover === 'sneak' && <p>When sneaking, you can move 2 steps and make noise up to 4 spaces away</p>}
      {hover === 'walk' && <p>When walking, you can move 3 steps and make noise up to 5 spaces away</p>}
      {hover === 'run' && <p>When running, you can move 5 steps and make noise up to 6 spaces away</p>}
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
