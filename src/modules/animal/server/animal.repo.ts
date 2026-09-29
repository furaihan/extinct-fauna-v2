import { getDb } from '@/lib/typeorm.lib.ts'
import { Animal } from '../db/animal.entity.ts'
import type { AnimalDetail, AnimalListItem, RandomAnimalFact } from '../types.ts'
import type { AnimalListInput } from '../schemas.ts'

/** Legacy image values are bare filenames (e.g. "pikachu.jpg"). */
export function imageUrl(image: string | null): string | null {
  if (!image) return null
  if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) return image
  return `/${image}`
}

const TYPE_MAP: Record<string, string> = {
  unique: 'unique',
  extinct: 'extinct',
  rare: 'rare',
}
const ORIGIN_MAP: Record<string, string> = {
  africa: 'africa',
  asia: 'asia',
  australia: 'australia',
  europe: 'europe',
  'north america': 'north america',
  'south america': 'south america',
}
const ENVIRONMENT_MAP: Record<string, string> = {
  ampibian: 'ampibian',
  aquatic: 'aquatic',
  desert: 'desert',
  forest: 'forest',
  grassland: 'grassland',
  mountain: 'mountain',
  polar: 'polar',
  savanna: 'savanna',
  tundra: 'tundra',
}

export async function getAnimals(
  filters: AnimalListInput = {},
): Promise<AnimalListItem[]> {
  const db = await getDb()
  const qb = db
    .getRepository(Animal)
    .createQueryBuilder('animal')
    .leftJoinAndSelect('animal.description', 'description')
    .orderBy('animal.animal_id', 'ASC')

  const type = filters.type ? TYPE_MAP[filters.type.toLowerCase()] : undefined
  const region = filters.region ? ORIGIN_MAP[filters.region.toLowerCase()] : undefined
  const environment = filters.environment
    ? ENVIRONMENT_MAP[filters.environment.toLowerCase()]
    : undefined

  if (type) qb.andWhere('animal.animal_type = :type', { type })
  if (region) qb.andWhere('animal.animal_origin = :region', { region })
  if (environment) {
    qb.andWhere('animal.animal_environment = :environment', { environment })
  }

  const animals = await qb.getMany()
  return animals.map((animal) => ({
    animal_id: animal.animal_id,
    animal_name: animal.animal_name,
    image: imageUrl(animal.description?.image ?? null),
  }))
}

export async function getAnimalById(
  animalId: number,
): Promise<AnimalDetail | null> {
  const db = await getDb()
  const animal = await db.getRepository(Animal).findOne({
    where: { animal_id: animalId },
    relations: { description: true },
  })
  if (!animal) return null
  return {
    animal_id: animal.animal_id,
    animal_name: animal.animal_name,
    latin_name: animal.latin_name,
    family_name: animal.family_name,
    order_name: animal.order_name,
    image: imageUrl(animal.description?.image ?? null),
    description: animal.description?.description ?? null,
    title: animal.description?.title ?? null,
  }
}

export async function getRandomAnimalsWithFunFact(
  count: number,
): Promise<RandomAnimalFact[]> {
  const db = await getDb()
  const animals = await db
    .getRepository(Animal)
    .createQueryBuilder('animal')
    .innerJoinAndSelect('animal.description', 'description')
    .where('description.fun_fact IS NOT NULL')
    .orderBy('RANDOM()')
    .limit(count)
    .getMany()

  return animals.map((animal) => ({
    animal_id: animal.animal_id,
    animal_name: animal.animal_name,
    image: imageUrl(animal.description?.image ?? null),
    fun_fact: animal.description?.fun_fact ?? null,
  }))
}
