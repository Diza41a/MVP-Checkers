/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';

import CheckerBoard from './CheckerBoard';

export default function Main() {
  return (
    <>
      <div className="meta-wrap">
        <p className="meta-user">12:00 Pending...</p>
      </div>
      <main>
        <nav className="nav">
          <h1 className="logo">Checkers.io</h1>
          <div className="invites-wrap">
            <input type="text" id="invite-send" />
            <button type="button" id="invites-open" />
          </div>
          <div className="log-wrap">
            <h4 className="nav-header">
              Log
              <i className="fa-solid fa-up-right-from-square log-link" />
            </h4>
            <ul className="log-list">
              {/*  */}
            </ul>
          </div>
          <div className="games-wrap">
            <h4 className="nav-header">Current Games</h4>
            <ul className="games-list">
              {/*  */}
            </ul>
          </div>
        </nav>
        <div className="games-section">
          <CheckerBoard />
        </div>
      </main>
    </>
  );
}
