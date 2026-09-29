import { closeDb, createDataSource } from '@/lib/typeorm.lib.ts'

const dataSource = createDataSource()

try {
  await dataSource.initialize()
  const applied = await dataSource.runMigrations({ transaction: 'each' })
  if (applied.length === 0) {
    console.log('No pending migrations.')
  } else {
    for (const migration of applied) {
      console.log(`Applied migration: ${migration.name}`)
    }
  }
} catch (error) {
  console.error('Migration failed:', error)
  process.exitCode = 1
} finally {
  await closeDb()
  if (dataSource.isInitialized) await dataSource.destroy()
}
