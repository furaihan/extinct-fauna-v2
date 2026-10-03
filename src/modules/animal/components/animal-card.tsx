import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card.tsx'
import { Button } from '@/shared/ui/button.tsx'
import { Badge } from '@/shared/ui/badge.tsx'

interface AnimalCardProps {
  animal: {
    animal_id: number
    animal_name: string
    latin_name?: string
    image?: string | null
    type?: string
  }
  showQuizButton?: boolean
}

export function AnimalCard({ animal, showQuizButton = true }: AnimalCardProps) {
  const imageUrl = animal.image ? (animal.image.startsWith('/') ? animal.image : `/${animal.image}`) : '/homie.jpg'

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/50 hover:shadow-lg focus-within:border-primary/50 focus-within:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={animal.animal_name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {animal.type && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur font-medium capitalize">
              {animal.type}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 right-3 grid size-8 place-items-center rounded-full bg-black/60 text-white opacity-60 backdrop-blur transition-opacity group-hover:opacity-100 z-10">
          <ArrowUpRightIcon className="size-4" />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-1">
          <h3 className="font-heading text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
            <Link
              to="/explore/$animalId"
              params={{ animalId: String(animal.animal_id) }}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {animal.animal_name}
            </Link>
          </h3>
          {animal.latin_name && (
            <p className="font-serif italic text-xs text-muted-foreground">
              {animal.latin_name}
            </p>
          )}
        </div>

        {showQuizButton && (
          <Button
            className="relative z-10 w-full font-bold rounded-full"
            render={
              <Link
                to="/quiz/$animalId"
                params={{ animalId: String(animal.animal_id) }}
              />
            }
            nativeButton={false}
          >
            Mulai Kuis
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
