// Server-only module. Must only be imported dynamically from inside server-fn handlers.
//
// New accounts are hashed using argon2id. Legacy bcrypt accounts are verified
// using legacy prefix/suffix salts, and are transparently rehashed to argon2id
// upon successful login.
import { env } from '@/lib/env.lib.ts'

function salted(plainText: string): string {
  return env.PREFIX_SALT + plainText + env.SUFFIX_SALT
}

export async function hashPassword(plainText: string): Promise<string> {
  return await Bun.password.hash(plainText, {
    algorithm: 'argon2id',
    memoryCost: env.ARGON2_MEMORY_COST,
    timeCost: env.ARGON2_TIME_COST,
  })
}

export async function verifyPassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  try {
    if (hash.startsWith('$argon2')) {
      return await Bun.password.verify(plainText, hash)
    }
    if (
      hash.startsWith('$2a$') ||
      hash.startsWith('$2b$') ||
      hash.startsWith('$2y$')
    ) {
      return await Bun.password.verify(salted(plainText), hash)
    }
    return false
  } catch {
    return false
  }
}

export function passwordNeedsRehash(hash: string): boolean {
  if (!hash.startsWith('$argon2id$')) {
    return true
  }

  // Optional: check if argon2id params are lower than current env standards
  // Format: $argon2id$v=19$m=65536,t=3,p=1$...
  try {
    const parts = hash.split('$')
    if (parts.length < 4) return true
    const paramsPart = parts[3]
    const params = Object.fromEntries(
      paramsPart.split(',').map((p) => p.split('=')),
    )
    const m = Number(params['m'])
    const t = Number(params['t'])

    if (
      m < env.ARGON2_MEMORY_COST ||
      t < env.ARGON2_TIME_COST
    ) {
      return true
    }
  } catch {
    return false
  }

  return false
}
