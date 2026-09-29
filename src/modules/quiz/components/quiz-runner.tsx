import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Progress } from '@/shared/ui/progress.tsx'
import { toast } from '@/shared/ui/toast.tsx'
import { friendlyServerError } from '@/shared/lib/errors.ts'
import { createQuizFn } from '@/modules/quiz/server/quiz.functions.ts'
import type { QuizQuestion } from '@/modules/quiz/types.ts'

const QUESTION_SECONDS = 30

type SelectedOption = 'option_1' | 'option_2' | 'option_3' | 'timeout'

interface Detail {
  question_id: string
  selected_option: SelectedOption
  response_time: number | null
  is_correct: boolean | null
}

interface Props {
  animalId: number
  animalName: string
  questions: QuizQuestion[]
}

export function QuizRunner({ animalId, animalName, questions }: Props) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [details, setDetails] = useState<Detail[]>([])
  const [finished, setFinished] = useState(false)
  const submitted = useRef(false)

  const mutation = useMutation({
    mutationFn: (payload: {
      animalId: number
      score: number
      details: Detail[]
    }) => createQuizFn({ data: payload }),
    onSuccess: async (result) => {
      await navigate({
        to: '/quiz/result/$quizId',
        params: { quizId: result.quizId },
        replace: true,
      })
    },
    onError: (e) => {
      toast.add({
        title: friendlyServerError(e, 'Gagal menyimpan kuis.'),
        type: 'error',
      })
      setFinished(false)
    },
  })

  const handleAnswer = useCallback(
    (selected: SelectedOption, responseTime: number | null) => {
      const question = questions[index]
      if (!question) return
      const isCorrect =
        selected === 'timeout' ? null : question.correct_answer === selected
      setDetails((prev) => [
        ...prev,
        {
          question_id: question.question_id,
          selected_option: selected,
          response_time: responseTime,
          is_correct: isCorrect,
        },
      ])
      if (isCorrect) setScore((prev) => prev + 1)
      if (index + 1 >= questions.length) setFinished(true)
      else setIndex((prev) => prev + 1)
    },
    [index, questions],
  )

  const { mutate } = mutation
  useEffect(() => {
    if (!finished || submitted.current) return
    if (details.length !== questions.length) return
    submitted.current = true
    mutate({ animalId, score, details })
  }, [finished, details, questions.length, score, animalId, mutate])

  if (questions.length === 0) {
    return (
      <div className="page-wrap flex flex-col items-center gap-3 py-24 text-center">
        <Badge variant="secondary">Belum tersedia</Badge>
        <p className="text-muted-foreground">
          Pertanyaan untuk {animalName} belum tersedia.
        </p>
        <Button render={<a href="/explore">Kembali</a>} nativeButton={false}>
          Kembali ke Explore
        </Button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="page-wrap flex flex-col items-center gap-3 py-24 text-center">
        <Progress value={100} className="w-full max-w-xs" />
        <p className="text-muted-foreground">Menyimpan hasil kuis…</p>
      </div>
    )
  }

  const question = questions[index]

  return (
    <div className="page-wrap flex flex-col items-center gap-6 py-10">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Badge variant="secondary">
          {index + 1}/{questions.length}
        </Badge>
        <Badge>{animalName}</Badge>
      </div>
      <QuestionCard
        key={index}
        question={question}
        onAnswer={handleAnswer}
        total={questions.length}
      />
    </div>
  )
}

function QuestionCard({
  question,
  onAnswer,
  total,
}: {
  question: QuizQuestion
  onAnswer: (selected: SelectedOption, responseTime: number | null) => void
  total: number
}) {
  const [timer, setTimer] = useState(QUESTION_SECONDS)

  useEffect(() => {
    if (timer <= 0) {
      onAnswer('timeout', null)
      return
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer, onAnswer])

  const progress = ((QUESTION_SECONDS - timer) / QUESTION_SECONDS) * 100

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="items-center gap-4 text-center">
        <div
          className={
            'grid size-16 place-items-center rounded-full border-4 font-heading text-2xl font-bold ' +
            (timer <= 10
              ? 'border-destructive text-destructive'
              : 'border-primary text-primary')
          }
        >
          {timer < 10 ? `0${timer}` : timer}
        </div>
        <Progress value={progress} className="w-full" />
        <CardTitle className="text-xl text-balance">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {(['option_1', 'option_2', 'option_3'] as const).map((option, i) => (
          <Button
            key={option}
            variant="outline"
            className="h-auto min-h-12 w-full justify-start whitespace-normal py-3 text-left text-base font-medium"
            onClick={() => onAnswer(option, QUESTION_SECONDS - timer)}
          >
            <span className="mr-2 font-bold text-primary">{i + 1}.</span>
            {question[option]}
          </Button>
        ))}
        <p className="text-center text-xs text-muted-foreground">
          Soal {total} · jawaban tidak bisa diubah
        </p>
      </CardContent>
    </Card>
  )
}
