import React, { useState, useEffect } from 'react';
import './App.scss';
import io from 'socket.io-client';
import Startscreen from './components/Startscreen/Startscreen';
import Board from './components/Board/Board';
import ProgressLogger from './components/ProgressLogger/ProgressLogger';
import ProgressBars from './components/ProgressBars/ProgressBars';
import GameOverScreen from './components/GameOverScreen/GameOverScreen';
import { MyPlayer } from './clientTypes';
import { ClientPlayer } from './modules/player';
import { ClientUser, OnGameOver, OnUpdatePlayer } from './shared/sharedTypes';

const socket = io('http://localhost:3002');

const App = () => {
  const [gameState, setGameState] = useState<string>('startscreen');
  const [myPlayer, setMyPlayer] = useState<MyPlayer | null>(null);
  const [currentPlayerID, setCurrentPlayerId] = useState<'e1' | 'e2' | null>(null);
  const [winner, setWinner] = useState<ClientUser>({ username: '', userID: '' });

  useEffect(() => {
    const onGameStarted = () => {
      setGameState('started');
    };

    const onGameOver = ({ winner }: OnGameOver) => {
      setGameState('game over');
      setWinner(winner);
    };

    socket.on('game started', onGameStarted);
    socket.on('game over', onGameOver);

    return () => {
      socket.off('game started', onGameStarted);
      socket.off('game over', onGameOver);
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
    <div className={'main-wrapper'}>
      {gameState === 'game over' && <GameOverScreen winner={winner} />}
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
          <ProgressBars/>
          <ProgressLogger />
        </>
      )}
    </div>
  );
};

export { App, socket };
