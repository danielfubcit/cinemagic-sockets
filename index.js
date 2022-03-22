const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Access-Control-Alloe-Origin"],
    credential: true
  }
});

//we set the port to 8888
const PORT = process.env.PORT || 8888;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const allusers = {};

//when a user connected, do these
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  // io.emit("change", socket.id);

  // detect different user connect
  allusers[socket.id] = {left:0, top:0}
  io.emit("user_connected", allusers);

  // alert button
  socket.on("alert_all", (txt)=>{
    io.emit("change", socket.id, txt)
  });

  // check mouse movement
  socket.on("mouse_moved", (x,y)=>{
    socket.broadcast.emit("change_mouse", x, y, socket.id)
    // socket.broadcast wont show the msg itself and only for others
  })

  //when a user disconnect, it moved
  socket.on("disconnect", ()=>{
    delete allusers[socket.id];
    io.emit("user_connected", allusers)
  })
});

//set the server listen to this port
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});