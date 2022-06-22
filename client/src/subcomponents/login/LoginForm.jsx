import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

export default function LoginForm() {
  return (
    <div className="login-form-wrap">
      <form className="login-form">
        <h1 className="logo">Checkers.io</h1>
        <h4 className="login-welcome">Login / New User</h4>
        <div className="login-input-wrap">
          <i className="fa-solid fa-user login-icon"></i>
          <input type="text" id="login-input-username" placeholder="Username"></input>
        </div>
        <div className="login-input-wrap">
          <i className="fa-solid fa-lock login-icon"></i>
          <input type="password" id="login-input-password" placeholder="Password"></input>
        </div>
        <button type="submit" id="login-submit">Submit</button>
      </form>
    </div>

  );
};
