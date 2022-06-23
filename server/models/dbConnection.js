const mongoose = require('mongoose');
const { MONGODB_URI } = require('../../config');

process.env.MONGODB_URI = MONGODB_URI;

const dbConnection = mongoose.connect(process.env.MONGODB_URI, {
});

// app.post('/test' ,(req, res) => {
//   const postbody = {
//     userId: 1,
//     username: 'Diza41a',
//     password: '1lol2',
//     sessionIdString: 'sadfks;a',
//     invites: { incoming: [], outgoing: [] },
//     logs: ['Diza41a has joined chat...'],
//     boards: [
//       {
//         id: 1,
//         whitePlayerId: 1,
//         blackPlayerId: 3,
//         gameStatus: 'black',
//         board: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
//       }
//     ]
//   }

//   const user = new Users(postbody);
//   user.save((err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('saved');
//     }
//   });

// });

module.exports = {
  dbConnection,
};
