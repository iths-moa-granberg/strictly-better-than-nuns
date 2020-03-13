// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


const Player = require('./server/serverPlayer.js');
const positions = require('./server/serverPositions.js');
const enemyPaths = require('./server/enemyPaths.js'); //behövs bara i serverPlayer?
const game = require('./server/serverGame.js');
const Board = require('./server/serverBoard.js');
const board = new Board(positions);

enemy = new Player.Evil('enemy', enemyPaths[0]);

io.on('connection', (socket) => {
    socket.emit('join', { enemyJoined: game.players.find(player => player.isEvil) });

    socket.on('player joined', ({ good }) => {
        if (good) {
            socket.player = new Player.Good(game.generatePlayerInfo());
            game.addPlayer(socket.player);
            socket.emit('init', {
                id: socket.player.id,
                home: socket.player.home,
                key: socket.player.key,
                goal: socket.player.goal,
                isEvil: socket.player.isEvil,
            });
        } else {
            socket.player = enemy;
            game.addPlayer(enemy);
            socket.emit('init', { //fulhack
                id: socket.player.id,
                home: socket.player.position,
                key: socket.player.position,
                goal: socket.player.position,
                isEvil: socket.player.isEvil,
            });
            io.sockets.emit('disable join as evil', ({}));
        }
        updateBoard();
    });

    socket.on('start', ({ }) => {
        startNextTurn();
    });

    const updateBoard = () => {
        io.sockets.emit('update board', {
            players: game.getVisiblePlayers(),
            soundTokens: game.soundTokens,
            sightTokens: game.sightTokens,
            enemyPath: enemy.path,
            reachablePositions: [],
        });
    }

    const startNextTurn = () => {
        game.startNextTurn();
        io.sockets.emit('players turn', {});
    };

    const playerStepOptions = () => {
        socket.emit('possible steps', {
            endups: board.getReachable(socket.player.position, socket.player.stepsLeft, socket.player.hasKey),
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

    const enemyStepOptions = () => {
        let endups = [];
        if (game.soundTokens.length || game.sightTokens.length || game.playersIsVisible()) {
            endups = board.getReachable(socket.player.position, socket.player.stepsLeft, true);
        } else if (socket.player.isOnPath()) {
            endups = board.getEnemyStandardReachable(socket.player.position, socket.player.path, socket.player.stepsLeft);
            if (socket.player.path[socket.player.path.length - 1].id === socket.player.position.id && !endups.length) {
                socket.player._chooseNewPath(); //enemyplayer choose next path
                endups = board.getEnemyStandardReachable(socket.player.position, socket.player.path, socket.player.stepsLeft);
            }
        } else {
            endups = board.getClosestWayToPath(socket.player.position, socket.player.path);
        }
        socket.emit('possible steps', { endups });
    }

    socket.on('enemy selects pace', ({ pace }) => {
        socket.player.pace = pace;
        socket.player.stepsLeft = pace === 'walk' ? 3 : 5; //3-4, 5-6
        enemyStepOptions();
    });

    socket.on('player takes step', ({ position }) => {
        position = game.getServerPosition(position.id)
        socket.player.position = position;
        socket.player.stepsLeft--;
        lookAround(socket.player);
        socket.player.path.push({ position, visible: socket.player.visible });

        if (socket.player.stepsLeft <= 0) {
            socket.emit('player out of steps', {});
        } else {
            playerStepOptions();
        }
    });

    socket.on('enemy takes step', ({ position }) => {
        position = game.getServerPosition(position.id);
        socket.player.move(position); //choose next path
        game.checkEnemyTarget(socket.player);

        for (let player of game.players) {
            if (!player.isEvil) {
                lookAround(player);
                if (player.visible) {
                    player.updatePathVisibility(player.position);
                }
            }
        }

        updateBoard();

        if (socket.player.stepsLeft <= 0) {
            enemyMoveComplete();
        } else {
            enemyStepOptions();
        }
    });

    const enemyMoveComplete = () => {
        game.soundTokens = [];
        game.sightTokens = [];

        if (enemy.pace === 'walk') {
            const sound = board.getRandomSound();
            for (let player of game.players) {
                if (!player.isEvil) {
                    const playerSound = board.getSoundReach(player.pace, sound);
                    const heardTo = board.isHeard(player.position, enemy.position, playerSound);
                    if (heardTo) {
                        if (heardTo.length > 1) {
                            io.sockets.emit('player select token', ({ heardTo, id: player.id, turn: 'enemy' }));
                        } else {
                            game.addToken(heardTo[0], 'sound');
                            endEnemyTurn();
                        }
                    } else {
                        endEnemyTurn();
                    }
                }
            }
        } else {
            endEnemyTurn();
        }
    }

    const lookAround = (player) => {
        player.visible = board.isSeen(player.position, enemy.position, enemy.lastPosition);
    }

    socket.on('player move completed', ({ }) => {
        socket.player.checkTarget();

        if (!socket.player.visible) {
            leaveSight(socket.player);

            const sound = board.getSoundReach(socket.player.pace, board.getRandomSound());
            if (makeSound(socket.player, sound)) {
                return
            }
        }
        endPlayerTurn();
    });

    const endPlayerTurn = () => {
        socket.player.resetPath();

        socket.emit('update player', {
            hasKey: socket.player.hasKey,
            hasGoal: socket.player.hasGoal,
            visible: socket.player.visible,
        });
        game.playerTurnCompleted++;
        if (game.playerTurnCompleted === game.numOfGoodPlayers) {
            game.playerTurnCompleted = 0;
            startEnemyTurn();
        }
    }

    socket.on('player reset move', ({ }) => {
        socket.player.position = socket.player.path[0].position;
        socket.player.visible = socket.player.path[0].visible;
        socket.player.resetPath();
        socket.emit('players turn', { position: socket.player.position });
    });

    const leaveSight = (player) => {
        let path = player.path.reverse();
        for (let obj of path) {
            if (obj.visible && obj != path[0]) {
                game.addToken(obj.position, 'sight');
                return
            }
        }
    }

    const makeSound = (player, sound) => {
        const heardTo = board.isHeard(player.position, enemy.position, sound);
        if (heardTo) {
            if (heardTo.length > 1) {
                socket.emit('player select token', { heardTo, id: player.id, turn: 'player' });
                return true;
            } else {
                game.addToken(heardTo[0], 'sound');
            }
        }
        return false;
    }

    socket.on('player place token', ({ position, turn }) => {
        game.addToken(position, 'sound');
        if (turn === 'player') {
            endPlayerTurn();
        } else if (turn === 'enemy') {
            endEnemyTurn();
        }
    });

    const endEnemyTurn = () => {
        game.placedSoundCounter++;
        if (game.placedSoundCounter === game.numOfGoodPlayers) {
            game.placedSoundCounter = 0;
            updateBoard();
            startNextTurn();
        }
    }

    const startEnemyTurn = () => {
        updateBoard();
        io.sockets.emit('enemy turn', {});
    }
});