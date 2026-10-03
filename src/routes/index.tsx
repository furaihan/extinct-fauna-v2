import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, PawPrintIcon, SparklesIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent } from '@/shared/ui/card.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { SectionHeading } from '@/shared/components/section-heading.tsx'
import { AnimalCard } from '@/modules/animal/components/animal-card.tsx'
import { FunFactSection } from '@/modules/animal/components/fun-fact-section.tsx'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Extinct Fauna — Jelajahi & Selamatkan' }],
  }),
  component: HomePage,
})

const STATS = [
  { value: '42.100+', label: 'Spesies Terdokumentasi Global' },
  { value: '2.380+', label: 'Wilayah Endemik Asia' },
  { value: '586', label: 'Catatan Konservasi Indonesia' },
]

function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Editorial Hero */}
      <section className="relative flex min-h-[min(85svh,760px)] items-center justify-start overflow-hidden">
        <img
          src="/takahe.jpg"
          alt="Takahe"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="page-wrap relative z-10 flex w-full flex-col items-start gap-6 py-20 text-white">
          <Badge variant="secondary" className="bg-white/15 text-white backdrop-blur-md border-white/20 rounded-full font-medium">
            <SparklesIcon className="size-3.5 mr-1.5" />
            Pusat Edukasi & Konservasi Fauna
          </Badge>
          <h1 className="font-heading text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl text-balance max-w-4xl leading-[1.1]">
            Melestarikan Ingatan, Melindungi Kehidupan yang Tersisa.
          </h1>
          <p className="max-w-xl text-lg text-white/90 text-balance font-normal leading-relaxed">
            Kenali fauna langka dan punah di seluruh dunia, pelajari kisah mereka, dan uji pengetahuanmu lewat kuis interaktif.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              className="rounded-full font-bold px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              render={<Link to="/explore" />}
              nativeButton={false}
            >
              Jelajahi Hewan
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full font-semibold px-8 text-base border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md"
              render={<Link to="/explore" />}
              nativeButton={false}
            >
              Mulai Kuis
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Fun Facts */}
      <FunFactSection />

      {/* 3. Editorial Quote */}
      <section className="bg-primary px-4 py-20 text-white text-left relative overflow-hidden">
        <div className="page-wrap max-w-4xl relative z-10">
          <p className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl text-balance leading-snug">
            “Kemegahan Bumi menjadi semakin indah berkat keragaman satwa dan tumbuhan. Lestarikan mereka, jaga keindahan alam, dan selamatkan masa depan kehidupan!”
          </p>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-white/80">
            Prinsip Konservasi Global
          </p>
        </div>
      </section>

      {/* 4. Focus Species */}
      <section className="page-wrap py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <SectionHeading
            eyebrow="Fokus Utama"
            title="Spesies yang Membutuhkan Perhatian"
            description="Beberapa hewan langka dan terancam punah yang menjadi sorotan penting konservasi saat ini."
            align="left"
          />
          <Button
            variant="outline"
            className="rounded-full w-fit font-semibold"
            render={<Link to="/explore" />}
            nativeButton={false}
          >
            Lihat Semua Spesies
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        <FocusAnimalsGrid />
      </section>

      {/* 5. Stats Section */}
      <section className="bg-muted/50 py-20 border-y">
        <div className="page-wrap">
          <SectionHeading
            title="Statistik Ancaman Satwa"
            description="Data perkiraan populasi dan sebaran wilayah satwa terancam berdasarkan catatan konservasi dunia."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <Card key={stat.label} className="rounded-2xl border bg-card/60 backdrop-blur p-8 text-center shadow-sm">
                <CardContent className="flex flex-col items-center gap-2 p-0">
                  <span className="font-heading text-4xl font-black text-primary sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quiz Teaser */}
      <QuizTeaserSection />
    </div>
  )
}

function FocusAnimalsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['home-focus-animals'],
    queryFn: () =>
      import('@/modules/animal/server/animal.functions.ts').then((m) =>
        m.getRandomAnimalsFn({ data: { count: 3 } }),
      ),
  })

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
    )
  }

  const animals = data?.animals ?? []

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {animals.map((animal) => (
        <AnimalCard key={animal.animal_id} animal={animal} />
      ))}
    </div>
  )
}

function QuizTeaserSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['home-quiz-teaser'],
    queryFn: () =>
      import('@/modules/quiz/server/quiz.functions.ts').then((m) =>
        m.getQuizTeaserFn(),
      ),
  })

  return (
    <section className="page-wrap py-20">
      <SectionHeading
        eyebrow="Uji Pemahaman"
        title="Tantang Pengetahuan Konservasimu"
        description="Pilih hewan favoritmu dan selesaikan 5 pertanyaan uji cepat dalam waktu 30 detik per soal."
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.animals ?? []).map((animal) => (
            <AnimalCard key={animal.animal_id} animal={animal} />
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full font-semibold px-8"
          render={<Link to="/explore" />}
          nativeButton={false}
        >
          <PawPrintIcon data-icon="inline-start" />
          Jelajahi Semua Hewan & Kuis
        </Button>
      </div>
    </section>
  )
}
