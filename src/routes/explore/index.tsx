import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/shared/ui/card.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { Button } from '@/shared/ui/button.tsx'
import { getAnimalsFn } from '@/modules/animal/server/animal.functions.ts'
import { animalKeys } from '@/modules/animal/query-keys.ts'

interface ExploreSearch {
  type?: string
  region?: string
  environment?: string
}

export const Route = createFileRoute('/explore/')({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    type: typeof search.type === 'string' ? search.type : undefined,
    region: typeof search.region === 'string' ? search.region : undefined,
    environment:
      typeof search.environment === 'string' ? search.environment : undefined,
  }),
  head: () => ({ meta: [{ title: 'Explore — Extinct Fauna' }] }),
  component: ExplorePage,
})

const TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'unique', label: 'Unique' },
  { value: 'extinct', label: 'Extinct' },
  { value: 'rare', label: 'Rare' },
]
const REGION_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'africa', label: 'Afrika' },
  { value: 'asia', label: 'Asia' },
  { value: 'australia', label: 'Australia' },
  { value: 'europe', label: 'Eropa' },
  { value: 'north america', label: 'Amerika Utara' },
  { value: 'south america', label: 'Amerika Selatan' },
]
const ENVIRONMENT_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'ampibian', label: 'Amfibi' },
  { value: 'aquatic', label: 'Aquatic' },
  { value: 'desert', label: 'Desert' },
  { value: 'forest', label: 'Forest' },
  { value: 'grassland', label: 'Grassland' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'polar', label: 'Polar' },
  { value: 'savanna', label: 'Savanna' },
  { value: 'tundra', label: 'Tundra' },
]

function ExplorePage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const filters = {
    type: search.type ?? '',
    region: search.region ?? '',
    environment: search.environment ?? '',
  }

  const { data, isLoading } = useQuery({
    queryKey: animalKeys.list(filters),
    queryFn: () => getAnimalsFn({ data: filters }),
  })

  const animals = data?.animals ?? []
  const hasFilters = Boolean(filters.type || filters.region || filters.environment)

  return (
    <div>
      <section
        className="flex h-[55vh] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/takahe.jpg)' }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center bg-black/50 px-4 text-center">
          <p className="font-heading text-5xl font-black text-white sm:text-6xl">
            Explore
          </p>
          <p className="mt-3 max-w-xl text-lg text-white/90 text-balance">
            Welcome To Explore, Find Animals Around the World
          </p>
        </div>
      </section>

      <section className="page-wrap py-8">
        <div className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label="Type"
            value={filters.type}
            options={TYPE_OPTIONS}
            onChange={(value) =>
              void navigate({
                search: (prev) => ({ ...prev, type: value }),
                replace: true,
              })
            }
          />
          <FilterSelect
            label="Region"
            value={filters.region}
            options={REGION_OPTIONS}
            onChange={(value) =>
              void navigate({
                search: (prev) => ({ ...prev, region: value }),
                replace: true,
              })
            }
          />
          <FilterSelect
            label="Environment"
            value={filters.environment}
            options={ENVIRONMENT_OPTIONS}
            onChange={(value) =>
              void navigate({
                search: (prev) => ({ ...prev, environment: value }),
                replace: true,
              })
            }
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              disabled={!hasFilters}
              onClick={() =>
                void navigate({
                  search: () => ({ type: '', region: '', environment: '' }),
                  replace: true,
                })
              }
            >
              Reset
            </Button>
          </div>
        </div>
      </section>

      <section className="page-wrap pb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-4xl" />
            ))}
          </div>
        ) : animals.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <Badge variant="secondary">Kosong</Badge>
            <p className="text-muted-foreground">
              Tidak ada hewan yang cocok dengan filter ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {animals.map((animal) => (
              <Card
                key={animal.animal_id}
                className="group overflow-hidden"
              >
                <Link
                  to="/explore/$animalId"
                  params={{ animalId: String(animal.animal_id) }}
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={animal.image ?? '/homie.jpg'}
                      alt={animal.animal_name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
                    <p className="absolute inset-0 flex items-center justify-center px-2 text-center font-heading font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {animal.animal_name}
                    </p>
                  </div>
                  <CardContent className="pt-3">
                    <h3 className="truncate font-heading font-semibold">
                      {animal.animal_name}
                    </h3>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
