import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from './env.lib.ts'
import { Account } from '@/modules/auth/db/account.entity.ts'
import { User } from '@/modules/auth/db/user.entity.ts'
import { Animal } from '@/modules/animal/db/animal.entity.ts'
import { Description } from '@/modules/animal/db/description.entity.ts'
import { Question } from '@/modules/quiz/db/question.entity.ts'
import { Quiz } from '@/modules/quiz/db/quiz.entity.ts'
import { QuizDetail } from '@/modules/quiz/db/quiz-detail.entity.ts'

export const entities = [
  Account,
  User,
  Animal,
  Description,
  Question,
  Quiz,
  QuizDetail,
] as const

function dbSsl(url: string) {
  const host = new URL(url).hostname
  const plain = host === 'localhost' || host === '127.0.0.1' || host === 'db'
  return plain ? false : { rejectUnauthorized: false }
}

function createDataSource() {
  return new DataSource({
    type: 'postgres',
    url: env.DATABASE_URL,
    ssl: dbSsl(env.DATABASE_URL),
    entities: [...entities],
    migrations: ['src/db/migrations/*.ts'],
    synchronize: false,
    logging: false,
  })
}

// Reuse a single DataSource across Vite HMR reloads and server-fn invocations.
const globalForDb = globalThis as unknown as {
  __extinctFaunaDataSource?: DataSource
}

function getDataSource(): DataSource {
  if (!globalForDb.__extinctFaunaDataSource) {
    globalForDb.__extinctFaunaDataSource = createDataSource()
  }
  return globalForDb.__extinctFaunaDataSource
}

export async function getDb(): Promise<DataSource> {
  const ds = getDataSource()
  if (!ds.isInitialized) {
    await ds.initialize()
  }
  return ds
}

export async function closeDb(): Promise<void> {
  const ds = globalForDb.__extinctFaunaDataSource
  if (ds?.isInitialized) {
    await ds.destroy()
    globalForDb.__extinctFaunaDataSource = undefined
  }
}

export { createDataSource }
