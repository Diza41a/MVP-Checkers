/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Cookies from 'js-cookie';
import axios from 'axios';

// Subcomponent imports
import LoginForm from './subcomponents/login/LoginForm';
import Main from './subcomponents/main/Main';

// Create the root of the app by selection where the app should be mounted in the dom
const root = createRoot(document.getElementById('root'));

// Authentication context
export const AuthenticationContext = React.createContext('');

function App() {
  const [isLoading, toggleLoading] = useState(true);
  const [isAuthenticated, toggleAuthentication] = useState(false);
  const [userData, setUserData] = useState(null);
  const [boardMeta, setBoardMeta] = useState(null);
  // componentDidMount
  // toggleLoading
  useEffect(() => {
    toggleLoading(false);
    if (Cookies.get('s_id') !== undefined) {
      axios.get('/userData')
        .then((response) => {
          if (response.data !== '') {
            setUserData(response.data);
            toggleAuthentication(true);
          }
        })
        .catch();
    }
  }, []);

  // componentDidUpdate
  useEffect(() => {
  });

  if (!isLoading) {
    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <AuthenticationContext.Provider value={{
        isAuthenticated, toggleAuthentication, userData, setUserData, boardMeta, setBoardMeta,
      }}
      >
        {!isAuthenticated ? <LoginForm /> : <Main />}
      </AuthenticationContext.Provider>
    );
  }
  return (<div>Loading...</div>);
}

root.render(<App />);
