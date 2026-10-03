/**
 * Destructive database reset: drops the schema, recreates it from migrations,
 * imports the legacy MySQL dump, then seeds the admin account.
 *
 * Guarded: refuses to run in production and requires an explicit opt-in flag.
 * Usage: bun src/db/reset-db.ts --force
 */
import { env } from '@/lib/env.lib.ts'
import { getDb, closeDb } from '@/lib/typeorm.lib.ts'
import { importOldDump } from './import-old-dump.ts'
import { seedAdmin } from './seeder/index.ts'

const isProd = env.NODE_ENV === 'production'
const confirmed = process.argv.includes('--force') || process.env.CONFIRM_RESET === '1'

// Fail closed: only an explicitly non-production NODE_ENV may proceed, and the
// caller must opt in. Guards against running this against a live database.
if (isProd || !['development', 'test'].includes(env.NODE_ENV) || !confirmed) {
  console.error('❌ Refusing to reset the database.')
  if (isProd) {
    console.error('   NODE_ENV is "production".')
  }
  if (!['development', 'test'].includes(env.NODE_ENV)) {
    console.error(`   NODE_ENV is "${env.NODE_ENV}"; expected "development" or "test".`)
  }
  if (!confirmed) {
    console.error('   Missing explicit opt-in. Re-run with --force (or CONFIRM_RESET=1).')
  }
  process.exit(1)
}

async function resetDb() {
  const db = await getDb()

  console.log('Resetting database (dropping public schema)...')
  await db.query('DROP SCHEMA IF EXISTS public CASCADE')
  // Split statements: a multi-statement query only works on pg's simple
  // protocol. Re-create owned by the current role so tables can be created
  // even on PG 15+, where `public` is owned by pg_database_owner.
  await db.query('CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION current_user')
  await db.query('GRANT ALL ON SCHEMA public TO current_user')

  console.log('Running migrations...')
  const applied = await db.runMigrations({ transaction: 'each' })
  if (applied.length === 0) {
    console.log('No pending migrations.')
  } else {
    for (const migration of applied) {
      console.log(`Applied migration: ${migration.name}`)
    }
  }

  console.log('Importing legacy dump...')
  await importOldDump()

  console.log('Seeding admin account...')
  await seedAdmin()

  console.log('Reset complete.')
}

try {
  await resetDb()
} catch (error) {
  console.error('Database reset failed:', error)
  process.exitCode = 1
} finally {
  await closeDb()
}