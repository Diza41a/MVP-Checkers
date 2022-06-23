/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const { dbConnection } = require('./dbConnection');

const invitesSchema = new mongoose.Schema({
  incoming: [{ type: Number, default: [] }],
  outgoing: [{ type: Number, default: [] }],
});

const boardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    default: new Date().getTime(),
  },
  whitePlayerUsername: {
    type: String,
    required: true,
  },
  blackPlayerUsername: {
    type: String,
    required: true,
  },
  gameStatus: {
    type: String,
    required: true,
    default: 'white',
  },
  board: [[{ type: Number, unique: true }]],
});

const usersSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
    required: true,
    default: new Date().getTime(),
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sessionIdString: {
    type: String,
    required: true,
  },
  invites: { type: invitesSchema, default: { invitesSchema } },
  logs: [{ type: String, default: [] }],
  boards: [{ type: { id: Number, opponent: String }, default: [] }],
});

const Users = mongoose.model('users', usersSchema);
const Boards = mongoose.model('boards', boardSchema);

module.exports = {
  Users,
  Boards,
};
