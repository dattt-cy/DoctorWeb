import { BROWSER_API_BASE_URL } from "./config";
import { ApiError, UnauthorizedError } from "./errors";

async function errorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || "Yêu cầu không thành công.";
  } catch {
    return "Yêu cầu không thành công.";
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BROWSER_API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await errorMessage(response);
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== "undefined" && !path.includes("/auth/login")) {
        window.dispatchEvent(new CustomEvent("doctorweb:unauthorized"));
      }
      throw new UnauthorizedError(message, response.status);
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
