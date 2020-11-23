import React, { useEffect, useState } from 'react';
import { socket } from '../../../App';
import { MyPlayer } from '../../../clientTypes';
import ClientPlayer from '../../../modules/clientPlayer';
import { VisiblePlayers, Position, OnUpdatePulseFrequency, OnCheckPulseDistance } from '../../../shared/sharedTypes';
import styles from './Players.module.scss';

interface PlayersProps {
  myPlayer: MyPlayer;
  players: VisiblePlayers;
  currentEnemyID: 'e1' | 'e2' | null;
}

interface EnemyPlayerProps {
  id: string;
  direction: string;
  position: Position;
  currentEnemyID: 'e1' | 'e2' | null;
}

interface PlayerProps {
  id: string;
  position: Position;
  pulseFrequency?: number;
}

interface ActiveGoodPlayerProps {
  myGoodPlayer: ClientPlayer;
}

interface MappedPlayersProps {
  players: VisiblePlayers;
  myPlayer: MyPlayer;
  currentEnemyID: 'e1' | 'e2' | null;
}

const EnemyPlayer = ({ id, direction, position, currentEnemyID }: EnemyPlayerProps) => {
  return (
    <div
      className={styles.enemyPlayerWrapper}
      style={{
        top: `${position.y * (856 / 900) + 0.6}vh`,
        left: `${position.x * (856 / 900) + 0.6}vh`,
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

const Player = ({ id, position, pulseFrequency }: PlayerProps) => {
  return (
    <div
      className={`
        ${styles.player} 
        ${styles[`${id}`]} 
        ${styles[pulseFrequency ? 'pulsatingShadow' : '']}
        `}
      style={{
        top: `${position.y * (856 / 900) - 0.6}vh`,
        left: `${position.x * (856 / 900) - 0.6}vh`,
        animationDuration: `${pulseFrequency}s`,
      }}
    />
  );
};

const MappedPlayers = ({ players, myPlayer, currentEnemyID }: MappedPlayersProps) => {
  if (!myPlayer.isEvil) {
    players = players.filter((p) => p.id !== (myPlayer as ClientPlayer).id);
  }

  return (
    <>
      {players.map((player) =>
        isNaN(Number(player.id)) && player.direction ? (
          <EnemyPlayer
            key={player.id}
            id={player.id}
            direction={player.direction}
            position={player.position}
            currentEnemyID={currentEnemyID}
          />
        ) : (
          <Player key={player.id} id={player.id} position={player.position} />
        )
      )}
    </>
  );
};

const ActiveGoodPlayer = ({ myGoodPlayer }: ActiveGoodPlayerProps) => {
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

  return <Player id={myGoodPlayer.id} position={myGoodPlayer.position} pulseFrequency={pulseFrequency} />;
};

const Players = ({ players, myPlayer, currentEnemyID }: PlayersProps) => {
  return (
    <article className="players-layer">
      {!myPlayer.isEvil && <ActiveGoodPlayer myGoodPlayer={myPlayer as ClientPlayer} />}
      <MappedPlayers players={players} myPlayer={myPlayer} currentEnemyID={currentEnemyID} />
    </article>
  );
};

export default Players;
