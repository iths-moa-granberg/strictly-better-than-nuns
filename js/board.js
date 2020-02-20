class BoardModel {
    constructor() { }

    getAllReachable(startPosition, totalSteps) {
        let possiblePos = [startPosition];
        for (let steps = 0; steps < totalSteps; steps++) {
            for (let pos of possiblePos) {
                possiblePos = possiblePos.concat(this._getNeighbours(pos)
                    .filter(neighbour => !possiblePos.includes(neighbour)));
            }
        }
        return possiblePos;
    }

    _getNeighbours(position) {
        let neighbours = [];
        for (let neighbour of position.neighbours) {
            neighbours.push(positions[neighbour]);
        }
        return neighbours;
    }

    getPosition(x, y) {
        for (let position of Object.values(positions)) {
            if (position.x === x && position.y === y) {
                return position;
            }
        }
    }
}

class BoardView {
    constructor() {
        this._initRenderPositions();
        this.positionElements = document.querySelectorAll('.position');
    }

    _initRenderPositions() {
        for (let position of Object.values(positions)) {
            const positionElement = document.createElement('div');
            positionElement.className = 'position';
            positionElement.style.top = `${position.y}px`;
            positionElement.style.left = `${position.x}px`;
            positionElement.innerText = position.id;
            document.querySelector('.wrapper').appendChild(positionElement);
        }
    }

    bindSelectPosition(handler) {
        for (let position of Object.values(positions)) {
            this.positionElements[position.id - 1].addEventListener('click', e => {
                handler(position);
            });
        }
    }

    showReachablePositions(positionList) {
        for (let position of positionList) {
            this.positionElements[position.id - 1].classList.add('reachable');
        }
    }

    resetPositions() {
        for (let element of this.positionElements) {
            element.classList.remove('reachable');
        }
    }
}


class BoardController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindSelectPosition(this.handleSelectPosition);
    }

    handleSelectPosition = (position) => {
        game.positionSelected(position);
    }

    handleGetPosition = (x, y) => {
        return this.model.getPosition(x, y);
    }

    handleShowReachablePositions = (startPosition, steps) => {
        this.view.showReachablePositions(this.handleGetAllReachables(startPosition, steps));
    }

    handleGetAllReachables = (startPosition, steps) => {
        return this.model.getAllReachable(startPosition, steps);
    }

    handleResetPositions = () => {
        this.view.resetPositions();
    }
}