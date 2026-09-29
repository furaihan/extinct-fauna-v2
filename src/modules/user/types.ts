export interface UserProfile {
  userId: string
  username: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  bio: string | null
  address: string | null
  phone: string | null
}

export interface QuizSummary {
  quizId: string
  score: number
  time: string
  animalName: string | null
}
