import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/shared/ui/button.tsx'
import { FieldGroup } from '@/shared/ui/field.tsx'
import { toast } from '@/shared/ui/toast.tsx'
import { useAppForm } from '@/shared/form/index.ts'
import { friendlyServerError } from '@/shared/lib/errors.ts'
import { loginFn } from '@/modules/auth/server/auth.functions.ts'

const draftSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email atau username wajib diisi.'),
  password: z.string().min(1, 'Password wajib diisi.'),
})

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)

  const form = useAppForm({
    defaultValues: { emailOrUsername: '', password: '' },
    validators: { onChange: draftSchema },
    onSubmit: async ({ value }) => {
      if (submitting) return
      setSubmitting(true)
      try {
        await loginFn({ data: value })
        await queryClient.invalidateQueries()
        await router.invalidate()
        toast.add({ title: 'Login berhasil.', type: 'success' })
        await router.navigate({ to: '/', replace: true })
      } catch (e) {
        toast.add({
          title: friendlyServerError(e, 'Login gagal.'),
          type: 'error',
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup className="gap-4">
        <form.AppField name="emailOrUsername">
          {(field) => (
            <field.TextField
              label="Email / Username"
              id="login-identifier"
              placeholder="cth: admin"
              autoComplete="username"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="Password"
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          )}
        </form.AppField>
        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 w-full font-bold"
        >
          {submitting ? 'MEMPROSES…' : 'LOGIN'}
        </Button>
      </FieldGroup>
    </form>
  )
}
