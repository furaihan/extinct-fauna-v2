import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { QuizRunner } from '@/modules/quiz/components/quiz-runner.tsx'
import { getQuizQuestionsFn } from '@/modules/quiz/server/quiz.functions.ts'
import { quizKeys } from '@/modules/quiz/query-keys.ts'
import { getAnimalFn } from '@/modules/animal/server/animal.functions.ts'
import { animalKeys } from '@/modules/animal/query-keys.ts'

export const Route = createFileRoute('/_authed/quiz/$animalId')({
  component: QuizPage,
})

function QuizPage() {
  const { animalId } = Route.useParams()
  const id = Number(animalId)
  const { data: animalData } = useSuspenseQuery({
    queryKey: animalKeys.detail(id),
    queryFn: () => getAnimalFn({ data: { animalId: id } }),
  })
  const { data } = useSuspenseQuery({
    queryKey: quizKeys.questions(id),
    queryFn: () => getQuizQuestionsFn({ data: { animalId: id } }),
    staleTime: 0,
  })

  return (
    <QuizRunner
      animalId={id}
      animalName={animalData.animal?.animal_name ?? 'Hewan'}
      questions={data.questions}
    />
  )
}
