const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
app.use(cors());

const server = app.listen(5000, () => {
  console.log("listening on *:5000");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (id) => {
    socket.join(id);
    console.log("joined roomId", id);
    socket.on("mouse-position", (mouse) => {
      socket.to(id).emit("location", mouse);
    });
  });
});
