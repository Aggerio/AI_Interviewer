// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRouter from './AppRouter'; // Import AppRouter

ReactDOM.render(
  <React.StrictMode>
    <AppRouter /> {/* Use AppRouter */}
  </React.StrictMode>,
  document.getElementById('root')
);
