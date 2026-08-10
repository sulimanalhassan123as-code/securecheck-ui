const CACHE_VERSION = 'securecheck-v3-force-clear';

self.addEventListener("install", (event) => {
  console.log("[SW] Installing new version:", CACHE_VERSION);
  // Clear all caches immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        console.log("[SW] Deleting cache:", key);
        return caches.delete(key);
      }));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating new version:", CACHE_VERSION);
  event.waitUntil(
    Promise.all([
      // Clear all caches again
      caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => caches.delete(key)));
      }),
      // Take control of all clients immediately
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  // Network-first strategy: always go to network, don't serve from cache
  // This ensures the user always gets the latest JavaScript
  if (event.request.method === "GET" && event.request.url.includes("/assets/")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).then((response) => {
        return response;
      }).catch(() => {
        return fetch(event.request);
      })
    );
  }
});
