import { ApiError } from "@/lib/api";

/**
 * Check if a TanStack Query error is a 403 Forbidden.
 * Use with PermissionDenied component for consistent UX:
 *
 * ```tsx
 * const { data, error } = useQuery(...)
 * const forbidden = isForbiddenError(error)
 * if (forbidden) return <PermissionDenied message={forbidden} />
 * ```
 */
export function isForbiddenError(error: Error | null | undefined): string | false {
  if (!error) return false;
  if (error instanceof ApiError && error.statusCode === 403) {
    return error.message;
  }
  return false;
}
