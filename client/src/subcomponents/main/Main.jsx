/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useContext } from 'react';
import Clock from 'react-live-clock';
import Cookies from 'js-cookie';
import axios from 'axios';
import io from 'socket.io-client';
import CheckerBoard from './CheckerBoard';
import { AuthenticationContext } from '../../index';

const socket = io.connect();

export default function Main() {
  const {
    userData, setUserData, boardMeta, setBoardMeta, restrictUnauthenticated, toggleAuthentication,
  } = useContext(AuthenticationContext);

  // const [selectedBoard, setSelectedBoard] = useState(0);

  const sendInvite = (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      const inviteInputEl = e.target;
      const inviteUsername = inviteInputEl.value.trim();
      // eslint-disable-next-line no-restricted-globals
      if (inviteUsername.length > 3 && isNaN(inviteUsername)) {
        socket.emit('post_invite', { username: userData.username, opponent: inviteUsername.toLowerCase() });
        axios.get('/userData')
          .then((response) => {
            if (response.data !== '') {
              setUserData(response.data);
            }
          })
          .catch((innerErr) => {
            console.log(innerErr);
            restrictUnauthenticated(innerErr);
          });
        // eslint-disable-next-line max-len
        // axios.post('/invite', { username: userData.username, opponent: inviteUsername.toLowerCase() })
        //   .then(() => {
        //     axios.get('/userData')
        //       .then((response) => {
        //         if (response.data !== '') {
        //           setUserData(response.data);
        //         }
        //       })
        //       .catch((innerErr) => {
        //         console.log(innerErr);
        //         restrictUnauthenticated(innerErr);
        //       });
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     console.log('hereOuter');
        //     restrictUnauthenticated(err);
        //   });
      }
    } else {
      e.target.value += e.key;
    }
  };

  // ComponentDidMount
  useEffect((() => {
    // Select first game in the list on page load
    const userGames = document.querySelectorAll('[data-board-id]');
    if (userGames.length > 0) {
      document.querySelector('.selected')?.classList?.remove('selected');
      const boardId = userGames[0].getAttribute('data-board-id');
      if (boardId !== undefined) {
        userGames[0].classList.add('selected');
        axios.get(`/board?id=${boardId}`)
          .then((boardResponse) => {
            setBoardMeta(boardResponse.data);
          })
          .catch((err) => {
            console.log(err);
            restrictUnauthenticated(err);
          });
      }
    }
  }), []);

  // Invite updates (socket)
  useEffect(() => {
    socket.on('refresh_invites', (invitesArray) => {
      for (let i = 0; i < invitesArray.length; i += 1) {
        if (invitesArray[i].username === userData.username) {
          const newBoards = [
            ...userData.boards, { opponent: invitesArray[i].opponent, id: invitesArray[i].boardId },
          ];
          const newUserData = { ...userData };
          delete newUserData.boards;
          console.log(newUserData.boards);
          setUserData(
            {
              ...newUserData,
              boards: newBoards,
            },
          );
        }
      }
    });
  }, [socket]);

  // useEffect((() => {
  //   axios.get('/userData')
  //     .then((response) => {
  //       if (response.data !== '') {
  //         setUserData(response.data);
  //       }
  //     })
  //     .catch((innerErr) => {
  //       console.log(innerErr);
  //       restrictUnauthenticated(innerErr);
  //     });
  // }), [userData]);

  const selectBoard = (e) => {
    document.querySelector('.selected')?.classList?.remove('selected');
    const boardId = e.target.getAttribute('data-board-id');
    if (boardId !== undefined) {
      e.target.classList.add('selected');
      axios.get(`/board?id=${boardId}`)
        .then((boardResponse) => {
          setBoardMeta(boardResponse.data);
        })
        .catch((err) => {
          console.log(err);
          restrictUnauthenticated(err);
        });
    }
  };

  const logout = (e) => {
    e.preventDefault();
    Cookies.remove('s_id');
    toggleAuthentication(false);
  };

  let metaString = 'Pending...';
  // if (boardMeta?.whitePlayerUsername !== undefined) {
  // eslint-disable-next-line max-len
  //   // metaString = `| W: @${boardMeta.whitePlayerUsername} vs B: @${boardMeta.blackPlayerUsername} | `;
  // }
  if (userData?.username !== undefined) {
    metaString = ` | Username: @${userData.username} | `;
  }

  return (
    <div className="main-wrap">
      <nav className="nav">
        <h1 className="logo">Checkers.io</h1>
        <div className="invites-wrap">
          <input type="text" id="invite-send" placeholder="Send Invite" onKeyPress={sendInvite} />
          <button type="button" id="invites-open">Open Invites</button>
        </div>
        <div className="log-wrap">
          <h4 className="nav-header">
            Log
            <i className="fa-solid fa-up-right-from-square log-link" />
          </h4>
          <ul className="log-list">
            {userData.logs.slice(0, 20).map((log, i) => <li key={i}>log</li>)}
          </ul>
        </div>
        <div className="games-wrap">
          <h4 className="nav-header">Current Games</h4>
          <ul className="games-list" onClick={selectBoard}>
            {userData.boards.map(
              (boardInfo, i) => <li key={i} data-board-id={boardInfo.id}>{boardInfo.opponent}</li>,
            )}
          </ul>
        </div>
      </nav>
      <main>
        <div className="meta-wrap">
          <i className="fa-solid fa-arrow-right-from-bracket" id="logout" onClick={logout} />
          <p className="meta-user">
            <Clock format="HH:mm" ticking timezone="US/Eastern" className="clock" />
            <span>{metaString}</span>
            {boardMeta?.gameStatus ? <span>{`Status: ${boardMeta.gameStatus}'s turn`}</span> : null}
          </p>
        </div>
        <div className="games-section">
          <CheckerBoard />
        </div>
      </main>
    </div>
  );
}
