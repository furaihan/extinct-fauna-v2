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
  // Salts for password hashing, inherited from the legacy fp-pemrog-web server.
  // Legacy accounts hashed `PREFIX_SALT + password + SUFFIX_SALT`; keep these
  // set so both legacy and new hashes verify through one code path.
  PREFIX_SALT: z.string().default(''),
  SUFFIX_SALT: z.string().default(''),
  // Cost for newly created hashes. Legacy hashes carry their own cost ($2b$10$)
  // and still verify, so this can be raised without breaking old accounts.
  BCRYPT_COST: z.coerce.number().int().min(4).max(31).default(12),
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
