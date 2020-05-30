import path from "path";
import http from "http";
import socketIO from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

export const io = socketIO(server);

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

app.use(express.static(path.join(__dirname, "public")));

import "./server/controllers/serverStart";
import "./server/controllers/serverPlayerActions";
import "./server/controllers/serverEnemyActions";
