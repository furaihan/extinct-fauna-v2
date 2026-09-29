import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { toAppError } from '@/shared/lib/to-app-error.ts'
import { animalIdSchema, animalListSchema } from '../schemas.ts'
import {
  getAnimalById,
  getAnimals,
  getRandomAnimalsWithFunFact,
} from './animal.repo.ts'

export const getAnimalsFn = createServerFn({ method: 'GET' })
  .validator(animalListSchema)
  .handler(async ({ data }) => {
    try {
      const animals = await getAnimals(data)
      return { animals }
    } catch (e) {
      throw toAppError(e, 'Gagal memuat daftar hewan.')
    }
  })

export const getAnimalFn = createServerFn({ method: 'GET' })
  .validator(animalIdSchema)
  .handler(async ({ data }) => {
    try {
      const animal = await getAnimalById(data.animalId)
      return { animal }
    } catch (e) {
      throw toAppError(e, 'Gagal memuat detail hewan.')
    }
  })

export const getRandomAnimalsFn = createServerFn({ method: 'GET' })
  .validator(z.object({ count: z.coerce.number().int().min(1).max(12).default(3) }))
  .handler(async ({ data }) => {
    try {
      const animals = await getRandomAnimalsWithFunFact(data.count)
      return { animals }
    } catch (e) {
      throw toAppError(e, 'Gagal memuat fakta hewan.')
    }
  })
