export const quizKeys = {
  all: ['quizzes'] as const,
  questions: (animalId: number) => ['quizzes', 'questions', animalId] as const,
  result: (quizId: string) => ['quizzes', 'result', quizId] as const,
}
