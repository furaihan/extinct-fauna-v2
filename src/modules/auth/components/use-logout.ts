import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/shared/ui/toast.tsx'
import { logoutFn } from '@/modules/auth/server/auth.functions.ts'
import { friendlyServerError } from '@/shared/lib/errors.ts'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [loggingOut, setLoggingOut] = useState(false)

  async function logout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logoutFn()
      await queryClient.invalidateQueries()
      await router.invalidate()
      await router.navigate({ to: '/', replace: true })
      toast.add({ title: 'Logout berhasil.', type: 'success' })
    } catch (e) {
      toast.add({
        title: friendlyServerError(e, 'Logout gagal.'),
        type: 'error',
      })
    } finally {
      setLoggingOut(false)
    }
  }

  return { logout, loggingOut }
}
