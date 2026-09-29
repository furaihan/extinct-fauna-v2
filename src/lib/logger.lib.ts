import { env } from './env.lib.ts'

type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'

const ORDER: Record<Level, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
  silent: 99,
}

const threshold = ORDER[env.LOG_LEVEL]

function emit(level: Exclude<Level, 'silent'>, args: unknown[]) {
  if (ORDER[level] > threshold) return
  const fn =
    level === 'error' || level === 'fatal'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log
  fn(`[${level}]`, ...args)
}

export const logger = {
  fatal: (...args: unknown[]) => emit('fatal', args),
  error: (...args: unknown[]) => emit('error', args),
  warn: (...args: unknown[]) => emit('warn', args),
  info: (...args: unknown[]) => emit('info', args),
  debug: (...args: unknown[]) => emit('debug', args),
  trace: (...args: unknown[]) => emit('trace', args),
  child: () => logger,
}
