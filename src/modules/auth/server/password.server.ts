// Server-only module. Must only be imported dynamically from inside server-fn handlers.
//
// bcrypt is used for both legacy and new accounts. The cost is embedded in each
// hash (`$2b$<cost>$`), so legacy `$2b$10$` hashes still verify even though new
// ones are created at BCRYPT_COST.
import { env } from '@/lib/env.lib.ts'

function salted(plainText: string): string {
  return env.PREFIX_SALT + plainText + env.SUFFIX_SALT
}

export async function hashPassword(plainText: string): Promise<string> {
  return await Bun.password.hash(salted(plainText), {
    algorithm: 'bcrypt',
    cost: env.BCRYPT_COST,
  })
}

export async function verifyPassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  try {
    return await Bun.password.verify(salted(plainText), hash)
  } catch {
    return false
  }
}
