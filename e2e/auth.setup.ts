import { test as setup, expect } from '@playwright/test'
import { gotoHydrated } from './support/hydration.ts'

export const STORAGE_STATE = 'e2e/.auth/admin.json'

/**
 * Logs in once through the real UI and persists the session cookie, so
 * authenticated specs do not repeat the login flow. The session cookie is
 * httpOnly and signed, so it has to come from an actual login.
 */
setup('authenticate as admin', async ({ page }) => {
  const username = process.env.ADMIN_USERNAME ?? 'admin'
  const password = process.env.ADMIN_PASSWORD ?? 'admin12345'

  await gotoHydrated(page, '/login')
  await page.getByLabel('Email / Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.locator('form').getByRole('button', { name: 'Masuk' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('button', { name: username })).toBeVisible()

  await page.context().storageState({ path: STORAGE_STATE })
})
