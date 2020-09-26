import React, { useState, useEffect } from 'react';
import './App.scss';
import io from 'socket.io-client';
import Startscreen from './components/Startscreen/Startscreen';
import Board from './components/Board/Board';
import ProgressLogger from './components/ProgressLogger/ProgressLogger';
import { MyPlayer } from './clientTypes';
import { ClientPlayer } from './modules/player';
import { OnUpdatePlayer } from './shared/sharedTypes';

const socket = io('http://localhost:3002');

const App = () => {
  const [gameState, setGameState] = useState<string>('startscreen');
  const [myPlayer, setMyPlayer] = useState<MyPlayer | null>(null);
  const [currentPlayerID, setCurrentPlayerId] = useState<'e1' | 'e2' | null>(null);

  useEffect(() => {
    const onGameStarted = () => {
      setGameState('started');
    };

    socket.on('game started', onGameStarted);

    return () => {
      socket.off('game started', onGameStarted);
    };
  }, []);

  useEffect(() => {
    const onUpdatePlayer = ({ id, hasKey, hasGoal, visible }: OnUpdatePlayer) => {
      if (!myPlayer!.isEvil) {
        if ((myPlayer as ClientPlayer).id === id) {
          setMyPlayer({ ...(myPlayer as ClientPlayer), hasKey, hasGoal, visible });
        }
      }
    };

    socket.on('update player', onUpdatePlayer);

    return () => {
      socket.off('update player', onUpdatePlayer);
    };
  }, [myPlayer, setMyPlayer]);

  return (
    <div>
      {gameState === 'startscreen' && (
        <Startscreen myPlayer={myPlayer} setMyPlayer={setMyPlayer} setCurrentPlayerId={setCurrentPlayerId} />
      )}
      {gameState === 'started' && (
        <>
          <Board
            myPlayer={myPlayer!}
            setMyPlayer={setMyPlayer}
            currentPlayerID={currentPlayerID}
            setCurrentPlayerId={setCurrentPlayerId}
          />
          <ProgressLogger />
        </>
      )}
    </div>
  );
};

export { App, socket };
