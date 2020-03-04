class Board {
    constructor(positions) {
        this.positions = positions;
    }

    getAllReachables = (position) => {
        let possible = {};
        possible.stand = [position];
        possible.sneak = this.getReachable(position, 1); //1-2
        possible.walk = this.getReachable(position, 3); //3-4
        possible.run = this.getReachable(position, 5); //1-5
        return possible;
    }

    getReachable = (startPosition, totalSteps) => {
        let possiblePos = [startPosition];
        for (let steps = 0; steps < totalSteps; steps++) {
            for (let pos of possiblePos) {
                possiblePos = possiblePos.concat(this._getNeighbours(pos)
                    .filter(neighbour => !possiblePos.includes(neighbour)));
            }
        }
        return possiblePos;
    }

    _getNeighbours = (position) => {
        let neighbours = [];
        for (let neighbour of position.neighbours) {
            neighbours.push(this.positions[neighbour]);
        }
        return neighbours;
    }

    getClosestPaths = (start, end) => {
        let queue = this._getQueue(start, end);
        let paths = [[end]];

        for (let path of paths) {
            for (let pos of path) {
                if (pos === path[path.length - 1]) {
                    let i = this._getPlaceInQueue(pos, queue) - 1;
                    let neighbours = this._getNeighbours(pos).filter(neighbour => queue[i].includes(neighbour));
                    if (neighbours.length === 1) {
                        path.push(neighbours[0]);
                    } else if (neighbours.length === 2) {
                        let newPath = path.slice();
                        newPath.push(neighbours[0]);
                        paths.push(newPath);
                        path.push(neighbours[1]);
                    } else if (neighbours.length > 2) {
                        console.log('error: fanns fler än två möjliga håll att gå från en position');
                    }
                    if (path.includes(start)) {
                        break
                    }
                }
            }
            path = path.reverse();
        }
        return paths;
    }

    _getQueue = (start, end) => {
        let tested = [start];
        let queue = [[start]];

        for (let stepArr of queue) {
            let nextStep = [];
            for (let pos of stepArr) {
                let neighbours = this._getNeighbours(pos);
                neighbours = neighbours.filter(neighbour => !tested.includes(neighbour));
                tested = tested.concat(neighbours);
                nextStep = nextStep.concat(neighbours);
            }
            queue.push(nextStep);
            if (nextStep.includes(end)) {
                break
            }
        }
        return queue;
    }

    _getPlaceInQueue = (position, queue) => {
        let i = 0;
        for (let place of queue) {
            if (place.includes(position)) {
                return i;
            }
            i++;
        }
    }
}

module.exports = Board;