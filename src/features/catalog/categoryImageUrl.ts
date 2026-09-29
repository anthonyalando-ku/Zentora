export function categoryImageUrl(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!text || text.length > 2048 || /\s/.test(text)) return null;
  try {
    const url = new URL(text);
    if (!/^https?:\/\//i.test(text) || !["https:", "http:"].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}
