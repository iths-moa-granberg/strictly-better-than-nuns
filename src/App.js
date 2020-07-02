import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import Startscreen from './components/Startscreen/Startscreen';
import Board from './components/Board/Board';
import ProgressLogger from './components/ProgressLogger/ProgressLogger';

const socket = io('http://localhost:3002');

const App = () => {
  const [gameState, setGameState] = useState('startscreen');
  const [myPlayer, setMyPlayer] = useState(null);
  const [currentPlayerID, setCurrentPlayerId] = useState(null);

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
    const onUpdatePlayer = ({ hasKey, hasGoal, visible }) => {
      setMyPlayer({ ...myPlayer, hasKey, hasGoal, visible });
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
            myPlayer={myPlayer}
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
