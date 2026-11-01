import type { Page } from '@playwright/test'

/**
 * Navigate and wait until React has hydrated the page.
 *
 * Vite serves the HTML before the client bundle finishes hydrating. Clicking a
 * button in that window runs the browser's default behaviour instead of the
 * React handler — e.g. the login form does a native `GET /login?` submit
 * instead of calling the server function.
 *
 * React attaches its own keys to the DOM node while hydrating, so their
 * presence is a reliable "safe to interact" signal.
 */
export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path)
  await page.waitForFunction(() => {
    const button = document.querySelector('button')
    return (
      button !== null &&
      Object.keys(button).some((key) => key.startsWith('__reactProps$'))
    )
  })
}
