import { z } from 'zod'

const optionalText = (max: number, min = 0) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => v === '' || v.length >= min, `Minimal ${min} karakter.`)
    .transform((v) => (v === '' ? null : v))

export const updateProfileSchema = z.object({
  firstName: optionalText(30, 2),
  lastName: optionalText(30, 2),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine(
      (v) => v === '' || /^(0|\+62)(\d{8,15})$/.test(v),
      'Nomor telepon tidak valid.',
    )
    .transform((v) => (v === '' ? null : v)),
  address: optionalText(255, 2),
  bio: optionalText(1023, 2),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
