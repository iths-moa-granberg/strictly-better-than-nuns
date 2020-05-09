const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = exports.io = require('socket.io')(server);
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

require('./server/controllers/serverStart');
require('./server/controllers/serverPlayerActions');
require('./server/controllers/serverEnemyActions');