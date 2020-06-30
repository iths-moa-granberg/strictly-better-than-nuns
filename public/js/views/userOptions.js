class UserOptions {
    renderChoosePath = (paths, handler) => {
        this.wrapper.innerHTML = 'choose next path'; //fillertext
        paths.forEach((path, index) => this.wrapper.innerHTML += `<button>${index}</button>`);
        const btns = this.wrapper.querySelectorAll('button');
        for (let btn of btns) {
            btn.addEventListener('click', e => handler(paths, btn.innerText));
        }
    }
}