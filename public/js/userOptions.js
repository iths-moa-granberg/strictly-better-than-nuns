class UserOptions {
    constructor() {
        this.wrapper = document.querySelector('.user-options-wrapper');
    }

    renderPaceBtns = (handler, types, selected, className) => {
        this.wrapper.innerHTML = '';
        for (let type of types) {
            if (selected && type.toLowerCase() != selected) {
                this.wrapper.innerHTML += this._renderBtn(type, className);
            } else {
                this.wrapper.innerHTML += this._renderBtn(type, '');
            }
        }
        this._addListeners(handler);
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

    disableBtns = (className) => {
        let btns;
        if (className) {
            btns = this.wrapper.querySelectorAll(className);
        } else {
            btns = this.wrapper.querySelectorAll('button');
        }
        btns.forEach(btn => btn.disabled = true);
    }

    enableBtns = () => {
        const btns = this.wrapper.querySelectorAll('button');
        btns.forEach(btn => btn.disabled = false);
    }

    renderConfirmDestinationBtn = (handlerConfirm, handlerBack, paramBack) => {
        this.wrapper.innerHTML = this._renderBtn('Confirm');
        this.wrapper.innerHTML += this._renderBtn('Back');
        const confirmBtn = document.querySelector('button');
        const backBtn = document.querySelectorAll('button')[1];
        confirmBtn.addEventListener('click', e => handlerConfirm());
        backBtn.addEventListener('click', e => handlerBack(paramBack));
    }

    renderTokenInstr = () => {
        this.wrapper.innerHTML = 'click on soundtoken to select sound-position'; //fillertext
    }

    clear = () => {
        this.wrapper.innerHTML = '';
    }

    removeBtn = (className) => {
        const btn = this.wrapper.querySelector(className);
        this.wrapper.removeChild(btn);
    }

    renderChoosePlayer = (handler) => {
        this.wrapper.innerHTML = this._renderBtn('Good');
        this.wrapper.innerHTML += this._renderBtn('Evil');
        const goodBtn = document.querySelector('button');
        const evilBtn = document.querySelectorAll('button')[1];
        goodBtn.addEventListener('click', e => handler(true));
        evilBtn.addEventListener('click', e => handler(false));
    }

    renderStartGame = (handler) => {
        this.wrapper.innerHTML = this._renderBtn('Start');
        const start = document.querySelector('button');
        start.addEventListener('click', e => handler());
    }

    renderCaughtInstr = () => {
        console.log('render instr called');
        this.wrapper.innerHTML = 'you are caught, walk straight to home until no longer in view'; //fillertext
    }

    renderChoosePath = (paths, handler) => {
        this.wrapper.innerHTML = 'choose next path'; //fillertext
        paths.forEach((path, index) => this.wrapper.innerHTML += `<button>${index}</button>`);
        const btns = this.wrapper.querySelectorAll('button');
        for (let btn of btns) {
            btn.addEventListener('click', e => handler(paths, btn.innerText));
        }
    }
}