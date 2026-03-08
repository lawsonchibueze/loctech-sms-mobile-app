import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { queryClient } from "@/lib/query-client";
import type { LoginRequest, LoginResponse } from "@/lib/types";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      // Set the tenant ID from institute code before making the login request
      useAuthStore.setState({ tenantId: data.instituteCode });
      return api.post<LoginResponse>("/mobile/auth/login", {
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: async (data) => {
      await login(data.accessToken, data.refreshToken, data.user);
    },
    onError: () => {
      // Clear tenant ID if login fails
      useAuthStore.setState({ tenantId: null });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/mobile/auth/logout");
      } catch {
        // logout locally even if server call fails
      }
    },
    onSuccess: async () => {
      queryClient.clear();
      await logout();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      return api.post("/mobile/auth/forgot-password", { email });
    },
  });
}

export { ApiError };
