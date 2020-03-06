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
const board = new Board(positions); //annat namn?

enemy = new Player.Evil('enemy', enemyPaths[0]);
game.addPlayer(enemy);

io.on('connection', (socket) => {
    socket.player = new Player.Good(game.generatePlayerInfo());
    game.addPlayer(socket.player);

    socket.emit('init', {
        id: socket.player.id,
        home: socket.player.home,
        key: socket.player.key,
        goal: socket.player.goal,
    });

    //wait until all players has joined

    const updateBoard = () => {
        io.sockets.emit('update board', {
            players: game.getVisibilityPlayers(),
            soundTokens: game.soundTokens,
            sightTokens: game.sightTokens,
            enemyPath: enemy.path,
            reachablePositions: [],
        });
    }

    updateBoard();

    const startNextTurn = () => {
        game.startNextTurn();
        io.sockets.emit('players turn', {});
    };
    startNextTurn();

    const playerStepOptions = () => {
        socket.emit('player possible steps', {
            endups: board.getReachable(socket.player.position, socket.player.stepsLeft, socket.player.hasKey),
            visible: socket.player.visible,
        });
    }

    socket.on('player chooses pace', ({ pace }) => {
        socket.player.pace = pace;
        socket.player.stepsLeft = pace === 'stand' ? 0
            : pace === 'sneak' ? 1
                : pace === 'walk' ? 3
                    : 5;
        playerStepOptions();
    });

    socket.on('player takes step', ({ position }) => {
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

        player.visible = board.isSeen(player.position, enemy.position);
    }

    socket.on('player move completed', ({ }) => {
        socket.player.checkTarget();

        if (!socket.player.visible) {
            leaveSight(socket.player);
        } else {
            makeSound(socket.player);
        }
        socket.player.path = [];

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

    const makeSound = (player) => {
        const heardTo = board.isHeard(player.position, enemy.position, player.pace);
        if (heardTo) {
            let tokenPos;
            if (heardTo.length > 1) {
                tokenPos = heardTo[1]; //player should choose
            } else {
                tokenPos = heardTo[0];
            }
            game.addToken(tokenPos, 'sound');
        }
    }

    const startEnemyTurn = () => {
        updateBoard();
        // socket.emit('enemy turn', {}); //when enemy is playable

        enemyStep();
        enemyStep();
        enemyStep();
        game.soundTokens = [];
        game.sightTokens = [];
        //listen if walking
        startNextTurn();
    }

    const enemyStep = () => {
        enemy.moveStandardPath();
        //look around
        game.checkEnemyTarget(enemy);
        updateBoard();
    }

    // socket.on('enemy step', ({ position, pace }) => {
    //     //socket.player.updatePosition();
    //     //socket.player.checkTarget();
    //     io.sockets.emit('update board', { players, tokens }); //in players: seen, caught
    // });

    // socket.on('enemy move completed', () => {
    //     startNextTurn();
    // });
});