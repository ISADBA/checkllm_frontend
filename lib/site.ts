const DEFAULT_SITE_URL = "https://checkllm.cc";

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;

  return configuredUrl.endsWith("/")
    ? configuredUrl.slice(0, -1)
    : configuredUrl;
}
