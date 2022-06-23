// const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authenticate } = require('./controllers/authentication');
const {
  getUserData, postInvite, getBoard, updateBoard,
} = require('./controllers/users');

const app = express();
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
app.post('/authenticate', (req, res) => {
  authenticate(req, res);
});

app.use((req, res, next) => {
  const { s_id: sessionId } = req.cookies;
  if (sessionId !== undefined) {
    req.session_id = sessionId;
  }
  next();
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
app.put('/board', (req, res) => {
  updateBoard(req, res);
});

// Serve App
app.use('/', express.static(path.join(__dirname, '../client/dist')));

// Request variables
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on  http://localhost:${port}`);
});
