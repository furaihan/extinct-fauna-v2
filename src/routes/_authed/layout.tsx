import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAuth } from '@/modules/auth/server/guards.ts'

export const Route = createFileRoute('/_authed')({
  beforeLoad: requireAuth,
  component: () => <Outlet />,
})
