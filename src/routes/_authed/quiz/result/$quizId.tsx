import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CheckIcon, RotateCcwIcon, XIcon, TrophyIcon, AwardIcon } from 'lucide-react'
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
        <Button className="rounded-full font-bold" render={<Link to="/explore" />} nativeButton={false}>
          Kembali ke Jelajahi
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
    <div className="page-wrap flex flex-col items-center gap-8 py-16">
      <Card className="w-full max-w-lg rounded-2xl border bg-card shadow-lg text-center p-4">
        <CardHeader className="items-center gap-3">
          <div className="grid size-20 place-items-center rounded-2xl bg-primary/10 text-primary mb-1">
            <TrophyIcon className="size-10" />
          </div>
          <CardTitle className="font-heading text-2xl font-black tracking-tight">
            Selamat, {displayName}!
          </CardTitle>
          <p className="text-muted-foreground text-sm max-w-sm">
            Kamu mendapatkan <strong className="text-foreground">{correct * 20} poin</strong> dari kuis {quiz.animalName ?? 'satwa ini'}.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-2xl bg-primary/10 py-5 border border-primary/20">
              <span className="font-heading text-4xl font-black text-primary">
                {correct}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                Jawaban Benar
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-destructive/10 py-5 border border-destructive/20">
              <span className="font-heading text-4xl font-black text-destructive">
                {wrong}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                Jawaban Salah
              </span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 font-bold rounded-full h-11"
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
              className="flex-1 font-bold rounded-full h-11"
              render={<Link to="/" />}
              nativeButton={false}
            >
              Selesai
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-lg rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <AwardIcon className="size-5 text-primary" />
            Rincian Jawaban
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {quiz.details.map((detail, i) => (
            <div key={detail.detail_id} className="flex flex-col gap-3">
              <div className="flex items-start gap-3.5">
                {detail.is_correct ? (
                  <div className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/20 text-primary mt-0.5">
                    <CheckIcon className="size-3.5" />
                  </div>
                ) : (
                  <div className="grid size-6 shrink-0 place-items-center rounded-full bg-destructive/20 text-destructive mt-0.5">
                    <XIcon className="size-3.5" />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-semibold leading-relaxed">
                    {i + 1}. {detail.question}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {detail.selected_option === 'timeout'
                      ? 'Waktu habis'
                      : `Jawaban dipilih: ${detail.selected_option.replace('option_', 'Opsi ')}`}
                  </p>
                </div>
              </div>
              {i < quiz.details.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
