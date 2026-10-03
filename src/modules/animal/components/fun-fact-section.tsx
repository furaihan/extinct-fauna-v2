import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent } from '@/shared/ui/card.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { cn } from '@/shared/lib/utils.ts'
import { SectionHeading } from '@/shared/components/section-heading.tsx'
import { getRandomAnimalsFn } from '@/modules/animal/server/animal.functions.ts'
import { animalKeys } from '@/modules/animal/query-keys.ts'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, SparklesIcon } from 'lucide-react'

export function FunFactSection() {
  const [selected, setSelected] = useState<number | null>(null)
  const { data, isLoading } = useQuery({
    queryKey: animalKeys.random(3),
    queryFn: () => getRandomAnimalsFn({ data: { count: 3 } }),
    staleTime: Infinity,
  })

  const animals = data?.animals ?? []

  return (
    <section className="page-wrap py-20">
      <SectionHeading
        eyebrow="Fakta Unik"
        title="Menyelami Keunikan Dunia Satwa"
        description="Klik pada salah satu kartu satwa untuk membuka fakta menarik dan rahasia alam mereka."
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {animals.map((animal) => {
            const isActive = selected === animal.animal_id
            const imageUrl = animal.image ? (animal.image.startsWith('/') ? animal.image : `/${animal.image}`) : '/homie.jpg'

            return (
              <Card
                key={animal.animal_id}
                onClick={() =>
                  setSelected(isActive ? null : animal.animal_id)
                }
                className={cn(
                  'cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-md flex flex-col',
                  isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/40',
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt={animal.animal_name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col justify-between gap-3 p-5">
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-bold tracking-tight">
                      {animal.animal_name}
                    </h3>
                    <p
                      className={cn(
                        'text-sm text-muted-foreground leading-relaxed',
                        isActive ? 'line-clamp-none' : 'line-clamp-3',
                      )}
                    >
                      {animal.fun_fact}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t mt-auto">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <SparklesIcon className="size-3.5" />
                      {isActive ? 'Tutup Fakta' : 'Baca Fakta Unik'}
                    </span>
                    {isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full font-semibold"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        render={
                          <Link to="/explore/$animalId" params={{ animalId: String(animal.animal_id) }}>
                            Detail <ArrowRightIcon data-icon="inline-end" />
                          </Link>
                        }
                        nativeButton={false}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
