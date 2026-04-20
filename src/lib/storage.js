export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readFromStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}
