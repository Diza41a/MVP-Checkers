import React from 'react';
import { createRoot } from 'react-dom/client';
// create the root of the app by selection where the app should be mounted in the dom
const root = createRoot(document.getElementById('root'));

function App() {
  return <h1>Hello World</h1>;
}

root.render(<App />);
