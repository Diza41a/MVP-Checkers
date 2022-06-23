// const fs = require('fs');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authenticate } = require('./controllers/authentication');
const {
  getUserData, postInvite, getBoard, updateBoard,
} = require('./controllers/users');

const app = express();
const server = http.createServer(app);
// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// app.use(session({
//   secret: 'Mr. Hamster',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: false,
//     secure: false,
//   },
// }));
// authenticate
const io = socketIo(server);
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  socket.join('clock-room');
  socket.on('update_board', (boardMeta) => {
    updateBoard(boardMeta);
    socket.broadcast.emit('refresh_boards', boardMeta);
  });

  socket.on('disconnect', (reason) => {
    console.log(reason);
  });
});

setInterval(() => {
  io.to('clock-room').emit('time', new Date());
}, 1000);

app.post('/authenticate', (req, res) => {
  authenticate(req, res);
});

// Serve App
app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.use((req, res, next) => {
  const { s_id: sessionId } = req.cookies;
  if (sessionId !== undefined) {
    req.session_id = sessionId;
    next();
  } else {
    res.sendStatus(401);
  }
});

// POST routes
app.post('/invite', (req, res) => {
  postInvite(req, res);
});

// GET routes
app.get('/userData', (req, res) => {
  getUserData(req, res);
});

app.get('/board', (req, res) => {
  getBoard(req, res);
});

// PUT routes
// app.put('/board', (req, res) => {
//   updateBoard(req, res);
// });

// Request variables
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on  http://localhost:${port}`);
});
