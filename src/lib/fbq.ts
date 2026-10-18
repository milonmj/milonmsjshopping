export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq === "function") {
    w.fbq("track", event, params);
  }
}
