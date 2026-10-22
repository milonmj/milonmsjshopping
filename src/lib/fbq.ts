export function trackPixel(event: string, params?: Record<string, unknown>, tries = 0) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq === "function") {
    w.fbq("track", event, params);
    return;
  }
  if (tries < 20) {
    setTimeout(() => trackPixel(event, params, tries + 1), 250);
  }
}
