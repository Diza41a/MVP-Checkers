/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// import axios from 'axios';
import Cookies from 'js-cookie';

// Subcomponent imports
// eslint-disable-next-line import/no-cycle
import LoginForm from './subcomponents/login/LoginForm';
import Main from './subcomponents/main/Main';

// Create the root of the app by selection where the app should be mounted in the dom
const root = createRoot(document.getElementById('root'));

// Authentication context
export const AuthenticationContext = React.createContext('');

function App() {
  const [isLoading, toggleLoading] = useState(true);
  const [isAuthenticated, toggleAuthentication] = useState(false);
  // componentDidMount
  // toggleLoading
  useEffect(() => {
    toggleLoading(false);
  }, []);

  // componentDidUpdate
  useEffect(() => {
    // If not in the session right now, require authentication
    if (Cookies.get('connect.sid') === undefined) {
      toggleAuthentication(false);
    } else {
      toggleAuthentication(true);
    }
  });

  if (!isLoading) {
    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <AuthenticationContext.Provider value={{ isAuthenticated, toggleAuthentication }}>
        {!isAuthenticated ? <LoginForm /> : <Main />}
      </AuthenticationContext.Provider>
    );
  }
  return (<div>Loading...</div>);
}

root.render(<App />);
