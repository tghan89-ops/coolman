import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    // e2e/ holds Playwright specs — run those with `pnpm e2e`, not vitest.
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@payload-config': path.resolve(__dirname, './payload.config.ts'),
    },
  },
})
