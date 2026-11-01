import { test, expect, type Page } from '@playwright/test'
import { gotoHydrated } from './support/hydration.ts'

/**
 * Full quiz run. Writes to `quizzes` / `quiz_details`, which is why the suite
 * targets the dedicated test database. Questions are picked at random, so the
 * assertions only cover stable facts: 5 questions, then a result page.
 */
const QUESTIONS = 5

async function answerAllQuestions(page: Page) {
  for (let step = 1; step <= QUESTIONS; step++) {
    await expect(page.getByText(`Soal ${step} dari ${QUESTIONS}`)).toBeVisible()
    // Option buttons are prefixed "01." "02." "03.".
    await page.locator('button', { hasText: /^0[123]\./ }).first().click()
  }
}

async function startQuiz(page: Page) {
  await gotoHydrated(page, '/explore/1')
  // Base UI Button rendered as a link exposes the `button` role.
  await page.getByRole('button', { name: 'Mulai Kuis Satwa Ini' }).click()
  await expect(page).toHaveURL(/\/quiz\/1$/)
}

test.describe('quiz flow', () => {
  test.use({ storageState: 'e2e/.auth/admin.json' })
  test.describe.configure({ mode: 'serial' })

  test('answers all questions and lands on the result page', async ({ page }) => {
    await startQuiz(page)
    await answerAllQuestions(page)

    await expect(page).toHaveURL(/\/quiz\/result\/[0-9a-f-]{36}$/, {
      timeout: 30_000,
    })
    await expect(page.getByText('Jawaban Benar')).toBeVisible()
    await expect(page.getByText('Jawaban Salah')).toBeVisible()
    await expect(page.getByText('Rincian Jawaban')).toBeVisible()
  })

  test('result page shows one detail row per question', async ({ page }) => {
    await startQuiz(page)
    await answerAllQuestions(page)

    await expect(page).toHaveURL(/\/quiz\/result\/[0-9a-f-]{36}$/, {
      timeout: 30_000,
    })
    await expect(
      page.getByText(/Jawaban dipilih: Opsi \d|Waktu habis/),
    ).toHaveCount(QUESTIONS)
  })
})
