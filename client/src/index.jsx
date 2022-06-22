import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Subcomponent imports
import LoginForm from './subcomponents/login/LoginForm.jsx';
import CheckerBoard from './subcomponents/main/CheckerBoard.jsx';

// Create the root of the app by selection where the app should be mounted in the dom
const root = createRoot(document.getElementById('root'));

function App() {
  const [isLoading, toggleLoading] = useState(true);

  // componentDidMount
  // toggleLoading
  useEffect(() => {
    toggleLoading(false);
  }, []);

  if (!isLoading) {
    return (
      <>
        <LoginForm />
        {/* <CheckerBoard /> */}
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}

root.render(<App />);
