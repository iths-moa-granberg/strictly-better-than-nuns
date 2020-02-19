class BoardModel {
    constructor() {
        this.playerCurrentPos = positions[1]; //startvärde
    }

    updatePlayerCurrentPos(position) {
        this.playerCurrentPos = position;
    }

    isNeighbour(position) {
        if (this.playerCurrentPos.neighbours.includes(position.id)) {
            return true;
        }
        return false;
    }
}

class BoardView {
    constructor() {
        this.renderPositions();
    }

    renderPositions() {
        for (let position of Object.values(positions)) {
            const positionDiv = document.createElement('div');
            positionDiv.className = 'position';
            positionDiv.style.top = `${position.y}px`;
            positionDiv.style.left = `${position.x}px`;
            positionDiv.innerText = position.id;
            document.querySelector('.wrapper').appendChild(positionDiv);
        }
    }

    bindMovePlayer(handler) {
        const divs = document.querySelectorAll('.position');            
        for (let position of Object.values(positions)) {
            divs[position.id - 1].addEventListener('click', e => {
                handler(position);
            });
        }
    }
}


class BoardController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindMovePlayer(this.handleMovePlayer);
    }

    handleMovePlayer = (position) => {
        if (this.model.isNeighbour(position)) {
            this.model.updatePlayerCurrentPos(position);
            player.movePlayer(position.x, position.y);
        }
    }
}