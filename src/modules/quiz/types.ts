export interface QuizQuestion {
  question_id: string
  question: string
  option_1: string
  option_2: string
  option_3: string
  correct_answer: 'option_1' | 'option_2' | 'option_3' | null
}

export interface QuizResultDetail {
  detail_id: string
  selected_option: string
  response_time: number | null
  is_correct: boolean | null
  question: string
}

export interface QuizResult {
  quiz_id: string
  animalId: number
  score: number
  time: string
  username: string | null
  firstName: string | null
  lastName: string | null
  animalName: string | null
  details: QuizResultDetail[]
}
