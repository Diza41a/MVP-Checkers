/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useContext } from 'react';
import Clock from 'react-live-clock';
import axios from 'axios';

import CheckerBoard from './CheckerBoard';
import { AuthenticationContext } from '../../index';

export default function Main() {
  const { userData, setUserData, setBoardMeta } = useContext(AuthenticationContext);

  const sendInvite = (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      const inviteInputEl = e.target;
      const inviteUsername = inviteInputEl.value.trim();
      // eslint-disable-next-line no-restricted-globals
      if (inviteUsername.length > 3 && isNaN(inviteUsername)) {
        axios.post('/invite', { username: userData.username, opponent: inviteUsername.toLowerCase() })
          .then(() => {
            axios.get('/userData')
              .then((response) => {
                if (response.data !== '') {
                  setUserData(response.data);
                }
              })
              .catch((innerErr) => console.log(innerErr));
          })
          .catch((err) => console.log(err));
      }
    } else {
      e.target.value += e.key;
    }
  };

  const selectBoard = (e) => {
    document.querySelector('.selected')?.classList?.remove('selected');
    const boardId = e.target.getAttribute('data-board-id');
    if (boardId !== undefined) {
      e.target.classList.add('selected');
      axios.get(`/board?id=${boardId}`)
        .then((boardResponse) => {
          setBoardMeta(boardResponse.data);
        })
        .catch((err) => console.log(err));
    }
  };

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
          <p className="meta-user">
            <Clock format="HH:mm:ss" ticking timezone="US/Eastern" className="clock" />
            {`  @${userData?.username ? userData.username : 'Pending...'}`}
          </p>
        </div>
        <div className="games-section">
          <CheckerBoard />
        </div>
      </main>
    </div>
  );
}
