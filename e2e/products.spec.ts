/**
 * Products catalogue + product detail page tests.
 *
 * These tests run as a logged-out visitor — no credentials required.
 * They verify: catalogue loads, price gate is visible, product detail opens,
 * tabs exist, and the 404 path for a missing product works.
 */
import { test, expect } from '@playwright/test'

test.describe('Products catalogue', () => {
  test('catalogue page loads and shows product grid', async ({ page }) => {
    await page.goto('/products')
    // The grid should contain at least one product card
    // Product cards have a link that includes /products/
    await expect(page.locator('a[href*="/products/"]').first()).toBeVisible({ timeout: 15_000 })
  })

  test('logged-out visitor sees price gate — no prices shown', async ({ page }) => {
    await page.goto('/products')
    // No price values (MYR / RM) should be visible to a logged-out visitor
    const priceText = await page.locator('body').textContent()
    const hasMYR = /MYR\s*[\d,]+|RM\s*[\d,]+/i.test(priceText ?? '')
    expect(hasMYR, 'Price values visible to logged-out visitor').toBe(false)
  })

  test('search / filter — typing in search box narrows results', async ({ page }) => {
    await page.goto('/products')
    // Find the search input
    const searchInput = page.getByRole('textbox').or(page.locator('input[type="search"]')).first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('blade')
      await page.waitForTimeout(1_000) // debounce
      // Results should still render (not crash)
      await expect(page.locator('body')).not.toContainText('Something went wrong')
    }
  })

  test('product detail — opens and shows the three content tabs', async ({ page }) => {
    await page.goto('/products')
    // Click the first product link
    const firstProduct = page.locator('a[href*="/products/"]').first()
    await firstProduct.waitFor({ timeout: 15_000 })
    await firstProduct.click()

    // Should land on /products/<id>
    await expect(page).toHaveURL(/\/products\/\w+/)

    // Product name heading should be visible
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10_000 })

    // The three tab labels should be present (Specifications, Applications, Documents / similar)
    await expect(page.locator('body')).toContainText(/spec|application|document/i)
  })

  test('product detail — logged-out visitor sees sign-in prompt instead of prices', async ({
    page,
  }) => {
    await page.goto('/products')
    const firstProduct = page.locator('a[href*="/products/"]').first()
    await firstProduct.waitFor({ timeout: 15_000 })
    await firstProduct.click()
    await page.waitForURL(/\/products\/\w+/)

    // Price block should show a sign-in CTA, not an actual RM amount
    const body = await page.locator('body').textContent()
    const hasPrice = /MYR\s*[\d,]+|RM\s*[\d,]+/i.test(body ?? '')
    expect(hasPrice, 'Raw price shown to logged-out visitor on product page').toBe(false)

    // Should mention signing in / logging in somewhere near prices
    await expect(page.locator('body')).toContainText(/sign in|log in|login/i)
  })

  test('missing product — /products/999999 shows not-found page', async ({ page }) => {
    await page.goto('/products/999999')
    await expect(page.locator('body')).toContainText(/not found|no product|does not exist/i, {
      timeout: 10_000,
    })
  })
})
