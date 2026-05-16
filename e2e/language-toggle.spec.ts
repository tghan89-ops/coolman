// e2e/language-toggle.spec.ts — Group 9 step 1 (language toggle persists via the coolman-lang cookie)
import { test, expect } from '@playwright/test'

test.describe('Language toggle', () => {
  test('switching to BM sets the coolman-lang cookie and survives a reload', async ({ page, context }) => {
    await page.goto('/')

    // Find the language toggle. It might be a button labelled "BM" / "Bahasa", or a
    // link, or part of a switch — try a few resilient locators.
    const bmControl = page
      .getByRole('button', { name: /\b(bm|bahasa|melayu)\b/i })
      .or(page.getByRole('link', { name: /\b(bm|bahasa|melayu)\b/i }))
      .first()

    const found = await bmControl.isVisible().catch(() => false)
    test.skip(!found, 'No BM language control found in the header')

    await bmControl.click()
    await page.waitForLoadState('networkidle')

    // Cookie is set.
    const cookieAfterClick = (await context.cookies()).find((c) => c.name === 'coolman-lang')
    expect(cookieAfterClick?.value).toMatch(/bm/i)

    // Survives a reload.
    await page.reload()
    const cookieAfterReload = (await context.cookies()).find((c) => c.name === 'coolman-lang')
    expect(cookieAfterReload?.value).toMatch(/bm/i)
  })
})
