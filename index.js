const { Socket } = require("dgram");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = {};
var Port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  const socketId = socket.id;
  socket.on("new user", (nickname) => {
    users[socketId] = { UserName: nickname, SocketId: socketId };
    io.emit("new user", "Welcome " + nickname);
    console.log("New user: " + nickname + " logged in");
    console.log(users);
  });
  socket.on("disconnect", (socket) => {
    io.emit("disconnected", "user disconnected");
    console.log(socketId, "user disconnected");
    delete users[socketId];
    console.log(users);
  });
});
// console print msg
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg + " by " + socket.id);
  });
});

//  emit msg to client
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", users[socket.id].UserName + ":" + msg);
  });
});
server.listen(Port, () => {
  console.log("listening on *:3000 or env.port");
});
