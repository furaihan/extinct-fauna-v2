import { test, expect } from '@playwright/test'
import { gotoHydrated } from './support/hydration.ts'

test.describe('public pages', () => {
  test('home renders the hero and the seeded content', async ({ page }) => {
    await gotoHydrated(page, '/')

    await expect(page).toHaveTitle(/Extinct Fauna/)
    await expect(
      page.locator('header').getByRole('link', { name: 'Extinct Fauna' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /Melestarikan Ingatan/ }),
    ).toBeVisible()
  })

  test('header navigation reaches explore and about', async ({ page }) => {
    await gotoHydrated(page, '/')

    await page.locator('nav').getByRole('button', { name: 'Jelajahi' }).click()
    await expect(page).toHaveURL('/explore')
    await expect(
      page.getByRole('heading', { name: 'Jelajahi Satwa Dunia' }),
    ).toBeVisible()

    await page.locator('nav').getByRole('button', { name: 'Tentang' }).click()
    await expect(page).toHaveURL('/about')
  })

  test('unknown route renders the not-found page', async ({ page }) => {
    await gotoHydrated(page, '/this-route-does-not-exist')

    await expect(page.getByText('Halaman tidak ditemukan')).toBeVisible()
  })
})
