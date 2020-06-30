class UserOptions {
    constructor() {
        this.wrapper = document.querySelector('.user-options-wrapper');
    }

    _renderBtn = (type, className) => {
        return `
        <button class="${type.toLowerCase()} ${className}">${type}</button>
        `;
    }

    _addListeners = (handler) => {
        const btns = this.wrapper.querySelectorAll('button');
        for (let btn of btns) {
            btn.addEventListener('click', e => handler(btn.innerText.toLowerCase()));
        }
    }

    renderTokenInstr = () => {
        this.wrapper.innerHTML = 'click on soundtoken to select sound-position'; //fillertext
    }

    renderChoosePath = (paths, handler) => {
        this.wrapper.innerHTML = 'choose next path'; //fillertext
        paths.forEach((path, index) => this.wrapper.innerHTML += `<button>${index}</button>`);
        const btns = this.wrapper.querySelectorAll('button');
        for (let btn of btns) {
            btn.addEventListener('click', e => handler(paths, btn.innerText));
        }
    }

    renderSelectEnemyBtns = (handler) => {
        this.wrapper.innerHTML = 'choose which enemy to start with';
        this.wrapper.innerHTML += this._renderBtn('e1');
        this.wrapper.innerHTML += this._renderBtn('e2');
        this._addListeners(handler);
    }
}