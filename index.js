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

  // detect different user connect
  allusers[socket.id] = {left:0, top:0}
  io.emit("user_connected", allusers);

  // alert button
  socket.on("send_msg", (txt, name)=>{
    io.emit("change", socket.id, txt, name)
  });

  //when a user disconnect, it removed
  socket.on("disconnect", ()=>{
    delete allusers[socket.id];
    io.emit("user_connected", allusers)
  })
});

//set the server listen to this port
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});