self.addEventListener("install", (event) => {
  console.log("Cyber-Zero SW Installed");

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Cyber-Zero SW Activated");
});

self.addEventListener("fetch", (event) => {
});
