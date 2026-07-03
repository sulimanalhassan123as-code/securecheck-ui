import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './router.jsx'
import { initAuthSync } from './utils/auth'
import './index.css'

initAuthSync();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log(
          "Cyber-Zero Service Worker Active"
        );
      })
      .catch((err) => {
        console.error(
          "SW registration failed",
          err
        );
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
