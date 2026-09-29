import { logger } from '@/lib/logger.lib.ts'
import { AppError } from './app-error.ts'

export function toAppError(e: unknown, fallback: string): Error {
  // Expected domain errors surface to the client as-is and are not faults.
  if (e instanceof AppError) {
    logger.debug({ err: e.message }, fallback)
    return new Error(e.message)
  }

  let cur: unknown = e
  let best: string | null = null
  let hasCause = false
  let hasDriverCause = false
  const seen = new Set<unknown>()
  while (cur !== null && typeof cur === 'object' && !seen.has(cur)) {
    seen.add(cur)
    if (cur !== e) hasCause = true
    if (cur !== e && 'code' in cur) hasDriverCause = true
    const msg: unknown = (cur as { message?: unknown }).message
    if (
      typeof msg === 'string' &&
      msg.trim() !== '' &&
      !/^failed query:/i.test(msg.trim())
    ) {
      best = msg
    }
    cur = (cur as { cause?: unknown }).cause
  }
  if (!hasCause) {
    logger.warn({ err: e }, fallback)
  } else {
    logger.error({ err: e }, fallback)
  }
  if (!hasDriverCause && typeof e === 'string' && e.trim() !== '') return new Error(e)
  return new Error(hasDriverCause ? fallback : (best ?? fallback))
}
