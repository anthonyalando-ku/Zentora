const KEY = "zentora_session_id";

const generateSessionId = () => {
  // Simple stable ID; good enough until backend session system exists.
  // Prefer crypto if available.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const getOrCreateZentoraSessionId = (): string => {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;

    const next = generateSessionId();
    localStorage.setItem(KEY, next);
    return next;
  } catch {
    // If localStorage is blocked, fall back to an ephemeral ID
    return generateSessionId();
  }
};