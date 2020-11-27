import React, { useEffect, useState } from 'react';
import { socket } from '../../../App';
import { getPlayerPositionAdjustments, getPositioningValues } from './playerUtils';
import { MyPlayer } from '../../../clientTypes';
import ClientPlayer from '../../../modules/clientPlayer';
import { VisiblePlayers, OnUpdatePulseFrequency, OnCheckPulseDistance } from '../../../shared/sharedTypes';
import styles from './Players.module.scss';

interface PlayersProps {
  myPlayer: MyPlayer;
  players: VisiblePlayers;
  currentEnemyID: 'e1' | 'e2' | null;
}

interface EnemyPlayerProps {
  id: string;
  direction: string;
  currentEnemyID: 'e1' | 'e2' | null;
  positionValues: { top: number; left: number };
}

interface PlayerProps {
  id: string;
  positionValues: { top: number; left: number };
  pulseFrequency?: number;
}

interface ActiveGoodPlayerProps {
  myGoodPlayer: ClientPlayer;
  positionValues: { top: number; left: number };
}

const EnemyPlayer = ({ id, direction, currentEnemyID, positionValues }: EnemyPlayerProps) => {
  return (
    <div
      className={styles.enemyPlayerWrapper}
      style={{
        top: `${positionValues.top}vh`,
        left: `${positionValues.left}vh`,
      }}>
      <div className={`${styles.triangle} ${styles[direction]} ${styles[`${id}`]}`} />
      <div
        className={`
        ${styles.player} 
        ${styles[`${id}`]}
        ${styles[currentEnemyID ? `pulsatingShadow-${currentEnemyID}` : '']}
        `}
      />
    </div>
  );
};

const Player = ({ id, positionValues, pulseFrequency }: PlayerProps) => {
  return (
    <div
      className={`
        ${styles.player} 
        ${styles[`${id}`]} 
        ${styles[pulseFrequency ? 'pulsatingShadow' : '']}
        `}
      style={{
        top: `${positionValues.top}vh`,
        left: `${positionValues.left}vh`,
        animationDuration: `${pulseFrequency}s`,
      }}
    />
  );
};

const ActiveGoodPlayer = ({ myGoodPlayer, positionValues }: ActiveGoodPlayerProps) => {
  const [pulseFrequency, setPulseFrequency] = useState<number>(2.4);

  useEffect(() => {
    const params: OnCheckPulseDistance = { position: myGoodPlayer.position };
    socket.emit('check pulse distance', params);

    const onUpdatePulseFrequency = ({ newPulseFrequency }: OnUpdatePulseFrequency) => {
      setPulseFrequency(newPulseFrequency);
    };

    socket.on('update pulse frequency', onUpdatePulseFrequency);

    return () => {
      socket.off('update pulse frequency', onUpdatePulseFrequency);
    };
  }, [myGoodPlayer.position]);

  return <Player id={myGoodPlayer.id} positionValues={positionValues} pulseFrequency={pulseFrequency} />;
};

const Players = ({ players, myPlayer, currentEnemyID }: PlayersProps) => {
  let activePlayerPositionAdjustment: number = 0;

  const playerPositionAdjustments = getPlayerPositionAdjustments(players);

  if (!myPlayer.isEvil) {
    const myGoodPlayer = myPlayer as ClientPlayer;

    // sets active player's position adjustment based on visibility and position
    const player = players.find((p) => p.id === myGoodPlayer.id);
    if (player && myGoodPlayer.position.id === player.position.id) {
      activePlayerPositionAdjustment = playerPositionAdjustments[myGoodPlayer.id];
    }

    players = players.filter((p) => p.id !== myGoodPlayer.id);
  }

  return (
    <article className="players-layer">
      {!myPlayer.isEvil && (
        <ActiveGoodPlayer
          myGoodPlayer={myPlayer as ClientPlayer}
          positionValues={getPositioningValues(
            (myPlayer as ClientPlayer).position,
            activePlayerPositionAdjustment,
            false
          )}
        />
      )}

      {players.map((player) =>
        isNaN(Number(player.id)) && player.direction ? (
          <EnemyPlayer
            key={player.id}
            id={player.id}
            direction={player.direction}
            currentEnemyID={currentEnemyID}
            positionValues={getPositioningValues(player.position, playerPositionAdjustments[player.id], true)}
          />
        ) : (
          <Player
            key={player.id}
            id={player.id}
            positionValues={getPositioningValues(player.position, playerPositionAdjustments[player.id], false)}
          />
        )
      )}
    </article>
  );
};

export default Players;
