/**
 * Public pages smoke test — every public-facing page must:
 *  - return HTTP 200 (no crash / blank screen)
 *  - render its main heading
 *  - not overflow the viewport horizontally (no side-scroll at 390px mobile)
 */
import { test, expect } from '@playwright/test'

const PUBLIC_PAGES = [
  { path: '/', heading: /Coolman|diamond|tool/i },
  { path: '/about', heading: /about|coolman/i },
  { path: '/contact', heading: /contact|reach|talk/i },
  { path: '/products', heading: /product|catalogue|catalog/i },
  { path: '/why-coolman', heading: /why coolman|why/i },
  { path: '/heritage', heading: /heritage|history|story/i },
  { path: '/applications', heading: /application/i },
  { path: '/trade', heading: /trade|dealer|contractor/i },
  { path: '/resources', heading: /resource/i },
  { path: '/shibuya', heading: /shibuya|machine/i },
  { path: '/field-notes', heading: /field note|insight|article/i },
  { path: '/privacy', heading: /privacy/i },
  { path: '/terms', heading: /terms/i },
]

for (const { path, heading } of PUBLIC_PAGES) {
  test(`${path} — loads without error and shows main heading`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status(), `${path} returned non-200`).toBe(200)

    // Page must have a heading that matches expected text
    await expect(page.locator('h1, h2').first()).toContainText(heading, {
      ignoreCase: true,
      timeout: 10_000,
    })

    // No React error boundary message
    await expect(page.getByText('Something went wrong')).not.toBeVisible()
    await expect(page.getByText('Application error')).not.toBeVisible()
  })
}

test('404 page — unknown URL shows "not found" message', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist-xyz')
  // Next.js returns 404 for unknown routes
  expect([404, 200]).toContain(response?.status()) // 200 is acceptable if Next renders a 404 UI
  await expect(page.locator('body')).toContainText(/not found|404/i)
})

test('mobile — no horizontal overflow at 390px width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const { path } of PUBLIC_PAGES.slice(0, 6)) {
    await page.goto(path)
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(
      scrollWidth,
      `${path}: scrollWidth (${scrollWidth}) > clientWidth (${clientWidth}) → horizontal overflow at 390px`,
    ).toBeLessThanOrEqual(clientWidth + 2) // +2 px tolerance for sub-pixel rendering
  }
})
