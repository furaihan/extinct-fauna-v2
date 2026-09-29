import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { ArrowLeftIcon } from 'lucide-react'
import { Badge } from '@/shared/ui/badge.tsx'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
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
        <Button render={<Link to="/explore" />} nativeButton={false}>
          Kembali ke Explore
        </Button>
      </div>
    )
  }

  const clean = DOMPurify.sanitize(animal.description ?? '')

  return (
    <div>
      <section
        className="flex h-[60vh] items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(/${animal.image ?? 'homie.jpg'})`,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center bg-black/50 px-4 text-center">
          <p className="font-heading text-4xl font-black text-white sm:text-6xl">
            {animal.animal_name}
          </p>
          <p className="mt-3 max-w-xl text-white/85 text-balance">
            {animal.title ?? 'Kenali lebih dekat hewan ini.'}
          </p>
        </div>
      </section>

      <section className="page-wrap grid gap-8 py-12 lg:grid-cols-[1.7fr_1fr]">
        <article
          className="article-body"
          dangerouslySetInnerHTML={{ __html: clean }}
        />

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <p className="italic text-muted-foreground">{animal.latin_name}</p>
              <div className="flex flex-col gap-2">
                <p>
                  <span className="font-semibold">Family:</span>{' '}
                  {animal.family_name}
                </p>
                <p>
                  <span className="font-semibold">Order:</span>{' '}
                  {animal.order_name ?? '-'}
                </p>
                <p>
                  <span className="font-semibold">Estimated in the wild:</span>{' '}
                  Unknown
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-2"
                render={<Link to="/explore" />}
                nativeButton={false}
              >
                <ArrowLeftIcon data-icon="inline-start" />
                Kembali
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  )
}
