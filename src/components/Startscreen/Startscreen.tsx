import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import { ClientPlayer, ClientEnemy } from '../../modules/player';
import { createUser, getUsernames } from './startscreenUtils';
import { OpenGame, ClientUser, MyPlayer } from '../../clientTypes';
import { Position } from '../../shared/sharedTypes';

interface StartscreenProps {
  setMyPlayer: Function;
  myPlayer: MyPlayer;
  setCurrentPlayerId: Function;
}

const Startscreen = ({ setMyPlayer, myPlayer, setCurrentPlayerId }: StartscreenProps) => {
  const [openGames, setOpenGames] = useState<OpenGame[]>([]);
  const [enemyJoined, setEnemyJoined] = useState(false);
  const [joinedGame, setJoinedGame] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<ClientUser | null>(null);

  useEffect(() => {
    const onStartScreen = ({ openGames }: { openGames: OpenGame[] }) => {
      setOpenGames(openGames);
    };

    const onUpdateOpenGames = ({ openGames }: { openGames: OpenGame[] }) => {
      setOpenGames(openGames);
    };

    const onDisableJoinAsEvil = () => {
      setEnemyJoined(true);
    };

    const onInit = ({ enemyJoined }: { enemyJoined: boolean }) => {
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
    const onSetUpPlayer = ({
      id,
      home,
      key,
      goal,
      isEvil,
    }: {
      id: string;
      home: Position;
      key: Position;
      goal: Position;
      isEvil: boolean;
    }) => {
      const player = new ClientPlayer(id, home, key, goal, isEvil);
      setMyPlayer(player);
    };

    const onSetUpEnemy = ({ startPositions }: { startPositions: Position[] }) => {
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
            socket.emit('join game', { gameID: game.id, user });
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
      socket.emit('player joined', { good, user });
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
      setJoinedGame(true);
      socket.emit('init new game', { user });
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
