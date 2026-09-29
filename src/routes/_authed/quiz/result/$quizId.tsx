import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CheckIcon, RotateCcwIcon, XIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Separator } from '@/shared/ui/separator.tsx'
import { getQuizResultFn } from '@/modules/quiz/server/quiz.functions.ts'
import { quizKeys } from '@/modules/quiz/query-keys.ts'

export const Route = createFileRoute('/_authed/quiz/result/$quizId')({
  component: QuizResultPage,
})

function QuizResultPage() {
  const { quizId } = Route.useParams()
  const { data } = useSuspenseQuery({
    queryKey: quizKeys.result(quizId),
    queryFn: () => getQuizResultFn({ data: { quizId } }),
  })

  const quiz = data.quiz

  if (!quiz) {
    return (
      <div className="page-wrap flex flex-col items-center gap-3 py-24 text-center">
        <Badge variant="destructive">Tidak ditemukan</Badge>
        <p className="text-muted-foreground">Hasil kuis tidak ditemukan.</p>
        <Button render={<Link to="/explore" />} nativeButton={false}>
          Kembali
        </Button>
      </div>
    )
  }

  const total = quiz.details.length
  const correct = quiz.score
  const wrong = Math.max(total - correct, 0)
  const displayName =
    [quiz.firstName, quiz.lastName].filter(Boolean).join(' ') ||
    quiz.username ||
    'Sobat Fauna'

  return (
    <div className="page-wrap flex flex-col items-center gap-6 py-12">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <img src="/ikon quiz.svg" alt="ikon" className="size-24" />
          <CardTitle className="text-2xl font-black">
            Selamat, {displayName}!
          </CardTitle>
          <p className="text-muted-foreground">
            Kamu mendapatkan {correct * 20} poin untuk {quiz.animalName ?? 'hewan ini'}.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center rounded-2xl bg-primary/10 py-4">
              <span className="font-heading text-3xl font-black text-primary">
                {correct}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Benar
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-destructive/10 py-4">
              <span className="font-heading text-3xl font-black text-destructive">
                {wrong}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Salah
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1 font-bold"
              render={
                <Link
                  to="/quiz/$animalId"
                  params={{ animalId: String(quiz.animalId) }}
                />
              }
              nativeButton={false}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Main Lagi
            </Button>
            <Button
              variant="outline"
              className="flex-1 font-bold"
              render={<Link to="/" />}
              nativeButton={false}
            >
              Selesai
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg">Rincian Jawaban</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {quiz.details.map((detail, i) => (
            <div key={detail.detail_id}>
              <div className="flex items-start gap-3">
                {detail.is_correct ? (
                  <CheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                ) : (
                  <XIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {i + 1}. {detail.question}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {detail.selected_option === 'timeout'
                      ? 'Waktu habis'
                      : `Jawaban: ${detail.selected_option.replace('option_', 'Opsi ')}`}
                  </p>
                </div>
              </div>
              {i < quiz.details.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
