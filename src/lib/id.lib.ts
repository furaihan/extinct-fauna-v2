/**
 * All generated primary keys are UUID v7 (time-ordered). Bun provides a
 * native implementation, so no external uuid dependency is needed.
 */
export function newId(): string {
  return Bun.randomUUIDv7()
}
