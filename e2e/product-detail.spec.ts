// e2e/product-detail.spec.ts — Group 10 step 4 (product detail + 404 on bad id)
import { test, expect } from '@playwright/test'

test.describe('Product detail', () => {
  test('clicking a product card opens its detail page', async ({ page }) => {
    await page.goto('/products')

    const firstCard = page.locator('a[href*="/products/"]').first()
    test.skip((await firstCard.count()) === 0, 'No products — seed prerequisites not set up')

    const href = await firstCard.getAttribute('href')
    await firstCard.click()
    await page.waitForLoadState('domcontentloaded')

    // We're on a /products/<something> route and the page rendered.
    expect(page.url()).toContain('/products/')
    expect(page.url()).not.toMatch(/\/products\/?$/)
    await expect(page.locator('body')).toBeVisible()
    if (href) expect(page.url()).toContain(href)
  })

  test('a non-existent product id shows the 404 page, not a crash', async ({ page }) => {
    const res = await page.goto('/products/999999')

    // Next.js notFound() returns a 404 status and renders the not-found UI.
    expect(res?.status()).toBe(404)
    await expect(page.locator('body')).toContainText(/not found|404|page (you|you’re) looking/i)
  })
})
