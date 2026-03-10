import { API_URL } from "./constants";
import { useAuthStore } from "./auth-store";
import type { ApiResponse } from "./types";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const { accessToken, tenantId } = useAuthStore.getState();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (tenantId) {
      headers["X-Tenant-Id"] = tenantId;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      const refreshed = await this.tryRefreshToken();
      if (!refreshed) {
        useAuthStore.getState().logout();
        throw new ApiError("Session expired", 401);
      }
      throw new RetryError();
    }

    const json = await response.json();

    if (response.status === 403) {
      throw new ApiError(
        json.error || json.message || "You do not have permission to perform this action.",
        403,
        json.details
      );
    }

    if (!response.ok) {
      throw new ApiError(
        json.error ?? "Request failed",
        response.status,
        json.details
      );
    }

    return (json as ApiResponse<T>).data;
  }

  private async tryRefreshToken(): Promise<boolean> {
    const { refreshToken, setTokens } = useAuthStore.getState();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${this.baseUrl}/sms/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const json = await res.json();
      const { accessToken, refreshToken: newRefresh } = json.data;
      await setTokens(accessToken, newRefresh);
      return true;
    } catch {
      return false;
    }
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const config: RequestInit = {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof RetryError) {
        const response = await fetch(url, {
          ...config,
          headers: { ...this.getHeaders(), ...options.headers },
        });
        return await this.handleResponse<T>(response);
      }
      throw error;
    }
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "POST", body });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "PATCH", body });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "PUT", body });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export class ApiError extends Error {
  statusCode: number;
  details?: string;

  constructor(message: string, statusCode: number, details?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

class RetryError extends Error {
  constructor() {
    super("Retry after token refresh");
  }
}

export const api = new ApiClient(API_URL);
