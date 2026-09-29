import { getDb } from '@/lib/typeorm.lib.ts'
import { User } from '@/modules/auth/db/user.entity.ts'
import { Quiz } from '@/modules/quiz/db/quiz.entity.ts'
import type { QuizSummary, UserProfile } from '../types.ts'

export async function getProfileByUserId(
  userId: string,
): Promise<UserProfile | null> {
  const db = await getDb()
  const user = await db.getRepository(User).findOne({
    where: { user_id: userId },
    relations: { account: true },
  })
  if (!user) return null
  return {
    userId: user.user_id,
    username: user.username,
    email: user.account?.email ?? null,
    firstName: user.first_name,
    lastName: user.last_name,
    bio: user.bio,
    address: user.address,
    phone: user.phone,
  }
}

export async function updateProfileByUserId(
  userId: string,
  data: {
    firstName: string | null
    lastName: string | null
    phone: string | null
    address: string | null
    bio: string | null
  },
): Promise<void> {
  const db = await getDb()
  await db.getRepository(User).update(
    { user_id: userId },
    {
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      address: data.address,
      bio: data.bio,
    },
  )
}

export async function getRecentQuizzesByUserId(
  userId: string,
  limit = 3,
): Promise<QuizSummary[]> {
  const db = await getDb()
  const quizzes = await db.getRepository(Quiz).find({
    where: { user_id: userId },
    relations: { animal: true },
    order: { time: 'DESC' },
    take: limit,
  })
  return quizzes.map((quiz) => ({
    quizId: quiz.quiz_id,
    score: quiz.score,
    time: quiz.time.toISOString(),
    animalName: quiz.animal?.animal_name ?? null,
  }))
}
