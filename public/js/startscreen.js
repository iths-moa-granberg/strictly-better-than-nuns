class StartScreen {
    constructor() {
        document.body.innerHTML = this._createWrapper();
        this.wrapper = document.querySelector('.main-wrapper');
    }

    _createWrapper = () => {
        return `
        <div class="main-wrapper"></div>
        `;
    }

    renderInputUsername = (handler) => {
        const input = document.createElement('input');
        input.placeholder = 'username';
        this.wrapper.appendChild(input);
        input.addEventListener('change', () => handler(input.value));
    }

    renderShowGames = (openGames, joinHandler, newHandler) => {
        this.wrapper.innerHTML = '';

        openGames.forEach(game => {
            if (game) {
                const div = document.createElement('div');
                const title = document.createElement('h3');
                title.innerText = game.name;
                const users = document.createElement('p');
                users.innerText = 'Joined players: ' + this.getUsernames(game.users);
                const joinBtn = document.createElement('button');
                joinBtn.innerText = 'Join';
                this.wrapper.appendChild(div);
                div.appendChild(title);
                div.appendChild(users);
                div.appendChild(joinBtn);
                joinBtn.addEventListener('click', () => joinHandler(game.id));
            }
        });

        const newBtn = document.createElement('button');
        newBtn.innerText = 'New game';
        this.wrapper.appendChild(newBtn);
        newBtn.addEventListener('click', () => newHandler());
    }

    getUsernames = users => {
        return Object.values(users).map(user => user.username).join(', ');
    }

    renderGameSetup = () => {
        this.wrapper.innerHTML = `
        <div class="board-wrapper"></div>
        <div class="user-options-wrapper"></div>
        `;
    }
}