import { useQuery } from '@tanstack/react-query'
import { fetchSessionFn } from '@/modules/auth/server/auth.functions.ts'

export const sessionKeys = {
  all: ['session'] as const,
}

export function useSession() {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: () => fetchSessionFn(),
    staleTime: 30_000,
  })
}
