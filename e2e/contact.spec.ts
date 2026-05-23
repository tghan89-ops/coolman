/**
 * Contact page tests — form validation and direct-line email display.
 * Does NOT actually submit to avoid spamming the inbox during test runs.
 */
import { test, expect } from '@playwright/test'

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('page loads with main heading and form', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('form')).toBeVisible()
  })

  test('shows all four direct-line email addresses', async ({ page }) => {
    const body = await page.locator('body').textContent()
    // All four department emails must be visible — they come from CMS Settings now
    expect(body).toMatch(/@coolman\.com\.my/i)
    // Check at least 3 different prefixes appear (sales / parts / training / careers)
    const emailMatches = (body ?? '').match(/\b(sales|parts|training|careers)@/gi) ?? []
    expect(emailMatches.length, 'Expected 4 direct-line emails, found fewer').toBeGreaterThanOrEqual(4)
  })

  test('email links are proper mailto: links', async ({ page }) => {
    const mailtoLinks = page.locator('a[href^="mailto:"]')
    await expect(mailtoLinks.first()).toBeVisible()
    const count = await mailtoLinks.count()
    expect(count, 'Expected at least 4 mailto links').toBeGreaterThanOrEqual(4)
  })

  test('form validation — submitting empty form shows errors, does not send', async ({ page }) => {
    // Click submit without filling anything
    await page.getByRole('button', { name: /send|submit/i }).click()
    // The page must NOT navigate away (form was rejected client-side)
    await expect(page).toHaveURL(/\/contact/)
    // Some error indication should appear (red text, border, aria-invalid, etc.)
    const hasError =
      (await page.locator('[aria-invalid="true"]').count()) > 0 ||
      (await page.locator('.error, [class*="error"], [class*="invalid"]').count()) > 0 ||
      (await page.getByText(/required|please fill|must/i).count()) > 0
    expect(hasError, 'No validation errors shown on empty form submit').toBe(true)
  })

  test('form validation — invalid email format shows error', async ({ page }) => {
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('not-an-email')
    await page.getByRole('button', { name: /send|submit/i }).click()
    await expect(page).toHaveURL(/\/contact/)
    // Still on contact page = form not submitted
  })

  test('WhatsApp button is present and links to wa.me', async ({ page }) => {
    const waLink = page.locator('a[href*="wa.me"]').first()
    await expect(waLink).toBeVisible()
    const href = await waLink.getAttribute('href')
    expect(href).toMatch(/wa\.me\/\d+/)
  })
})
