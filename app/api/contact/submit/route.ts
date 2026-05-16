import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/send'

// POST /api/contact/submit
// Body: { name, email, company?, phone?, message }
// Sends a notification email to the Coolman sales inbox.
// Recipient resolves from env COOLMAN_CONTACT_RECIPIENT, fallback sales@coolman.com.my.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body?.name ?? '').trim()
    const email = String(body?.email ?? '').trim()
    const company = String(body?.company ?? '').trim()
    const phone = String(body?.phone ?? '').trim()
    const message = String(body?.message ?? '').trim()
    const honeypot = String(body?.website ?? '').trim()

    // Honeypot — bots fill this hidden field; humans don't see it.
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 },
      )
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (message.length > 5000 || name.length > 200) {
      return NextResponse.json({ error: 'Submission too large.' }, { status: 400 })
    }

    // TEMP TEST RECIPIENT — see TODOS Group 6: switch back to sales@coolman.com.my before launch.
    const recipient = (process.env.COOLMAN_CONTACT_RECIPIENT || 'ghtan@sonicon.com.my').trim()

    const html = `
      <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0a1628">
        <h2 style="margin:0 0 12px 0">New contact form submission</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
          <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
          ${company ? `<tr><td><b>Company</b></td><td>${escapeHtml(company)}</td></tr>` : ''}
          ${phone ? `<tr><td><b>Phone</b></td><td>${escapeHtml(phone)}</td></tr>` : ''}
        </table>
        <h3 style="margin:20px 0 8px 0">Message</h3>
        <div style="white-space:pre-wrap;border-left:3px solid #3b82f6;padding:8px 12px;background:#f8f7f4">${escapeHtml(message)}</div>
        <p style="margin-top:24px;font-size:12px;color:#475569">
          Sent from the Coolman public contact form. Reply directly to ${escapeHtml(email)} to respond to the sender.
        </p>
      </div>
    `

    const result = await sendEmail({
      to: recipient,
      subject: `Contact form: ${name}${company ? ` (${company})` : ''}`,
      html,
    })

    if (!result.success) {
      console.error('[contact/submit] send failed:', result.error)
      return NextResponse.json(
        { error: 'We could not send your message. Please try again or email us directly.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact/submit]', err)
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}
