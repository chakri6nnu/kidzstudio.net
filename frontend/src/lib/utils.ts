import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple API client for backend integration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "/api");

export type ApiError = { message: string; errors?: Record<string, string[]> };

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!resp.ok) {
    let payload: any = null;
    try {
      payload = await resp.json();
    } catch (_) {}
    const error: ApiError = {
      message: payload?.message || `Request failed with status ${resp.status}`,
      errors: payload?.errors,
    };
    throw error;
  }
  if (resp.status === 204) return undefined as unknown as T;
  return resp.json() as Promise<T>;
}

export type LoginResponse = {
  token: string;
  user: { id: number; name: string; email: string; user_name?: string };
};

export async function loginApi(
  email: string,
  password: string,
  deviceName = "react-client"
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, device_name: deviceName }),
  });
  setAuthToken(data.token);
  return data;
}

export async function logoutApi(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
  setAuthToken(null);
}

export async function meApi() {
  return apiFetch("/auth/me");
}
