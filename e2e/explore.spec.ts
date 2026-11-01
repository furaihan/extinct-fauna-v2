import { test, expect, type Page } from '@playwright/test'
import { gotoHydrated } from './support/hydration.ts'

/** Seeded dataset: 9 animals, 3 per type, 1 African. */
const TOTAL_ANIMALS = 9
const EXTINCT_ANIMALS = 3
const AFRICAN_ANIMALS = 1

function countText(page: Page) {
  return page.locator('p', { hasText: 'Menampilkan' })
}

function cards(page: Page) {
  return page.getByRole('heading', { level: 3 })
}

/**
 * The filters are Base UI selects, not native <select> elements: the label is
 * plain text and the control is a combobox that opens a listbox on click.
 */
function filterSelect(page: Page, label: string) {
  return page.getByText(label, { exact: true }).locator('..').getByRole('combobox')
}

async function pickFilter(page: Page, label: string, option: string) {
  await filterSelect(page, label).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}

test.describe('explore', () => {
  test('lists every seeded animal', async ({ page }) => {
    await gotoHydrated(page, '/explore')

    await expect(countText(page)).toContainText(String(TOTAL_ANIMALS))
    await expect(cards(page)).toHaveCount(TOTAL_ANIMALS)
  })

  test('type filter narrows the list and syncs the URL', async ({ page }) => {
    await gotoHydrated(page, '/explore')
    await pickFilter(page, 'Kategori Jenis', 'Punah')

    await expect(page).toHaveURL(/type=extinct/)
    await expect(countText(page)).toContainText(String(EXTINCT_ANIMALS))
    await expect(cards(page)).toHaveCount(EXTINCT_ANIMALS)
  })

  test('region filter narrows the list', async ({ page }) => {
    await gotoHydrated(page, '/explore')
    await pickFilter(page, 'Wilayah Asal', 'Afrika')

    await expect(page).toHaveURL(/region=africa/)
    await expect(countText(page)).toContainText(String(AFRICAN_ANIMALS))
  })

  test('reset restores the full list', async ({ page }) => {
    await gotoHydrated(page, '/explore?type=extinct')
    await expect(countText(page)).toContainText(String(EXTINCT_ANIMALS))

    await page.getByRole('button', { name: 'Atur Ulang Filter' }).click()

    await expect(page).not.toHaveURL(/type=extinct/)
    await expect(countText(page)).toContainText(String(TOTAL_ANIMALS))
  })

  test('a card opens the animal detail page', async ({ page }) => {
    await gotoHydrated(page, '/explore')

    const firstCard = cards(page).first()
    const name = (await firstCard.textContent())?.trim() ?? ''
    await firstCard.getByRole('link').click()

    await expect(page).toHaveURL(/\/explore\/\d+$/)
    await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible()
  })
})
