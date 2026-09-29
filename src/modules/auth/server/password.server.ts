// Server-only module. Must only be imported dynamically from inside server-fn handlers.

export async function hashPassword(plainText: string): Promise<string> {
  return await Bun.password.hash(plainText, {
    algorithm: 'argon2id',
  })
}

export async function verifyPassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  try {
    return await Bun.password.verify(plainText, hash)
  } catch {
    return false
  }
}
