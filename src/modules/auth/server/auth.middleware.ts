import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { useAppSession } from './session.ts'
import { findUserById } from './auth.repo.ts'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await useAppSession()
    const userId = session.data.userId
    if (!userId) {
      throw redirect({ to: '/login' })
    }
    const user = await findUserById(userId)
    if (!user) {
      await session.clear()
      throw redirect({ to: '/login' })
    }
    return next({
      context: {
        userId: user.user_id,
        username: user.username ?? '',
      },
    })
  },
)
