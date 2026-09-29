import { createServerFn } from '@tanstack/react-start'
import { toAppError } from '@/shared/lib/to-app-error.ts'
import { authMiddleware } from '@/modules/auth/server/auth.middleware.ts'
import {
  createQuizSchema,
  quizAnimalIdSchema,
  quizIdSchema,
} from '../schemas.ts'
import {
  createQuiz,
  getFiveRandomQuestions,
  getQuizResult,
} from './quiz.repo.ts'

export const getQuizQuestionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(quizAnimalIdSchema)
  .handler(async ({ data }) => {
    try {
      const questions = await getFiveRandomQuestions(data.animalId)
      return { questions }
    } catch (e) {
      throw toAppError(e, 'Gagal memuat pertanyaan kuis.')
    }
  })

export const createQuizFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createQuizSchema)
  .handler(async ({ context, data }) => {
    try {
      const result = await createQuiz(context.userId, data)
      return { quizId: result.quizId }
    } catch (e) {
      throw toAppError(e, 'Gagal menyimpan kuis.')
    }
  })

export const getQuizTeaserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const { getAnimals } = await import(
        '@/modules/animal/server/animal.repo.ts'
      )
      const animals = await getAnimals()
      return { animals: animals.slice(0, 6) }
    } catch (e) {
      throw toAppError(e, 'Gagal memuat daftar hewan.')
    }
  },
)

export const getQuizResultFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(quizIdSchema)
  .handler(async ({ data }) => {
    try {
      const quiz = await getQuizResult(data.quizId)
      return { quiz }
    } catch (e) {
      throw toAppError(e, 'Gagal memuat hasil kuis.')
    }
  })
