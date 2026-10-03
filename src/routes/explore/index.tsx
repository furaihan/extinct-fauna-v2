import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { Button } from '@/shared/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select.tsx'
import { PageHero } from '@/shared/components/page-hero.tsx'
import { AnimalCard } from '@/modules/animal/components/animal-card.tsx'
import { getAnimalsFn } from '@/modules/animal/server/animal.functions.ts'
import { animalKeys } from '@/modules/animal/query-keys.ts'
import { SearchXIcon, RotateCcwIcon } from 'lucide-react'

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
  head: () => ({ meta: [{ title: 'Jelajahi Fauna — Extinct Fauna' }] }),
  component: ExplorePage,
})

const TYPE_OPTIONS = [
  { value: '', label: 'Semua Jenis' },
  { value: 'unique', label: 'Unik' },
  { value: 'extinct', label: 'Punah' },
  { value: 'rare', label: 'Langka' },
]
const REGION_OPTIONS = [
  { value: '', label: 'Semua Wilayah' },
  { value: 'africa', label: 'Afrika' },
  { value: 'asia', label: 'Asia' },
  { value: 'australia', label: 'Australia' },
  { value: 'europe', label: 'Eropa' },
  { value: 'north america', label: 'Amerika Utara' },
  { value: 'south america', label: 'Amerika Selatan' },
]
const ENVIRONMENT_OPTIONS = [
  { value: '', label: 'Semua Habitat' },
  { value: 'ampibian', label: 'Amfibi' },
  { value: 'aquatic', label: 'Akuatik' },
  { value: 'desert', label: 'Gurun' },
  { value: 'forest', label: 'Hutan' },
  { value: 'grassland', label: 'Padang Rumput' },
  { value: 'mountain', label: 'Pegunungan' },
  { value: 'polar', label: 'Polar' },
  { value: 'savanna', label: 'Sabana' },
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
    <div className="flex flex-col">
      <PageHero
        title="Jelajahi Satwa Dunia"
        subtitle="Temukan arsip lengkap berbagai fauna langka, unik, dan yang telah punah dari seluruh penjuru bumi."
        bgImage="/takahe.jpg"
      />

      <section className="page-wrap py-8">
        <div className="grid gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4 items-end">
          <FilterSelect
            label="Kategori Jenis"
            value={filters.type}
            options={TYPE_OPTIONS}
            onChange={(value) =>
              void navigate({
                search: (prev) => ({ ...prev, type: value === 'all' ? '' : value }),
                replace: true,
              })
            }
          />
          <FilterSelect
            label="Wilayah Asal"
            value={filters.region}
            options={REGION_OPTIONS}
            onChange={(value) =>
              void navigate({
                search: (prev) => ({ ...prev, region: value === 'all' ? '' : value }),
                replace: true,
              })
            }
          />
          <FilterSelect
            label="Habitat / Lingkungan"
            value={filters.environment}
            options={ENVIRONMENT_OPTIONS}
            onChange={(value) =>
              void navigate({
                search: (prev) => ({ ...prev, environment: value === 'all' ? '' : value }),
                replace: true,
              })
            }
          />
          <div>
            <Button
              variant="outline"
              className="w-full rounded-full font-semibold h-11"
              disabled={!hasFilters}
              onClick={() =>
                void navigate({
                  search: () => ({ type: '', region: '', environment: '' }),
                  replace: true,
                })
              }
            >
              <RotateCcwIcon data-icon="inline-start" />
              Atur Ulang Filter
            </Button>
          </div>
        </div>
      </section>

      <section className="page-wrap pb-20">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            Menampilkan <strong className="text-foreground">{animals.length}</strong> spesies satwa
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : animals.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <SearchXIcon className="size-8" />
            </div>
            <h3 className="font-heading text-xl font-bold">Tidak ada satwa yang cocok</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Coba ubah kriteria filter wilayah atau kategori untuk menemukan hasil lainnya.
            </p>
            <Button
              variant="outline"
              className="mt-2 rounded-full font-semibold"
              onClick={() =>
                void navigate({
                  search: () => ({ type: '', region: '', environment: '' }),
                  replace: true,
                })
              }
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {animals.map((animal) => (
              <AnimalCard key={animal.animal_id} animal={animal} />
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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={(val) => onChange(val ?? '')}>
        <SelectTrigger className="w-full rounded-xl h-11 bg-background">
          <SelectValue placeholder="Pilih..." />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {options.map((option) => (
            <SelectItem key={option.value || 'all'} value={option.value || 'all'} className="rounded-xl">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
