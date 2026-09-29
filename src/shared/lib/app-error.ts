/**
 * An expected, user-facing domain error (e.g. wrong password, duplicate
 * username). Unlike an unexpected fault, these are logged at `debug` instead
 * of `warn`/`error` so normal validation failures don't spam server logs.
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AppError'
  }
}
