import { test, expect } from '@playwright/test'
import { gotoHydrated } from './support/hydration.ts'

test.describe('auth guards (anonymous)', () => {
  test('profile redirects to login and keeps the return path', async ({ page }) => {
    await gotoHydrated(page, '/profile')

    await expect(page).toHaveURL(/\/login\?redirect=%2Fprofile/)
    await expect(page.getByLabel('Email / Username')).toBeVisible()
  })

  test('quiz redirects to login', async ({ page }) => {
    await gotoHydrated(page, '/quiz/1')

    await expect(page).toHaveURL(/\/login\?redirect=%2Fquiz%2F1/)
  })

  test('login with wrong credentials stays on the page', async ({ page }) => {
    await gotoHydrated(page, '/login')
    await page.getByLabel('Email / Username').fill('admin')
    await page.getByLabel('Password').fill('definitely-not-the-password')
    await page.locator('form').getByRole('button', { name: 'Masuk' }).click()

    // Errors surface as a toast, not inline text.
    await expect(page.locator('[data-slot="toast"]').first()).toContainText(
      /salah/i,
    )
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('authenticated session', () => {
  test.use({ storageState: 'e2e/.auth/admin.json' })

  test('profile page renders for the logged-in admin', async ({ page }) => {
    await gotoHydrated(page, '/profile')

    await expect(page).toHaveURL('/profile')
    // `banner` is the site header; the devtools panel also renders a <header>.
    await expect(page.getByRole('banner')).toContainText('admin')
  })

  test('logout returns to the guest state', async ({ page }) => {
    await gotoHydrated(page, '/')

    await page.getByRole('banner').getByRole('button', { name: 'admin' }).click()
    await page.getByRole('menuitem', { name: 'Keluar' }).click()

    await expect(page.getByRole('banner').getByRole('button', { name: 'Masuk' })).toBeVisible()
    await gotoHydrated(page, '/profile')
    await expect(page).toHaveURL(/\/login/)
  })
})
