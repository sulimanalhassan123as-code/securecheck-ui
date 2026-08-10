import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './router.jsx'
import { initAuthSync } from './utils/auth'
import './index.css'

initAuthSync();

// Force unregister any old service worker and register the new one
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      // Unregister ALL existing service workers
      return Promise.all(registrations.map((reg) => {
        console.log("[Main] Unregistering old SW:", reg.scope);
        return reg.unregister();
      }));
    }).then(() => {
      // Register the fresh service worker
      return navigator.serviceWorker.register("/sw.js?v=" + Date.now());
    }).then((reg) => {
      console.log("[Main] New SW registered:", reg.scope);
      // Force update
      reg.update();
    }).catch((err) => {
      console.error("[Main] SW error:", err);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
