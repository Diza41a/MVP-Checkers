// const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { authenticate } = require('./controllers/authenctication');

const app = express();
// Middleware
app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'Mr. Hamster',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
  },
}));

// authenticate
app.post('/authenticate', (req, res) => {
  authenticate(req, res);
});

// Serve App
app.use('/', express.static(path.join(__dirname, '../client/dist')));

// Request variables
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on  http://localhost:${port}`);
});
