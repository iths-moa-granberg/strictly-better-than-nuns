import React from 'react';
import { MyPlayer } from '../../../clientTypes';
import { ClientPlayer } from '../../../modules/player';
import { VisiblePlayers, Position } from '../../../shared/sharedTypes';
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

const Player = ({ id, position }: PlayerProps) => {
  return (
    <div
      className={`${styles.player} ${styles[`${id}`]}`}
      style={{ top: `${position.y * (856 / 900) - 0.6}vh`, left: `${position.x * (856 / 900) - 0.6}vh` }}
    />
  );
};

const Players = ({ players, myPlayer }: PlayersProps) => {
  if (!myPlayer.isEvil) {
    const myGoodPlayer = myPlayer as ClientPlayer;
    const otherPlayers = players.filter((p) => p.id !== myGoodPlayer.id);

    return (
      <article className="players-layer">
        <Player id={myGoodPlayer.id} position={myGoodPlayer.position} />
        {otherPlayers.map((player) =>
          isNaN(Number(player.id)) && player.direction ? (
            <EnemyPlayer key={player.id} id={player.id} direction={player.direction} position={player.position} />
          ) : (
            <Player key={player.id} id={player.id} position={player.position} />
          )
        )}
      </article>
    );
  }

  return (
    <article className="players-layer">
      {players.map((player) =>
        isNaN(Number(player.id)) && player.direction ? (
          <EnemyPlayer key={player.id} id={player.id} direction={player.direction} position={player.position} />
        ) : (
          <Player key={player.id} id={player.id} position={player.position} />
        )
      )}
    </article>
  );
};

export default Players;
