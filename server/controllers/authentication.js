const { v4: uuidv4 } = require('uuid');
const { Users } = require('../models/Users');

const authenticate = (req, res) => {
  const { password } = req.body;
  let { username } = req.body;
  username = username.toLowerCase();
  if (username === undefined || password === undefined) {
    // Some input was not provided
    res.sendStatus(400);
  } else {
    Users.findOne({ username, password }, (errFind, entry) => {
      if (errFind) {
        // Database error
        res.sendStatus(500);
      } else if (entry === null) {
        // Create new user
        const sessionIdString = uuidv4();
        const newUser = new Users({ sessionIdString, username, password });
        newUser.save((errSave) => {
          if (errSave) {
            // Database error
            res.sendStatus(500);
          } else {
            res.cookie('s_id', sessionIdString);
            res.end();
          }
        });
      } else if (entry.username === username && entry.password === password) {
        res.cookie('s_id', entry.sessionIdString);
        res.end();
      } else {
        res.sendStatus(401);
      }
    });
  }
};

module.exports = {
  authenticate,
};
