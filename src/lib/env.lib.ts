import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  ADMIN_USERNAME: z.string().min(1).default('admin'),
  ADMIN_PASSWORD: z.string().min(1).default('admin12345'),
  // Legacy-only salts for pre-migration bcrypt hashes (PREFIX_SALT + password + SUFFIX_SALT).
  // Kept solely to verify old accounts that have not logged in yet.
  PREFIX_SALT: z.string().default(''),
  SUFFIX_SALT: z.string().default(''),
  // Argon2id parameters for newly created hashes.
  ARGON2_MEMORY_COST: z.coerce.number().int().min(1024).default(65536), // 64 MiB
  ARGON2_TIME_COST: z.coerce.number().int().min(1).default(3),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format())
  process.exit(1)
}

export const env = parsed.data
