const getEnv = (key: string, fallback?: string) => {
  const value = import.meta.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const env = {
  apiBaseUrl: getEnv("VITE_API_BASE_URL"),
  appEnv: getEnv("VITE_APP_ENV", "development"),
};