import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Startscreen from './components/Startscreen';
import Board from './components/Board';

const socket = io('http://localhost:3002');

const App = () => {
  const [gameState, setGameState] = useState('startscreen');
  const [myPlayer, setMyPlayer] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  return (
    <div>
      {gameState === 'startscreen' && (
        <Startscreen
          myPlayer={myPlayer}
          setMyPlayer={setMyPlayer}
          setCurrentPlayerId={setCurrentPlayerId}
          setGameState={setGameState}
        />
      )}
      {gameState === 'started' && <Board currentPlayerId={currentPlayerId} myPlayer={myPlayer} />}
    </div>
  );
};

export { App, socket };
