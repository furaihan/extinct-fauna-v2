import { z } from 'zod'

export const quizAnimalIdSchema = z.object({
  animalId: z.coerce.number().int().positive('ID hewan tidak valid.'),
})

export const quizIdSchema = z.object({
  quizId: z.string().uuid('ID kuis tidak valid.'),
})

export const quizDetailSchema = z.object({
  question_id: z.string().uuid(),
  selected_option: z.enum(['option_1', 'option_2', 'option_3', 'timeout']),
  response_time: z.number().int().nullable(),
  is_correct: z.boolean().nullable(),
})

export const createQuizSchema = z.object({
  animalId: z.coerce.number().int().positive('ID hewan tidak valid.'),
  score: z.number().int().min(0).max(5),
  details: z.array(quizDetailSchema).min(1).max(5),
})

export type CreateQuizInput = z.infer<typeof createQuizSchema>
