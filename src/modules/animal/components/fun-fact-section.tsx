import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent } from '@/shared/ui/card.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { cn } from '@/shared/lib/utils.ts'
import { getRandomAnimalsFn } from '@/modules/animal/server/animal.functions.ts'
import { animalKeys } from '@/modules/animal/query-keys.ts'

export function FunFactSection() {
  const [selected, setSelected] = useState<number | null>(null)
  const { data, isLoading } = useQuery({
    queryKey: animalKeys.random(3),
    queryFn: () => getRandomAnimalsFn({ data: { count: 3 } }),
    staleTime: Infinity,
  })

  const animals = data?.animals ?? []

  return (
    <section className="page-wrap py-14">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Badge variant="secondary">Fun Fact</Badge>
        <h2 className="font-heading text-3xl font-bold">
          Fakta Menarik Seputar Fauna
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Klik salah satu kartu untuk membaca fakta uniknya.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-80 rounded-4xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {animals.map((animal) => {
            const isActive = selected === animal.animal_id
            return (
              <Card
                key={animal.animal_id}
                onClick={() =>
                  setSelected(isActive ? null : animal.animal_id)
                }
                className={cn(
                  'cursor-pointer overflow-hidden transition-all',
                  selected !== null && !isActive && 'opacity-50 blur-[2px]',
                )}
              >
                <img
                  src={animal.image ?? '/homie.jpg'}
                  alt={animal.animal_name}
                  className="h-44 w-full object-cover"
                />
                <CardContent className="flex flex-col gap-2 pt-4">
                  <h3 className="font-heading text-lg font-bold">
                    {animal.animal_name}
                  </h3>
                  <p
                    className={cn(
                      'text-sm text-muted-foreground',
                      isActive ? 'line-clamp-none' : 'line-clamp-3',
                    )}
                  >
                    {animal.fun_fact}
                  </p>
                  {isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 w-fit font-semibold"
                      onClick={(e) => e.stopPropagation()}
                      render={
                        <a href={`/explore/${animal.animal_id}`}>Read More</a>
                      }
                      nativeButton={false}
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
