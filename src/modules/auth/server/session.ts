import { useSession } from '@tanstack/react-start/server'
import { env } from '@/lib/env.lib.ts'

export interface AppSession {
  userId?: string
  username?: string
}

export function useAppSession() {
  return useSession<AppSession>({
    name: 'extinct-fauna-session',
    password: env.SESSION_SECRET,
    cookie: {
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    },
  })
}
