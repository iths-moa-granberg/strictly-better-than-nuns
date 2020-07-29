import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import { ClientPlayer, ClientEnemy } from '../../modules/player';
import { createUser, getUsernames } from './startscreenUtils';
import { ClientUser, MyPlayer } from '../../clientTypes';
import {
  OnStartScreen,
  OnUpdateOpenGames,
  OnInit,
  OnSetUpPlayer,
  OnSetUpEnemy,
  OnJoinGame,
  OnPlayerJoined,
  OnInitNewGame,
  OpenGame,
} from '../../shared/sharedTypes';

interface StartscreenProps {
  setMyPlayer: Function;
  myPlayer: MyPlayer | null;
  setCurrentPlayerId: Function;
}

const Startscreen = ({ setMyPlayer, myPlayer, setCurrentPlayerId }: StartscreenProps) => {
  const [openGames, setOpenGames] = useState<OpenGame[]>([]);
  const [enemyJoined, setEnemyJoined] = useState<boolean>(false);
  const [joinedGame, setJoinedGame] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [user, setUser] = useState<ClientUser | null>(null);

  useEffect(() => {
    const onStartScreen = ({ openGames }: OnStartScreen) => {
      setOpenGames(openGames);
    };

    const onUpdateOpenGames = ({ openGames }: OnUpdateOpenGames) => {
      setOpenGames(openGames);
    };

    const onDisableJoinAsEvil = () => {
      setEnemyJoined(true);
    };

    const onInit = ({ enemyJoined }: OnInit) => {
      setEnemyJoined(enemyJoined);
    };

    const onWaitingForPlayers = () => {
      setReady(false);
    };

    const onPlayersReady = () => {
      setReady(true);
    };

    socket.on('start screen', onStartScreen);
    socket.on('update open games', onUpdateOpenGames);
    socket.on('disable join as evil', onDisableJoinAsEvil);
    socket.on('init', onInit);
    socket.on('waiting for players', onWaitingForPlayers);
    socket.on('players ready', onPlayersReady);

    return () => {
      socket.off('start screen', onStartScreen);
      socket.off('update open games', onUpdateOpenGames);
      socket.off('disable join as evil', onDisableJoinAsEvil);
      socket.off('init', onInit);
      socket.off('waiting for players', onWaitingForPlayers);
      socket.off('players ready', onPlayersReady);
    };
  }, []);

  useEffect(() => {
    const onSetUpPlayer = ({ id, home, key, goal, isEvil }: OnSetUpPlayer) => {
      const player = new ClientPlayer(id, home, key, goal, isEvil);
      setMyPlayer(player);
    };

    const onSetUpEnemy = ({ startPositions }: OnSetUpEnemy) => {
      const enemy = {
        e1: new ClientEnemy('e1', startPositions[0]),
        e2: new ClientEnemy('e2', startPositions[1]),
        isEvil: true,
      };
      setMyPlayer(enemy);
      setCurrentPlayerId('e1');
    };

    socket.on('set up player', onSetUpPlayer);
    socket.on('set up enemy', onSetUpEnemy);

    return () => {
      socket.off('set up player', onSetUpPlayer);
      socket.off('set up enemy', onSetUpEnemy);
    };
  }, [setCurrentPlayerId, setMyPlayer]);

  const Game = ({ game }: { game: OpenGame }) => {
    return (
      <div>
        <h3>{game.name}</h3>
        <p>Joined players: {getUsernames(game.users)}</p>
        <button
          onClick={() => {
            setJoinedGame(true);
            if (user) {
              const params: OnJoinGame = { gameID: game.id, user };
              socket.emit('join game', params);
            }
          }}>
          Join
        </button>
      </div>
    );
  };

  const InputUsername = () => {
    const handleUsernameInput = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setUser(createUser((e.target as HTMLInputElement).value));
      }
    };

    return <input type="text" placeholder="username" onKeyDown={(e) => handleUsernameInput(e)} />;
  };

  const StartButton = () => {
    return (
      <button
        onClick={() => {
          socket.emit('start');
        }}>
        Start
      </button>
    );
  };

  const GoodOrEvilButtons = () => {
    const join = (good: boolean) => {
      if (user) {
        const params: OnPlayerJoined = { good, user };
        socket.emit('player joined', params);
      }
    };

    return (
      <div>
        <button disabled={enemyJoined} onClick={() => join(false)}>
          Evil
        </button>
        <button onClick={() => join(true)}>Good</button>
      </div>
    );
  };

  const GameList = () => {
    const handleNewGame = () => {
      if (user) {
        setJoinedGame(true);
        const params: OnInitNewGame = { user };
        socket.emit('init new game', params);
      }
    };

    return (
      <>
        {openGames.map((game) => (
          <Game key={game.id} game={game} />
        ))}
        <button onClick={handleNewGame}>New game</button>
      </>
    );
  };

  const Content = () => {
    if (!user) return <InputUsername />;
    if (ready) return <StartButton />;
    if (myPlayer) return <p>wait for other players</p>;
    if (joinedGame) return <GoodOrEvilButtons />;
    return <GameList />;
  };

  return (
    <div className="start-wrapper">
      <Content />
    </div>
  );
};

export default Startscreen;
