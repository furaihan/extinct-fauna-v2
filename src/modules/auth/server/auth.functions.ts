import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { AppError } from '@/shared/lib/app-error.ts'
import { toAppError } from '@/shared/lib/to-app-error.ts'
import { useAppSession } from './session.ts'
import {
  createAccountWithUser,
  emailExists,
  findAccountByEmailOrUsername,
  findUserById,
  usernameExists,
} from './auth.repo.ts'

const emailSchema = z.string().trim().email('Email tidak valid.')
const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username minimal 3 karakter.')
  .max(30, 'Username maksimal 30 karakter.')
  .regex(/^[a-zA-Z0-9]+$/, 'Username hanya boleh huruf dan angka.')
const passwordSchema = z
  .string()
  .min(8, 'Password minimal 8 karakter.')
  .max(30, 'Password maksimal 30 karakter.')

const loginSchema = z.object({
  emailOrUsername: z.string().trim().min(1, 'Email atau username wajib diisi.'),
  password: z.string().min(1, 'Password wajib diisi.'),
})

const signupSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password tidak cocok.',
  })

export const loginFn = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    try {
      const { verifyPassword } = await import('./password.server.ts')
      const found = await findAccountByEmailOrUsername(data.emailOrUsername)

      if (!found || !found.account.password) {
        throw new AppError('Email/username atau password salah.')
      }
      const valid = await verifyPassword(data.password, found.account.password)
      if (!valid) {
        throw new AppError('Email/username atau password salah.')
      }

      const session = await useAppSession()
      await session.clear()
      await session.update({
        userId: found.user.user_id,
        username: found.user.username ?? undefined,
      })

      return {
        ok: true,
        user: {
          userId: found.user.user_id,
          username: found.user.username,
          email: found.account.email,
        },
      }
    } catch (e) {
      throw toAppError(e, 'Login gagal.')
    }
  })

export const signupFn = createServerFn({ method: 'POST' })
  .validator(signupSchema)
  .handler(async ({ data }) => {
    try {
      if (await usernameExists(data.username)) {
        throw new AppError('Username sudah digunakan.')
      }
      if (await emailExists(data.email)) {
        throw new AppError('Email sudah terdaftar.')
      }

      const { hashPassword } = await import('./password.server.ts')
      const passwordHash = await hashPassword(data.password)
      const { account, user } = await createAccountWithUser({
        email: data.email,
        username: data.username,
        passwordHash,
      })

      const session = await useAppSession()
      await session.clear()
      await session.update({
        userId: user.user_id,
        username: user.username ?? undefined,
      })

      return {
        ok: true,
        user: {
          userId: user.user_id,
          username: user.username,
          email: account.email,
        },
      }
    } catch (e) {
      throw toAppError(e, 'Pendaftaran gagal.')
    }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  return { ok: true }
})

export const fetchSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    if (!session.data.userId) {
      return { isAuthenticated: false, user: null }
    }
    const user = await findUserById(session.data.userId)
    if (!user) {
      await session.clear()
      return { isAuthenticated: false, user: null }
    }
    return {
      isAuthenticated: true,
      user: {
        userId: user.user_id,
        username: user.username,
        email: null as string | null,
      },
    }
  },
)
