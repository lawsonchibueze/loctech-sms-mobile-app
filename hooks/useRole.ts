import { useAuthStore } from "@/lib/auth-store";
import type { Role } from "@/lib/types";

export function useRole(): Role | null {
  return useAuthStore((s) => s.user?.role ?? null);
}
