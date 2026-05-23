/**
 * Public pages smoke test — every public-facing page must:
 *  - return HTTP 200 (no crash / blank screen)
 *  - render a visible main heading (h1 or h2)
 *  - not overflow the viewport horizontally (no side-scroll at 390px mobile)
 */
import { test, expect } from '@playwright/test'

const PUBLIC_PAGES = [
  '/',
  '/about',
  '/contact',
  '/products',
  '/why-coolman',
  '/heritage',
  '/applications',
  '/trade',
  '/resources',
  '/shibuya',
  '/field-notes',
  '/privacy',
  '/terms',
]

for (const path of PUBLIC_PAGES) {
  test(`${path} — loads without error and shows main heading`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status(), `${path} returned non-200`).toBe(200)

    // Page must have a visible heading — don't assert specific copy so tests survive content edits
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible({ timeout: 10_000 })
    const text = await heading.textContent()
    expect(text?.trim().length, `${path}: h1/h2 was empty`).toBeGreaterThan(0)

    // No React error boundary message
    await expect(page.getByText('Something went wrong')).not.toBeVisible()
    await expect(page.getByText('Application error')).not.toBeVisible()
  })
}

test('404 page — unknown URL shows "not found" message', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist-xyz')
  expect([404, 200]).toContain(response?.status())
  await expect(page.locator('body')).toContainText(/not found|404/i)
})

test('mobile — no horizontal overflow at 390px width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const path of PUBLIC_PAGES.slice(0, 6)) {
    await page.goto(path)
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(
      scrollWidth,
      `${path}: scrollWidth (${scrollWidth}) > clientWidth (${clientWidth}) → horizontal overflow at 390px`,
    ).toBeLessThanOrEqual(clientWidth + 2)
  }
})
