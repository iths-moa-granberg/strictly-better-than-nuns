import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import express from 'express';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

export const io = socketIO(server, {
  pingTimeout: 3600000,
});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

import './controllers/serverStart';
import './controllers/serverPlayerActions';
import './controllers/serverEnemyActions';
import './controllers/chat';
import './controllers/serverPlayerAnimations';
