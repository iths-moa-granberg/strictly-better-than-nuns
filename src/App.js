import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Startscreen from './components/Startscreen';
import Board from './components/Board';

const socket = io('http://localhost:3002');

const App = () => {
  const [gameState, setGameState] = useState('startscreen');
  const [myPlayer, setMyPlayer] = useState(null);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);

  useEffect(() => {
    const onGameStarted = () => {
      setGameState('started');
    };

    const onUpdatePlayer = ({ hasKey, hasGoal, visible }) => {
      setMyPlayer({ ...myPlayer, hasKey, hasGoal, visible });
    };

    socket.on('game started', onGameStarted);
    socket.on('update player', onUpdatePlayer);

    return () => {
      socket.off('game started', onGameStarted);
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
          <Board myPlayer={myPlayer} setMyPlayer={setMyPlayer} currentPlayerId={currentPlayerId} />
        </>
      )}
    </div>
  );
};

export { App, socket };
