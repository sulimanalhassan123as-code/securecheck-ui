export function getDeviceId() {
  let id = localStorage.getItem("sc_device_id");
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now()));
    localStorage.setItem("sc_device_id", id);
  }
  return id;
}
