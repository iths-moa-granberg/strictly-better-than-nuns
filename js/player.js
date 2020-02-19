class PlayerModel {
    constructor() {
        this.x = 5; //startvärden
        this.y = 5;
    }

    updateCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
}

class PlayerView {
    constructor() {
        this._playerDiv = document.createElement('div');
        this._playerDiv.className = 'player';
        document.querySelector('.wrapper').appendChild(this._playerDiv);
    }

    updatePlayerPosition(x, y) {
        this._playerDiv.style.top = `${y}px`;
        this._playerDiv.style.left = `${x}px`;     
    }
}

class PlayerController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.updatePlayerPosition(this.getX(), this.getY());
    }
    
    movePlayer = (x, y) => {
        this.model.updateCoordinates(x,y);
        this.view.updatePlayerPosition(x,y);
    }

    getX = () => {
        return this.model.x;
    }
    
    getY = () => {
        return this.model.y;
    }
}