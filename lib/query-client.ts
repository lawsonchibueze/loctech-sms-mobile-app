import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { mmkvStorageAdapter } from "@/lib/mmkv";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours for offline persistence
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const asyncPersister = createAsyncStoragePersister({
  storage: mmkvStorageAdapter,
  key: "LOCTECH_QUERY_CACHE",
});
