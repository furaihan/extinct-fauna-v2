import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/shared/ui/button.tsx'
import { FieldGroup } from '@/shared/ui/field.tsx'
import { toast } from '@/shared/ui/toast.tsx'
import { useAppForm } from '@/shared/form/index.ts'
import { friendlyServerError } from '@/shared/lib/errors.ts'
import { signupFn } from '@/modules/auth/server/auth.functions.ts'

const draftSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username minimal 3 karakter.')
      .max(30, 'Username maksimal 30 karakter.')
      .regex(/^[a-zA-Z0-9]+$/, 'Username hanya boleh huruf dan angka.'),
    email: z.string().email('Email tidak valid.'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter.')
      .max(30, 'Password maksimal 30 karakter.'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password tidak cocok.',
  })

export function SignupForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)

  const form = useAppForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: { onChange: draftSchema },
    onSubmit: async ({ value }) => {
      if (submitting) return
      setSubmitting(true)
      try {
        await signupFn({ data: value })
        await queryClient.invalidateQueries()
        await router.invalidate()
        toast.add({ title: 'Pendaftaran berhasil.', type: 'success' })
        await router.navigate({ to: '/', replace: true })
      } catch (e) {
        toast.add({
          title: friendlyServerError(e, 'Pendaftaran gagal.'),
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
        <form.AppField name="username">
          {(field) => (
            <field.TextField
              label="Username"
              id="signup-username"
              placeholder="cth: zhafar"
              maxLength={30}
              autoComplete="username"
            />
          )}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              id="signup-email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="Password"
              id="signup-password"
              type="password"
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.TextField
              label="Konfirmasi Password"
              id="signup-confirm"
              type="password"
              placeholder="Ulangi password"
              autoComplete="new-password"
            />
          )}
        </form.AppField>
        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 w-full font-bold"
        >
          {submitting ? 'MEMPROSES…' : 'SIGN UP'}
        </Button>
      </FieldGroup>
    </form>
  )
}
