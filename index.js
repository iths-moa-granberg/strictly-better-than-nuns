// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = exports.io = require('socket.io')(server);
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


const Player = require('./server/serverPlayer');
const Game = require('./server/serverGame');
const Board = require('./server/serverBoard');
const { logProgress } = require('./server/serverProgressLog');

let games = {};

const getOpenGames = () => {
    return Object.keys(games).map(id => {
        if (games[id].status === 'open') {
            return { id, name: games[id].name, users: games[id].users }
        }
    });
}

io.on('connection', (socket) => {
    let currentEnemy;
    let game;
    let board;

    socket.emit('start screen', { openGames: getOpenGames() });

    socket.on('init new game', ({ user }) => {
        game = new Game();
        board = new Board();

        games[game.id] = {
            game,
            board,
            name: `${user.username}'s game`,
            status: 'open',
            users: { [user.userID]: { username: user.username, role: '' } },
        }
        io.emit('update open games', ({ openGames: getOpenGames() }));
        socket.join(game.id);
        socket.emit('init', ({ enemyJoined: game.enemyJoined }));

        logProgress(`${user.username} has joined`, { room: game.id });
    });

    socket.on('join game', ({ gameID, user }) => {
        games[gameID].users[user.userID] = { username: user.username, role: '' };
        game = games[gameID].game;
        board = games[gameID].board;
        game.id = gameID;

        io.emit('update open games', ({ openGames: getOpenGames() }));
        socket.join(game.id);
        socket.emit('init', ({ enemyJoined: game.enemyJoined }));
        io.in(game.id).emit('waiting for players', ({ enemyJoined: game.enemyJoined }));

        logProgress(`${user.username} has joined`, { room: game.id });
    });

    socket.on('player joined', ({ good, user }) => {
        if (good) {
            games[game.id].users[user.userID].role = 'good';
            socket.player = new Player.Good(game.generatePlayerInfo(user.username));

            game.addPlayer(socket.player);
            socket.emit('set up player', {
                id: socket.player.id,
                home: socket.player.home,
                key: socket.player.key,
                goal: socket.player.goal,
                isEvil: socket.player.isEvil,
            });
        } else {
            games[game.id].users[user.userID].role = 'evil';
            socket.player = game.enemies;
            game.enemyJoined = true;
            socket.emit('set up enemy', {
                startPositions: [socket.player.e1.position, socket.player.e2.position]
            });
            io.in(game.id).emit('disable join as evil');
        }

        logProgress(`${user.username} is ${games[game.id].users[user.userID].role}`, { room: game.id });

        updateBoard();
        if (playersReady()) {
            io.in(game.id).emit('players ready');
        } else {
            io.in(game.id).emit('waiting for players', ({ enemyJoined: game.enemyJoined }));
        }
    });

    const playersReady = () => {
        let users = games[game.id].users;
        if (Object.values(users).length < 2) {
            return false;
        }
        if (Object.values(users).find(user => user.role === '')) {
            return false;
        }
        return Object.values(users).filter(user => user.role === 'evil').length;
    }

    socket.on('start', () => {
        logProgress(`The game has started!`, { room: game.id });

        games[game.id].status = 'closed';
        io.emit('update open games', ({ openGames: getOpenGames() }));
        startNextTurn();
    });

    const updateBoard = () => {
        io.in(game.id).emit('update board', {
            players: [game.enemies.e1, game.enemies.e2].concat(game.getVisiblePlayers()),
            soundTokens: game.soundTokens,
            sightTokens: game.sightTokens,
            enemyPaths: [game.enemies.e1.path, game.enemies.e2.path],
            reachablePositions: [],
        });
    }

    const startNextTurn = () => {
        game.startNextTurn();

        logProgress(`Players turn`, { room: game.id });

        io.in(game.id).emit('players turn', { caughtPlayers: game.caughtPlayers });
    };

    const playerStepOptions = () => {
        let possibleSteps = [];
        if (game.isCaught(socket.player)) {
            possibleSteps = board.getClosestWayHome(socket.player.position, socket.player.home, socket.player.hasKey);
        } else {
            possibleSteps = board.getReachable(socket.player.position, socket.player.stepsLeft, socket.player.hasKey);
        }
        socket.emit('possible steps', {
            possibleSteps,
            visible: socket.player.visible,
        });
    }

    socket.on('player selects pace', ({ pace }) => {
        socket.player.pace = pace;
        socket.player.stepsLeft = pace === 'stand' ? 0
            : pace === 'sneak' ? 1
                : pace === 'walk' ? 3
                    : 5;
        playerStepOptions();
    });

    socket.on('select enemy', ({ enemyID }) => {
        currentEnemy = game.enemies[enemyID];
    });

    const enemyStepOptions = () => {
        let possibleSteps = [];
        if (game.seenSomeone(currentEnemy.id) || game.heardSomeone(currentEnemy.id) || currentEnemy.playersVisible) {
            possibleSteps = board.getReachable(currentEnemy.position, currentEnemy.stepsLeft, true);
        } else if (currentEnemy.isOnPath()) {
            possibleSteps = board.getEnemyStandardReachable(currentEnemy.position, currentEnemy.path, currentEnemy.stepsLeft);
        } else {
            possibleSteps = board.getClosestWayToPath(currentEnemy.position, currentEnemy.path);
        }
        socket.emit('possible steps', { possibleSteps, stepsLeft: currentEnemy.stepsLeft });
    }

    socket.on('enemy selects pace', ({ pace }) => {
        currentEnemy.pace = pace;
        currentEnemy.stepsLeft = pace === 'walk' ? 4 : 6;
        enemyStepOptions();

        logProgress(`${currentEnemy.id} is ${pace}ing`, { room: game.id });
    });

    socket.on('player takes step', ({ position }) => {
        position = game.getServerPosition(position.id)
        socket.player.position = position;
        socket.player.stepsLeft--;

        const seenBy = isSeen(socket.player, game.enemies.e1).concat(isSeen(socket.player, game.enemies.e2));
        socket.player.visible = Boolean(seenBy.length);
        if (seenBy.length) {
            logProgress(`You are seen! Click back if you want to take a different route`, { socket });
        }

        if (game.isCaught(socket.player) && !socket.player.visible) {
            game.removeCaughtPlayer(socket.player);
            logProgress(`You are out of sight and can move freely again`, { socket });
        }
        socket.player.path.push({ position, visible: socket.player.visible, enemyID: seenBy });

        playerStepOptions();
    });

    const chooseNewPath = (paths) => {
        socket.emit('choose new path', ({ paths }));
    }

    socket.on('select path', ({ path }) => {
        currentEnemy.path = path;
        logProgress(`${currentEnemy.id} has selected a new path`, { room: game.id });

        actOnEnemyStep();
    });

    socket.on('enemy takes step', ({ position }) => {
        position = game.getServerPosition(position.id);
        currentEnemy.move(position);
        game.checkEnemyTarget(currentEnemy);

        for (let player of game.players) {
            const seenBy = isSeen(player, currentEnemy);
            if (seenBy.length) {
                player.visible = true;
                player.updatePathVisibility(player.position, seenBy);

                logProgress(`${player.username} is seen by ${currentEnemy.id}`, { room: game.id });
            }
        }
        if (currentEnemy.endOfPath()) {
            updateBoard();
            chooseNewPath(currentEnemy.getNewPossiblePaths());
        } else {
            actOnEnemyStep();
        }
    });

    const actOnEnemyStep = () => {
        updateBoard();
        enemyStepOptions();
    }

    socket.on('enemy move completed', () => {
        game.enemyMovesCompleted++;
        if (game.enemyMovesCompleted === 2) {
            game.enemyMovesCompleted = 0;
            enemyMoveComplete();
        } else {
            socket.emit('next enemy turn');
        }
    });

    const enemyMoveComplete = () => {
        game.soundTokens = [];
        game.sightTokens = [];
        game.enemies.e1.playersVisible = false;
        game.enemies.e2.playersVisible = false;

        enemyListen(game.enemies.e1);
    }

    const enemyListen = enemy => {
        if (enemy.pace === 'run') {
            waitForTokenPlacement(true);
            return;
        }

        const sound = board.getRandomSound();
        for (let player of game.players) {
            if (!game.isCaught(player) || player.visible) {
                const playerSound = board.getSoundReach(player.pace, sound);
                const heardTo = board.isHeard(player.position, enemy.position, playerSound);
                if (heardTo) {
                    if (heardTo.length > 1) {
                        io.in(game.id).emit('player select token', ({ heardTo, id: player.id, turn: 'enemy', enemyID: enemy.id }));
                    } else {
                        game.addToken(heardTo[0].id, 'sound', enemy.id);
                        waitForTokenPlacement();
                    }
                } else {
                    waitForTokenPlacement();
                }
            } else {
                waitForTokenPlacement();
            }
        }
    }

    const waitForTokenPlacement = (run) => {
        game.placedSoundCounter++;
        if (game.placedSoundCounter === game.players.length || run) {
            game.placedSoundCounter = 0;
            endEnemyTurn();
        }
    }

    const isSeen = (player, enemy) => {
        let seenBy = [];
        if (board.isSeen(player.position, enemy.position, enemy.lastPosition)) {
            seenBy.push(enemy.id);
            enemy.playersVisible = true;
        }
        return seenBy;
    }

    socket.on('player move completed', () => {
        socket.player.checkTarget(socket, game.id);

        if (socket.player.visible) {
            endPlayerTurn();
        } else {
            socket.player.caught = false;
            leaveSight(socket.player);

            const sound = board.getSoundReach(socket.player.pace, board.getRandomSound());
            playerMakeSound(socket.player, sound);
        }
    });

    const endPlayerTurn = () => {
        socket.player.resetPath(socket.player.path[0].enemyID);

        socket.emit('update player', {
            hasKey: socket.player.hasKey,
            hasGoal: socket.player.hasGoal,
            visible: socket.player.visible,
        });
        game.playerTurnCompleted++;
        if (game.playerTurnCompleted === game.players.length) {
            game.playerTurnCompleted = 0;
            startEnemyTurn();
        }
    }

    socket.on('player reset move', () => {
        socket.player.position = socket.player.path[0].position;
        socket.player.visible = socket.player.path[0].visible;
        socket.player.resetPath(socket.player.path[0].enemyID);
        if (socket.player.caught) {
            game.addCaughtPlayer(socket.player);
        }
        socket.emit('players turn', { resetPosition: socket.player.position, caughtPlayers: game.caughtPlayers });
    });

    const leaveSight = (player) => {
        let path = player.path.reverse();
        for (let obj of path) {
            if (obj.visible && obj != path[0]) {
                game.addToken(obj.position.id, 'sight', obj.enemyID);
                logProgress(`${player.username} has disappeared`, { room: game.id });
                return
            }
        }
    }

    const playerMakeSound = (player, sound) => {
        if (game.enemyListened === 0) {
            game.enemyListened++;
            makeSound(player, sound, game.enemies.e1);
        } else if (game.enemyListened === 1) {
            game.enemyListened++;
            makeSound(player, sound, game.enemies.e2);
        } else {
            game.enemyListened = 0;
            endPlayerTurn();
        }
    }

    const makeSound = (player, sound, enemy) => {
        const heardTo = board.isHeard(player.position, enemy.position, sound);
        if (heardTo) {
            if (heardTo.length > 1) {
                socket.emit('player select token', { heardTo, id: player.id, turn: 'player', enemyID: enemy.id, sound });
                return
            } else {
                game.addToken(heardTo[0].id, 'sound', enemy.id);
            }
        }
        playerMakeSound(player, sound);
    }

    socket.on('player placed token', ({ position, turn, enemyID, sound }) => {
        game.addToken(position.id, 'sound', enemyID);
        if (turn === 'player') {
            playerMakeSound(socket.player, sound);
        } else if (turn === 'enemy') {
            waitForTokenPlacement();
        }
    });

    const endEnemyTurn = () => {
        game.enemyListened++;
        if (game.enemyListened == 1) {
            enemyListen(game.enemies.e2);
        } else if (game.enemyListened == 2) {
            game.enemyListened = 0;
            updateBoard();
            startNextTurn();
        }
    }

    const startEnemyTurn = () => {
        updateBoard();
        io.in(game.id).emit('enemy turn');

        logProgress(`Enemy turn`, { room: game.id });
    }
});