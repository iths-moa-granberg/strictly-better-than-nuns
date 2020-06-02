
socket.on('progress', ({ msg }) => {
    document.querySelector('.progress-log-wrapper').innerHTML += `<p>${msg}</p>`;
});