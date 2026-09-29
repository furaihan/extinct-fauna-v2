import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, ChevronDownIcon, PawPrintIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent } from '@/shared/ui/card.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { HeroSlider } from '@/shared/components/hero-slider.tsx'
import { AnimalQuizCards } from '@/modules/quiz/components/animal-quiz-cards.tsx'
import { FunFactSection } from '@/modules/animal/components/fun-fact-section.tsx'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Extinct Fauna — Jelajahi & Selamatkan' }],
  }),
  component: HomePage,
})

const STATS = [
  { value: '42.100', label: 'Dunia' },
  { value: '2.380', label: 'Asia' },
  { value: '586', label: 'Indonesia' },
]

function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSlider />
      <FunFactSection />
      <QuoteSection />
      <FocusSection />
      <StatsSection />
      <QuizTeaser />
    </div>
  )
}

function QuoteSection() {
  return (
    <section className="bg-primary px-4 py-16 text-center">
      <p className="mx-auto max-w-3xl text-lg font-medium text-primary-foreground text-balance sm:text-xl">
        The splendor of the Earth is made more beautiful by the variety of
        animals and plants. Preserve them, preserve the beauty of the earth,
        preserve life!
      </p>
    </section>
  )
}

function FocusSection() {
  return (
    <section className="page-wrap py-14">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Badge variant="secondary">Our Focus</Badge>
        <h2 className="font-heading text-3xl font-bold">
          Spesies yang Jadi Fokus Kami
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Beberapa hewan langka dan punah yang perlu kita kenali dan lindungi.
        </p>
      </div>
      <AnimalQuizCards count={3} hidePlay />
    </section>
  )
}

function StatsSection() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="page-wrap text-center">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          Perkiraan Jumlah Hewan Terancam
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STATS.map((stat) => (
            <Card key={stat.label} className="py-8">
              <CardContent className="flex flex-col items-center gap-1">
                <span className="font-heading text-4xl font-black text-primary sm:text-5xl">
                  {stat.value}
                </span>
                <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuizTeaser() {
  const { data, isLoading } = useQuery({
    queryKey: ['home-quiz-teaser'],
    queryFn: () =>
      import('@/modules/quiz/server/quiz.functions.ts').then((m) =>
        m.getQuizTeaserFn(),
      ),
  })

  return (
    <section className="page-wrap py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Badge>
          <PawPrintIcon />
          Quiz
        </Badge>
        <h2 className="font-heading text-3xl font-bold">
          Uji Pengetahuanmu
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Pilih hewan dan jawab 5 pertanyaan. Setiap pertanyaan punya waktu 30
          detik.
        </p>
      </div>
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 rounded-4xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.animals ?? []).map((animal) => (
            <Card key={animal.animal_id} className="overflow-hidden">
              <img
                src={animal.image ?? '/homie.jpg'}
                alt={animal.animal_name}
                className="h-48 w-full object-cover"
              />
              <CardContent className="flex flex-col gap-3 pt-4">
                <h3 className="font-heading text-lg font-bold">
                  {animal.animal_name}
                </h3>
                <Button
                  className="w-full font-bold"
                  render={<Link to="/quiz/$animalId" params={{ animalId: String(animal.animal_id) }} />}
                  nativeButton={false}
                >
                  Main Quiz
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-10 flex justify-center">
        <Button variant="outline" render={<Link to="/explore" />} nativeButton={false}>
          <ChevronDownIcon data-icon="inline-start" />
          Jelajahi Semua Hewan
        </Button>
      </div>
    </section>
  )
}
