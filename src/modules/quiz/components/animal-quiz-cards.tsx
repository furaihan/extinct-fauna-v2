import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent } from '@/shared/ui/card.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { getRandomAnimalsFn } from '@/modules/animal/server/animal.functions.ts'
import { animalKeys } from '@/modules/animal/query-keys.ts'

interface Props {
  count?: number
  hidePlay?: boolean
}

export function AnimalQuizCards({ count = 3, hidePlay = false }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: animalKeys.random(count),
    queryFn: () => getRandomAnimalsFn({ data: { count } }),
    staleTime: Infinity,
  })

  const animals = data?.animals ?? []

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-4xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {animals.map((animal) => (
        <Card key={animal.animal_id} className="overflow-hidden">
          <Link
            to="/explore/$animalId"
            params={{ animalId: String(animal.animal_id) }}
            className="block"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={animal.image ?? '/homie.jpg'}
                alt={animal.animal_name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  {animal.animal_name}
                </h3>
              </div>
            </div>
          </Link>
          {!hidePlay && (
            <CardContent className="pt-4">
              <Button
                className="w-full font-bold"
                render={
                  <Link
                    to="/quiz/$animalId"
                    params={{ animalId: String(animal.animal_id) }}
                  />
                }
                nativeButton={false}
              >
                Play
              </Button>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
