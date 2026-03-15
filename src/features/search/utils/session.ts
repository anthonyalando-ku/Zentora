const KEY = "discovery_session_id";

export const getDiscoverySessionId = () => {
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(KEY, id);
  return id;
};