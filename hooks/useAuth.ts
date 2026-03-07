import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { queryClient } from "@/lib/query-client";
import type { LoginRequest, LoginResponse } from "@/lib/types";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      return api.post<LoginResponse>("/sms/auth/login", data);
    },
    onSuccess: async (data) => {
      await login(data.accessToken, data.refreshToken, data.user);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/sms/auth/logout");
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
      return api.post("/sms/auth/forgot-password", { email });
    },
  });
}

export { ApiError };
