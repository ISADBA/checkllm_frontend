export function redactBaseUrl(baseUrl: string) {
  try {
    return new URL(baseUrl).hostname;
  } catch {
    return "unknown-host";
  }
}
