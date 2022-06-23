const { checkerMethods } = require('../../client/src/subcomponents/main/checkerMethods');
const { Users, Boards } = require('../models/Users');

const getUserData = (req, res) => {
  const sessionIdString = req.session_id;
  if (sessionIdString === undefined) {
    // res.sendStatus(401);
    res.end();
  } else {
    Users.findOne({ sessionIdString }, (err, entry) => {
      if (err || entry === null) {
        // res.sendStatus(404);
        res.end();
      } else {
        res.send(entry);
      }
    });
  }
};

const boardSizes = [8, 10, 12];
const postInvite = (req, res) => {
  // For now, forces a new game. Later, refactor to include full-on invite logic
  const { username, opponent } = req.body;
  Users.findOne({ username: opponent }, (err, entry) => {
    if (err) {
      console.log(err);
      res.end();
    } else if (entry === null) {
      console.log('Opponent doesn\'t exist');
      res.end();
    } else {
      const boardSize = boardSizes[Math.floor(Math.random() * boardSizes.length)];
      const boardId = new Date().getTime();
      const board = new Boards({
        id: boardId,
        whitePlayerUsername: username,
        blackPlayerUsername: opponent,
        board: checkerMethods.generateBoard(boardSize),
      });
      board.save((errSave) => {
        if (errSave) {
          console.log(errSave);
          res.end();
        } else {
          Users.findOneAndUpdate(
            { username },
            { $push: { boards: { id: boardId, opponent } } },
            () => {
              Users.findOneAndUpdate(
                { username: opponent },
                { $push: { boards: { id: boardId, opponent: username } } },
                () => {
                  res.end();
                },
              );
            },
          );
        }
      });
    }
  });
};

const getBoard = (req, res) => {
  const id = req.query?.id;
  if (id === undefined) {
    res.sendStatus(404);
  } else {
    Boards.findOne({ id }, (err, entry) => {
      if (err || entry === null) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.send(entry);
      }
    });
  }
};

const updateBoard = (req, res) => {
  const newBoardMeta = req.body;
  console.log(newBoardMeta);
  Boards.findOneAndUpdate(
    { id: newBoardMeta.id },
    { board: newBoardMeta.board, gameStatus: newBoardMeta.gameStatus },
    (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.end();
      }
    },
  );
};

module.exports = {
  getUserData,
  postInvite,
  getBoard,
  updateBoard,
};
