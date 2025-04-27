// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';  // <-- ייבוא ה‑Provider
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

console.log("🔥 Index.js is running");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>      {/* <-- עטיפה סביב כל האפליקציה */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
