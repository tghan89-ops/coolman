// e2e/auth.fixture.ts
//
// Placeholder for logged-in E2E flows (Group 5 order-submission guards, Group 7 admin
// Acknowledge). Not wired into any spec yet — the guard logic is covered by the vitest
// suite for now. When you add browser tests that need a session:
//
//   1. Seed a known contractor (verified email) and a known admin in the test DB.
//   2. Either POST to /api/contractors/login (or the admin login route) and reuse the
//      `coolman-token` cookie via storageState, OR drive the login form once and save
//      `await context.storageState({ path: 'e2e/.auth/contractor.json' })`.
//   3. Re-export `test`/`expect` from here with that storageState applied.
//
// Kept as a stub so the structure is obvious to whoever extends this.

export {}
