/**
 * Auth page tests — login, register, forgot password pages load correctly
 * and show appropriate form fields. No real credentials used.
 */
import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('page loads with email and password fields', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({
      timeout: 10_000,
    })
    await expect(
      page.locator('input[type="password"], input[name="password"]').first(),
    ).toBeVisible()
  })

  test('submit with empty fields shows error, stays on login page', async ({ page }) => {
    await page.getByRole('button', { name: /sign in|log in|login/i }).click()
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('wrong credentials show error message', async ({ page }) => {
    await page.locator('input[type="email"], input[name="email"]').first().fill('nobody@example.com')
    await page
      .locator('input[type="password"], input[name="password"]')
      .first()
      .fill('wrongpassword')
    await page.getByRole('button', { name: /sign in|log in|login/i }).click()
    // Should remain on login page and show some error
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8_000 })
    await expect(page.locator('body')).toContainText(
      /invalid|incorrect|wrong|not found|error/i,
      { timeout: 8_000 },
    )
  })

  test('"Forgot password" link navigates to reset page', async ({ page }) => {
    await page.getByRole('link', { name: /forgot|reset/i }).click()
    await expect(page).toHaveURL(/forgot|reset/)
  })

  test('"Create account" link navigates to register page', async ({ page }) => {
    // Two matching links exist (button variant + inline anchor) — take the first.
    await page.getByRole('link', { name: /register|create|sign up/i }).first().click()
    await expect(page).toHaveURL(/register/)
  })
})

test.describe('Register page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('page loads with key registration fields', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({
      timeout: 10_000,
    })
    await expect(
      page.locator('input[type="password"], input[name="password"]').first(),
    ).toBeVisible()
  })

  test('submit with empty fields stays on register page', async ({ page }) => {
    await page.getByRole('button', { name: /register|create|sign up|submit/i }).click()
    await expect(page).toHaveURL(/register/)
  })
})

test.describe('Forgot password page', () => {
  test('page loads with email field', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({
      timeout: 10_000,
    })
  })
})

test.describe('Logged-out access gates', () => {
  test('/account redirects to login when not signed in', async ({ page }) => {
    await page.goto('/account')
    // Should redirect to auth/login
    await expect(page).toHaveURL(/login|auth/, { timeout: 8_000 })
  })

  test('/order-request redirects to login or cart when not signed in', async ({ page }) => {
    await page.goto('/order-request')
    // page.tsx redirects to /cart; if cart also gates, may go on to login
    await expect(page).toHaveURL(/login|auth|cart/, { timeout: 8_000 })
  })

  test('/cart redirects or shows empty state when not signed in', async ({ page }) => {
    await page.goto('/cart')
    // Either redirects to login, or shows an empty cart / sign-in prompt
    const url = page.url()
    const body = await page.locator('body').textContent()
    const isGated =
      /login|auth/.test(url) || /sign in|log in|empty|no items/i.test(body ?? '')
    expect(isGated, '/cart shows no access gate for logged-out visitor').toBe(true)
  })
})
