import { getDb } from '@/lib/typeorm.lib.ts'
import { Account } from '../db/account.entity.ts'
import { User } from '../db/user.entity.ts'

export interface AccountWithUser {
  account: Account
  user: User
}

export async function findAccountByEmailOrUsername(
  emailOrUsername: string,
): Promise<AccountWithUser | null> {
  const db = await getDb()
  const accountRepo = db.getRepository(Account)
  const isEmail = emailOrUsername.includes('@')

  if (isEmail) {
    const account = await accountRepo.findOne({
      where: { email: emailOrUsername },
      relations: { User: true },
    })
    return account?.User ? { account, user: account.User } : null
  }

  const user = await db.getRepository(User).findOne({
    where: { username: emailOrUsername },
    relations: { account: true },
  })
  return user ? { account: user.account, user } : null
}

export async function findAccountById(id: string): Promise<Account | null> {
  const db = await getDb()
  return db.getRepository(Account).findOne({ where: { account_id: id } })
}

export async function updatePasswordHash(
  accountId: string,
  passwordHash: string,
): Promise<void> {
  const db = await getDb()
  await db.getRepository(Account).update({ account_id: accountId }, { password: passwordHash })
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDb()
  return db.getRepository(User).findOne({ where: { user_id: id } })
}

export async function emailExists(email: string): Promise<boolean> {
  const db = await getDb()
  return db.getRepository(Account).exists({ where: { email } })
}

export async function usernameExists(username: string): Promise<boolean> {
  const db = await getDb()
  return db.getRepository(User).exists({ where: { username } })
}

export async function createAccountWithUser(input: {
  email: string
  username: string
  passwordHash: string
}): Promise<AccountWithUser> {
  const db = await getDb()
  return db.transaction(async (manager) => {
    const account = manager.create(Account, {
      email: input.email,
      password: input.passwordHash,
    })
    await manager.save(account)

    const user = manager.create(User, {
      account_id: account.account_id,
      username: input.username,
    })
    await manager.save(user)

    account.User = user
    return { account, user }
  })
}
