export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

export const BROWSER_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_PROXY_PATH || API_BASE_URL
).replace(/\/$/, "");
