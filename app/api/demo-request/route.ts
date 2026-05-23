import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/send'
import { getGlobal } from '@/lib/payload'

// POST /api/demo-request
// Body: { name, company?, phone, model, project?, notes? }
// Sends a Shibuya demo request email to the address stored in Settings → demo_request_email.
// Falls back to alan@diamantool.com if the setting is blank.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const FALLBACK_EMAIL = 'alan@diamantool.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body?.name ?? '').trim()
    const company = String(body?.company ?? '').trim()
    const phone = String(body?.phone ?? '').trim()
    const model = String(body?.model ?? '').trim()
    const project = String(body?.project ?? '').trim()
    const notes = String(body?.notes ?? '').trim()

    if (!name || !phone || !model) {
      return NextResponse.json(
        { error: 'Name, phone number, and machine model are required.' },
        { status: 400 },
      )
    }
    if (name.length > 200 || company.length > 200 || notes.length > 2000) {
      return NextResponse.json({ error: 'Submission too large.' }, { status: 400 })
    }

    // Read demo_request_email from Settings global. overrideAccess: true is
    // required because Settings.access.read is restricted to adminUsers.
    let recipient = FALLBACK_EMAIL
    try {
      const settings = await getGlobal('settings', { overrideAccess: true })
      const setting = String(settings?.demo_request_email ?? '').trim()
      if (setting) recipient = setting
    } catch {
      // Fall back silently — email still sends to the hardcoded fallback.
    }

    const html = `
      <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0a1628">
        <h2 style="margin:0 0 12px 0">Shibuya demo request</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
          <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
          ${company ? `<tr><td><b>Company</b></td><td>${escapeHtml(company)}</td></tr>` : ''}
          <tr><td><b>Phone</b></td><td>${escapeHtml(phone)}</td></tr>
          <tr><td><b>Model of interest</b></td><td>${escapeHtml(model)}</td></tr>
          ${project ? `<tr><td><b>Project / application</b></td><td>${escapeHtml(project)}</td></tr>` : ''}
        </table>
        ${
          notes
            ? `<h3 style="margin:20px 0 8px 0">Additional notes</h3>
               <div style="white-space:pre-wrap;border-left:3px solid #3b82f6;padding:8px 12px;background:#f8f7f4">${escapeHtml(notes)}</div>`
            : ''
        }
        <p style="margin-top:24px;font-size:12px;color:#475569">
          Sent from the Shibuya demo request form on coolman.com.my.
        </p>
      </div>
    `

    const result = await sendEmail({
      to: recipient,
      subject: `Shibuya demo request: ${name}${company ? ` (${company})` : ''} — ${model}`,
      html,
    })

    if (!result.success) {
      console.error('[demo-request] send failed:', result.error)
      return NextResponse.json(
        { error: 'We could not send your request. Please try again or contact us via WhatsApp.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[demo-request]', err)
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}
