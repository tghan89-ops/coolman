// lib/__tests__/contact-submit.test.ts
// Critical path coverage for /api/contact/submit (P0 audit sweep 2026-05-16).
// Validates: required-field rejection, email-format rejection, oversized-payload rejection,
// silent honeypot success, happy path.

import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/email/send', () => ({
  sendEmail: vi.fn(async () => ({ success: true, messageId: 'test' })),
}))

import { POST } from '@/app/api/contact/submit/route'
import { sendEmail } from '@/lib/email/send'

const sendEmailMock = sendEmail as unknown as ReturnType<typeof vi.fn>

function makeReq(body: any): any {
  return { json: async () => body }
}

describe('/api/contact/submit', () => {
  beforeEach(() => {
    sendEmailMock.mockClear()
  })

  it('rejects when required fields are missing', async () => {
    const res = await POST(makeReq({ name: '', email: '', message: '' }))
    expect(res.status).toBe(400)
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('rejects malformed email addresses', async () => {
    const res = await POST(makeReq({ name: 'Alan', email: 'not-an-email', message: 'hi' }))
    expect(res.status).toBe(400)
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('rejects oversized messages', async () => {
    const big = 'x'.repeat(5001)
    const res = await POST(makeReq({ name: 'Alan', email: 'a@b.co', message: big }))
    expect(res.status).toBe(400)
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('silently succeeds when honeypot is filled (bot trap)', async () => {
    const res = await POST(
      makeReq({ name: 'Alan', email: 'a@b.co', message: 'hi', website: 'spam.example' }),
    )
    expect(res.status).toBe(200)
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('sends email on valid submission', async () => {
    const res = await POST(
      makeReq({ name: 'Alan', email: 'alan@coolman.com.my', message: 'Need a quote.' }),
    )
    expect(res.status).toBe(200)
    expect(sendEmailMock).toHaveBeenCalledOnce()
    const call = sendEmailMock.mock.calls[0][0] as any
    expect(call.subject).toContain('Alan')
    expect(call.html).toContain('alan@coolman.com.my')
  })

  it('escapes HTML to prevent injection in the outbound email', async () => {
    await POST(
      makeReq({
        name: '<script>x</script>',
        email: 'a@b.co',
        message: 'Hello & goodbye',
      }),
    )
    const call = sendEmailMock.mock.calls[0][0] as any
    expect(call.html).not.toContain('<script>x</script>')
    expect(call.html).toContain('&lt;script&gt;')
    expect(call.html).toContain('Hello &amp; goodbye')
  })
})
