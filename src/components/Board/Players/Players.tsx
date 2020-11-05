import React, { useEffect, useState } from 'react';
import { socket } from '../../../App';
import { MyPlayer } from '../../../clientTypes';
import { ClientPlayer } from '../../../modules/player';
import { VisiblePlayers, Position, OnUpdatePulseFrequency, OnCheckPulseDistance } from '../../../shared/sharedTypes';
import styles from './Players.module.scss';

interface PlayersProps {
  myPlayer: MyPlayer;
  players: VisiblePlayers;
}

interface EnemyPlayerProps {
  id: string;
  direction: string;
  position: Position;
}

interface PlayerProps {
  id: string;
  position: Position;
  pulseFrequency?: number;
}

interface PlayersWhenGoodPlayerActiveProps {
  players: VisiblePlayers;
  myGoodPlayer: ClientPlayer;
}

interface MappedPlayersProps {
  players: VisiblePlayers;
}

const EnemyPlayer = ({ id, direction, position }: EnemyPlayerProps) => {
  return (
    <div
      className={styles.enemyPlayerWrapper}
      style={{ top: `${position.y * (856 / 900) + 0.6}vh`, left: `${position.x * (856 / 900) + 0.6}vh` }}>
      <div className={`${styles.triangle} ${styles[direction]} ${styles[`${id}`]}`} />
      <div className={`${styles.player} ${styles[`${id}`]}`} />
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

const MappedPlayers = ({ players }: MappedPlayersProps) => {
  return (
    <>
      {players.map((player) =>
        isNaN(Number(player.id)) && player.direction ? (
          <EnemyPlayer key={player.id} id={player.id} direction={player.direction} position={player.position} />
        ) : (
          <Player key={player.id} id={player.id} position={player.position} />
        )
      )}
    </>
  );
};

const PlayersWhenGoodPlayerActive = ({ players, myGoodPlayer }: PlayersWhenGoodPlayerActiveProps) => {
  const [pulseFrequency, setPulseFrequency] = useState<number>(2.4);
  const otherPlayers = players.filter((p) => p.id !== myGoodPlayer.id);

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
  }, [myGoodPlayer.position, otherPlayers]);

  return (
    <article className="players-layer">
      <Player id={myGoodPlayer.id} position={myGoodPlayer.position} pulseFrequency={pulseFrequency} />
      <MappedPlayers players={otherPlayers} />
    </article>
  );
};

const Players = ({ players, myPlayer }: PlayersProps) => {
  return myPlayer.isEvil ? (
    <article className="players-layer">
      <MappedPlayers players={players} />
    </article>
  ) : (
    <PlayersWhenGoodPlayerActive players={players} myGoodPlayer={myPlayer as ClientPlayer} />
  );
};

export default Players;
