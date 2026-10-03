import { redirect } from '@tanstack/react-router'
import { fetchSessionFn } from './auth.functions.ts'

export async function requireAuth({ location }: { location: { href: string } }) {
  let session: Awaited<ReturnType<typeof fetchSessionFn>> | null = null
  try {
    session = await fetchSessionFn()
  } catch {
    session = null
  }
  if (!session?.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }
  return { session }
}

export async function redirectIfAuthenticated() {
  let session: Awaited<ReturnType<typeof fetchSessionFn>> | null = null
  try {
    session = await fetchSessionFn()
  } catch {
    session = null
  }
  if (session?.isAuthenticated) {
    throw redirect({ to: '/' })
  }
  return { session }
}
