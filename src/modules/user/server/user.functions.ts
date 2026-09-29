import { createServerFn } from '@tanstack/react-start'
import { toAppError } from '@/shared/lib/to-app-error.ts'
import { authMiddleware } from '@/modules/auth/server/auth.middleware.ts'
import { updateProfileSchema } from '../schemas.ts'
import {
  getProfileByUserId,
  getRecentQuizzesByUserId,
  updateProfileByUserId,
} from './user.repo.ts'

export const getProfileFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const profile = await getProfileByUserId(context.userId)
      if (!profile) throw new Error('User tidak ditemukan.')
      const quizzes = await getRecentQuizzesByUserId(context.userId, 3)
      return { profile, quizzes }
    } catch (e) {
      throw toAppError(e, 'Gagal memuat profil.')
    }
  })

export const updateProfileFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateProfileSchema)
  .handler(async ({ context, data }) => {
    try {
      await updateProfileByUserId(context.userId, data)
      return { ok: true }
    } catch (e) {
      throw toAppError(e, 'Gagal menyimpan profil.')
    }
  })
