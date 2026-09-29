import { env } from '@/lib/env.lib.ts'
import { getDb, closeDb } from '@/lib/typeorm.lib.ts'
import { Account } from '@/modules/auth/db/account.entity.ts'
import { User } from '@/modules/auth/db/user.entity.ts'

/**
 * Seeds a login-ready admin account. Legacy imported accounts keep their
 * unverifiable bcrypt hashes; this admin uses argon2id via Bun.password.
 */
async function seedAdmin() {
  const db = await getDb()
  const accountRepo = db.getRepository(Account)
  const userRepo = db.getRepository(User)

  const passwordHash = await Bun.password.hash(env.ADMIN_PASSWORD, {
    algorithm: 'argon2id',
  })

  const existingUser = await userRepo.findOne({
    where: { username: env.ADMIN_USERNAME },
    relations: { account: true },
  })

  if (existingUser) {
    await userRepo.update(
      { user_id: existingUser.user_id },
      { first_name: 'Admin', last_name: 'Extinct Fauna' },
    )
    if (existingUser.account) {
      await accountRepo.update(
        { account_id: existingUser.account_id },
        { password: passwordHash },
      )
    }
    console.log(`Admin "${env.ADMIN_USERNAME}" refreshed.`)
    return
  }

  await db.transaction(async (manager) => {
    const account = manager.create(Account, {
      email: `${env.ADMIN_USERNAME}@extinct-fauna.local`,
      password: passwordHash,
    })
    await manager.save(account)

    const user = manager.create(User, {
      account_id: account.account_id,
      username: env.ADMIN_USERNAME,
      first_name: 'Admin',
      last_name: 'Extinct Fauna',
    })
    await manager.save(user)
  })

  console.log(`Admin "${env.ADMIN_USERNAME}" created.`)
}

try {
  await seedAdmin()
  console.log('Seeding complete.')
} catch (error) {
  console.error('Seeding failed:', error)
  process.exitCode = 1
} finally {
  await closeDb()
}
