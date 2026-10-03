import { env } from '@/lib/env.lib.ts'
import { closeDb, createDataSource } from '@/lib/typeorm.lib.ts'
import { importOldDump } from './import-old-dump.ts'

async function resetDb() {
  if (env.NODE_ENV === 'production') {
    console.error('❌ ERROR: Cannot run database reset in production mode!')
    process.exit(1)
  }

  const dataSource = createDataSource()

  try {
    console.log('Initializing database connection...')
    await dataSource.initialize()

    console.log('Resetting database (dropping public schema)...')
    await dataSource.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')

    console.log('Running migrations...')
    const applied = await dataSource.runMigrations({ transaction: 'each' })
    if (applied.length === 0) {
      console.log('No pending migrations.')
    } else {
      for (const migration of applied) {
        console.log(`Applied migration: ${migration.name}`)
      }
    }

    console.log('Importing old legacy dump...')
    await importOldDump()

    console.log('Database reset, migration, and dump import completed successfully.')
  } catch (error) {
    console.error('Database reset failed:', error)
    process.exitCode = 1
  } finally {
    await closeDb()
    if (dataSource.isInitialized) await dataSource.destroy()
  }
}

try {
  await resetDb()
} catch (error) {
  console.error('Database reset failed:', error)
  process.exitCode = 1
}
