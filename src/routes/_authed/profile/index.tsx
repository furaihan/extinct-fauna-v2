import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/modules/user/components/profile-page.tsx'

export const Route = createFileRoute('/_authed/profile/')({
  head: () => ({ meta: [{ title: 'Profil — Extinct Fauna' }] }),
  component: ProfilePage,
})
