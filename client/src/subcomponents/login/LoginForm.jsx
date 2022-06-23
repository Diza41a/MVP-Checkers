import React, { useContext } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-cycle
import { AuthenticationContext } from '../../index';

export default function LoginForm() {
  const { toggleAuthentication, setUserData } = useContext(AuthenticationContext);

  const authenticate = (e) => {
    e.preventDefault();
    const usernameEl = document.querySelector('#login-input-username');
    const passwordEl = document.querySelector('#login-input-password');
    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();
    let wrongFormat = false;
    // Basic username validation
    // eslint-disable-next-line no-restricted-globals
    if (username.length < 3 || !isNaN(username[0])) {
      usernameEl.placeholder = 'Invalid format';
      wrongFormat = true;
    }
    // Password validation
    if (password.length < 3) {
      passwordEl.placeholder = 'Invalid format';
      wrongFormat = true;
    }
    if (wrongFormat) {
      return;
    }
    axios.post('/authenticate', { username, password })
      .then(() => {
        axios.get('/userData')
          .then((response) => {
            setUserData(response.data);
            toggleAuthentication(true);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(() => {
        passwordEl.value = '';
        passwordEl.placeholder = 'Wrong password';
      });
  };

  return (
    <div className="login-form-wrap">
      <form className="login-form">
        <h1 className="logo">Checkers.io</h1>
        <h4 className="login-welcome">Login / New User</h4>
        <div className="login-input-wrap">
          <i className="fa-solid fa-user login-icon" />
          <input type="text" id="login-input-username" placeholder="Username" onKeyPress={(e) => { e.target.placeholder = 'Username'; }} />
        </div>
        <div className="login-input-wrap">
          <i className="fa-solid fa-lock login-icon" />
          <input type="password" id="login-input-password" placeholder="Password" onKeyPress={(e) => { e.target.placeholder = 'Password'; }} />
        </div>
        <button type="submit" id="login-submit" onClick={authenticate}>Submit</button>
      </form>
    </div>

  );
}
