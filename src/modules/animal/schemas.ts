import { z } from 'zod'

export const animalIdSchema = z.object({
  animalId: z.coerce.number().int().positive('ID hewan tidak valid.'),
})

export const animalListSchema = z.object({
  type: z.string().trim().optional(),
  region: z.string().trim().optional(),
  environment: z.string().trim().optional(),
})

export type AnimalListInput = z.infer<typeof animalListSchema>
