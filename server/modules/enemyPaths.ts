const positions: Position[] = require('./serverPositions.js');

const enemyPaths: Position[][] =[
    [positions[8], positions[7], positions[11], positions[10], positions[14], positions[15], positions[16], positions[12], positions[8]],

    [positions[8], positions[4], positions[3], positions[2], positions[6], positions[5], positions[9], positions[13]],

    [positions[13], positions[9], positions[5], positions[6]],

    [positions[6], positions[7], positions[8]],

    [positions[13], positions[14], positions[15], positions[16], positions[12], positions[8]],

    [positions[6], positions[2], positions[1], positions[5], positions[9], positions[13]],
];

module.exports = enemyPaths;