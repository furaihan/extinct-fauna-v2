/**
 * TanStack Start serializes `createServerFn` validator failures as
 * `Error.message = JSON.stringify(zodIssues)` so it survives the
 * seroval round-trip. Showing `e.message` directly renders raw JSON
 * in toasts. This extracts the first human-readable issue message.
 */
export function friendlyServerError(e: unknown, fallback: string): string {
  if (e instanceof Error) {
    const raw = e.message?.trim() ?? ''
    if (raw.startsWith('[')) {
      try {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          const msg = parsed
            .map((item) => (item as { message?: unknown } | null)?.message)
            .find((m): m is string => typeof m === 'string' && m.trim() !== '')
          if (msg) return msg
        }
      } catch {
        // Not parseable JSON — fall through to raw message check below.
      }
    }
    if (raw !== '') return e.message
  }
  return fallback
}
