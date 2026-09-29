/**
 * Imports the legacy MySQL dump (extinct-fauna.sql) into PostgreSQL.
 *
 * - Only the app's real tables are imported; the unused Indonesian region
 *   tables and SequelizeMeta are ignored.
 * - Legacy UUID (v4) primary keys and int animal ids are preserved as-is.
 * - Idempotent: truncates the target tables before inserting.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getDb, closeDb } from '@/lib/typeorm.lib.ts'
import { Account } from '@/modules/auth/db/account.entity.ts'
import { User } from '@/modules/auth/db/user.entity.ts'
import { Animal } from '@/modules/animal/db/animal.entity.ts'
import { Description } from '@/modules/animal/db/description.entity.ts'
import { Question } from '@/modules/quiz/db/question.entity.ts'
import { Quiz } from '@/modules/quiz/db/quiz.entity.ts'
import { QuizDetail } from '@/modules/quiz/db/quiz-detail.entity.ts'

const DUMP_PATH = resolve(process.cwd(), 'extinct-fauna.sql')

function decodeEscape(char: string | undefined): string {
  switch (char) {
    case 'n':
      return '\n'
    case 'r':
      return '\r'
    case 't':
      return '\t'
    case '0':
      return '\0'
    case 'b':
      return '\b'
    case 'Z':
      return '\x1a'
    default:
      return char ?? ''
  }
}

function findStatementEnd(sql: string, from: number): number {
  let inString = false
  for (let i = from; i < sql.length; i++) {
    const ch = sql[i]
    if (inString) {
      if (ch === '\\') {
        i++
        continue
      }
      if (ch === "'") {
        if (sql[i + 1] === "'") {
          i++
          continue
        }
        inString = false
      }
      continue
    }
    if (ch === "'") {
      inString = true
      continue
    }
    if (ch === ';') return i
  }
  return sql.length
}

function parseTuples(body: string): Array<Array<string | null>> {
  const rows: Array<Array<string | null>> = []
  const n = body.length
  let i = 0

  while (i < n) {
    while (i < n && body[i] !== '(') i++
    if (i >= n) break
    i++ // consume '('

    const values: Array<string | null> = []
    let buf = ''
    let quoted = false
    let inString = false

    while (i < n) {
      const ch = body[i]
      if (inString) {
        if (ch === '\\') {
          buf += decodeEscape(body[i + 1])
          i += 2
          continue
        }
        if (ch === "'") {
          if (body[i + 1] === "'") {
            buf += "'"
            i += 2
            continue
          }
          inString = false
          i++
          continue
        }
        buf += ch
        i++
        continue
      }

      if (ch === "'") {
        // Discard any whitespace between the delimiter and the opening quote.
        buf = ''
        inString = true
        quoted = true
        i++
        continue
      }
      if (ch === ',') {
        values.push(decodeValue(buf, quoted))
        buf = ''
        quoted = false
        i++
        continue
      }
      if (ch === ')') {
        values.push(decodeValue(buf, quoted))
        buf = ''
        quoted = false
        i++
        break
      }
      buf += ch
      i++
    }

    rows.push(values)
    while (i < n && body[i] !== '(' && body[i] !== ';') i++
    if (i < n && body[i] === ';') break
  }

  return rows
}

function decodeValue(raw: string, quoted: boolean): string | null {
  if (quoted) return raw
  const trimmed = raw.trim()
  if (trimmed === '' || trimmed.toUpperCase() === 'NULL') return null
  return trimmed
}

interface InsertBlock {
  cols: string[]
  rows: Array<Array<string | null>>
}

function extractInserts(sql: string, table: string): InsertBlock[] {
  const blocks: InsertBlock[] = []
  const marker = 'INSERT INTO `' + table + '`'
  let idx = 0
  while ((idx = sql.indexOf(marker, idx)) !== -1) {
    const start = idx + marker.length
    const openParen = sql.indexOf('(', start)
    const closeParen = sql.indexOf(')', openParen)
    const cols = sql
      .slice(openParen + 1, closeParen)
      .split(',')
      .map((c) => c.trim().replaceAll('`', ''))
    const valuesIdx = sql.indexOf('VALUES', closeParen)
    const end = findStatementEnd(sql, valuesIdx)
    const body = sql.slice(valuesIdx + 'VALUES'.length, end)
    blocks.push({ cols, rows: parseTuples(body) })
    idx = end
  }
  return blocks
}

function toRecords(blocks: InsertBlock[]): Array<Record<string, string | null>> {
  const records: Array<Record<string, string | null>> = []
  for (const block of blocks) {
    for (const row of block.rows) {
      const record: Record<string, string | null> = {}
      block.cols.forEach((col, i) => {
        record[col] = row[i] ?? null
      })
      records.push(record)
    }
  }
  return records
}

function bool(value: string | null): boolean | null {
  if (value === null) return null
  return value === '1' || value.toLowerCase() === 'true'
}

async function main() {
  const sql = readFileSync(DUMP_PATH, 'utf8')
  const db = await getDb()

  const accounts = toRecords(extractInserts(sql, 'accounts')).map((r) => ({
    account_id: r.account_id!,
    email: r.email,
    password: r.password,
    created_at: r.created_at ? new Date(r.created_at) : new Date(),
  }))

  const users = toRecords(extractInserts(sql, 'users')).map((r) => ({
    user_id: r.user_id!,
    account_id: r.account_id!,
    username: r.username,
    first_name: r.first_name,
    last_name: r.last_name,
    bio: r.bio,
    address: r.address,
    phone: r.phone,
  }))

  const animals = toRecords(extractInserts(sql, 'animals')).map((r) => ({
    animal_id: Number(r.animal_id),
    animal_name: r.animal_name!,
    animal_type: r.animal_type as Animal['animal_type'],
    animal_environment: r.animal_environment as Animal['animal_environment'],
    animal_origin: r.animal_origin as Animal['animal_origin'],
    latin_name: r.latin_name ?? '',
    family_name: r.family_name ?? '',
    order_name: (r.order_name ?? null) as Animal['order_name'],
  }))

  const descriptions = toRecords(extractInserts(sql, 'descriptions')).map(
    (r) => ({
      description_id: Number(r.description_id),
      animal_id: Number(r.animal_id),
      title: r.title,
      description: r.description,
      image: r.image,
      fun_fact: r.fun_fact,
    }),
  )

  const questions = toRecords(extractInserts(sql, 'questions')).map((r) => ({
    question_id: r.question_id!,
    animal_id: Number(r.animal_id),
    question: r.question!,
    option_1: r.option_1!,
    option_2: r.option_2!,
    option_3: r.option_3!,
    correct_answer: (r.correct_answer ?? null) as Question['correct_answer'],
  }))

  const quizzes = toRecords(extractInserts(sql, 'quizzes')).map((r) => ({
    quiz_id: r.quiz_id!,
    user_id: r.user_id!,
    animal_id: Number(r.animal_id),
    score: Number(r.score ?? 0),
    time: r.time ? new Date(r.time) : new Date(),
  }))

  const quizDetails = toRecords(extractInserts(sql, 'quiz_details')).map(
    (r) => ({
      detail_id: r.detail_id!,
      quiz_id: r.quiz_id!,
      question_id: r.question_id!,
      selected_option: r.selected_option as QuizDetail['selected_option'],
      response_time:
        r.response_time === null ? null : Number(r.response_time),
      is_correct: bool(r.is_correct),
    }),
  )

  console.log('Parsed rows:', {
    accounts: accounts.length,
    users: users.length,
    animals: animals.length,
    descriptions: descriptions.length,
    questions: questions.length,
    quizzes: quizzes.length,
    quizDetails: quizDetails.length,
  })

  await db.query(
    'TRUNCATE TABLE "quiz_details", "quizzes", "questions", "descriptions", "animals", "users", "accounts" RESTART IDENTITY CASCADE',
  )

  await db.getRepository(Account).insert(accounts)
  await db.getRepository(User).insert(users)
  await db.getRepository(Animal).insert(animals)
  await db.getRepository(Description).insert(descriptions)
  await db.getRepository(Question).insert(questions)
  await db.getRepository(Quiz).insert(quizzes)
  await db.getRepository(QuizDetail).insert(quizDetails)

  await db.query(
    `SELECT setval(pg_get_serial_sequence('animals', 'animal_id'), COALESCE((SELECT MAX(animal_id) FROM animals), 1))`,
  )
  await db.query(
    `SELECT setval(pg_get_serial_sequence('descriptions', 'description_id'), COALESCE((SELECT MAX(description_id) FROM descriptions), 1))`,
  )

  console.log('Import complete.')
}

try {
  await main()
} catch (error) {
  console.error('Import failed:', error)
  process.exitCode = 1
} finally {
  await closeDb()
}
