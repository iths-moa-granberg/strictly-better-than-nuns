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
    socket.on('game started', () => {
      setGameState('started');
    });

  }, []);

  return (
    <div>
      {gameState === 'startscreen' && (
        <Startscreen
          myPlayer={myPlayer}
          setMyPlayer={setMyPlayer}
          setCurrentPlayerId={setCurrentPlayerId}
        />
      )}
      {gameState === 'started' && (
        <>
          <Board myPlayer={myPlayer} />
        </>
      )}
    </div>
  );
};

export { App, socket };
