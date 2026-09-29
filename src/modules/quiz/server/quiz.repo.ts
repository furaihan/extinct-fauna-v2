import { getDb } from '@/lib/typeorm.lib.ts'
import { Question } from '../db/question.entity.ts'
import { Quiz } from '../db/quiz.entity.ts'
import { QuizDetail } from '../db/quiz-detail.entity.ts'
import type { CreateQuizInput } from '../schemas.ts'
import type { QuizQuestion, QuizResult } from '../types.ts'

export async function getFiveRandomQuestions(
  animalId: number,
): Promise<QuizQuestion[]> {
  const db = await getDb()
  const questions = await db
    .getRepository(Question)
    .createQueryBuilder('question')
    .where('question.animal_id = :animalId', { animalId })
    .orderBy('RANDOM()')
    .limit(5)
    .getMany()

  return questions.map((question) => ({
    question_id: question.question_id,
    question: question.question,
    option_1: question.option_1,
    option_2: question.option_2,
    option_3: question.option_3,
    correct_answer: question.correct_answer,
  }))
}

export async function createQuiz(
  userId: string,
  input: CreateQuizInput,
): Promise<{ quizId: string }> {
  const db = await getDb()
  return db.transaction(async (manager) => {
    const quiz = manager.create(Quiz, {
      user_id: userId,
      animal_id: input.animalId,
      score: input.score,
    })
    await manager.save(quiz)

    const details = input.details.map((detail) =>
      manager.create(QuizDetail, {
        quiz_id: quiz.quiz_id,
        question_id: detail.question_id,
        selected_option: detail.selected_option,
        response_time: detail.response_time,
        is_correct: detail.is_correct,
      }),
    )
    await manager.save(details)

    return { quizId: quiz.quiz_id }
  })
}

export async function getQuizResult(
  quizId: string,
): Promise<QuizResult | null> {
  const db = await getDb()
  const quiz = await db.getRepository(Quiz).findOne({
    where: { quiz_id: quizId },
    relations: {
      user: true,
      animal: true,
      details: { question: true },
    },
  })
  if (!quiz) return null

  return {
    quiz_id: quiz.quiz_id,
    animalId: quiz.animal_id,
    score: quiz.score,
    time: quiz.time.toISOString(),
    username: quiz.user?.username ?? null,
    firstName: quiz.user?.first_name ?? null,
    lastName: quiz.user?.last_name ?? null,
    animalName: quiz.animal?.animal_name ?? null,
    details: (quiz.details ?? []).map((detail) => ({
      detail_id: detail.detail_id,
      selected_option: detail.selected_option,
      response_time: detail.response_time,
      is_correct: detail.is_correct,
      question: detail.question?.question ?? '',
    })),
  }
}
