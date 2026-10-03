import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { ArrowLeftIcon, PlayIcon, ShieldCheckIcon } from 'lucide-react'
import { Badge } from '@/shared/ui/badge.tsx'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { Separator } from '@/shared/ui/separator.tsx'
import { PageHero } from '@/shared/components/page-hero.tsx'
import { getAnimalFn } from '@/modules/animal/server/animal.functions.ts'
import { animalKeys } from '@/modules/animal/query-keys.ts'

export const Route = createFileRoute('/explore/$animalId')({
  component: AnimalDetailPage,
})

function AnimalDetailPage() {
  const { animalId } = Route.useParams()
  const id = Number(animalId)
  const { data } = useSuspenseQuery({
    queryKey: animalKeys.detail(id),
    queryFn: () => getAnimalFn({ data: { animalId: id } }),
  })

  const animal = data.animal

  if (!animal) {
    return (
      <div className="page-wrap flex flex-col items-center gap-4 py-24 text-center">
        <Badge variant="destructive">Tidak ditemukan</Badge>
        <p className="text-muted-foreground">
          Hewan dengan ID {animalId} tidak ditemukan.
        </p>
        <Button className="rounded-full font-bold" render={<Link to="/explore" />} nativeButton={false}>
          Kembali ke Jelajahi
        </Button>
      </div>
    )
  }

  const clean = DOMPurify.sanitize(animal.description ?? '')
  const imageUrl = animal.image ? (animal.image.startsWith('/') ? animal.image : `/${animal.image}`) : '/homie.jpg'

  return (
    <div className="flex flex-col">
      <PageHero
        title={animal.animal_name}
        subtitle={
          <span className="flex flex-col gap-1">
            <span className="font-serif italic text-white/90 text-xl">{animal.latin_name}</span>
            <span>{animal.title ?? 'Kenali lebih dekat kisah dan karakteristik satwa ini.'}</span>
          </span>
        }
        bgImage={imageUrl}
        breadcrumb={
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link to="/explore" className="hover:underline">Jelajahi</Link>
            <span>/</span>
            <span className="text-white/60">{animal.animal_name}</span>
          </div>
        }
      />

      <section className="page-wrap grid gap-10 py-16 lg:grid-cols-[1.7fr_1fr]">
        <article
          className="article-body prose dark:prose-invert max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: clean }}
        />

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="rounded-2xl border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheckIcon className="size-5 text-primary" />
                Sekilas Info
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-3">
                <InfoRow label="Nama Ilmiah" value={animal.latin_name || '-'} italic />
                <Separator />
                <InfoRow label="Famili" value={animal.family_name || '-'} />
                <Separator />
                <InfoRow label="Ordo" value={animal.order_name || '-'} />
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                <Button
                  className="w-full font-bold rounded-full h-11"
                  render={
                    <Link to="/quiz/$animalId" params={{ animalId: String(animal.animal_id) }} />
                  }
                  nativeButton={false}
                >
                  <PlayIcon data-icon="inline-start" />
                  Mulai Kuis Satwa Ini
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-semibold rounded-full h-11"
                  render={<Link to="/explore" />}
                  nativeButton={false}
                >
                  <ArrowLeftIcon data-icon="inline-start" />
                  Kembali ke Daftar
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  )
}

function InfoRow({ label, value, italic }: { label: string; value: string; italic?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={`font-medium ${italic ? 'font-serif italic text-base' : ''}`}>{value}</span>
    </div>
  )
}
