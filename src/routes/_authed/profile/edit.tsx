import { createFileRoute } from '@tanstack/react-router'
import { EditProfileForm } from '@/modules/user/components/edit-profile-form.tsx'

export const Route = createFileRoute('/_authed/profile/edit')({
  head: () => ({ meta: [{ title: 'Edit Profil — Extinct Fauna' }] }),
  component: EditProfileForm,
})
