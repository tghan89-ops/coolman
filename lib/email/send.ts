interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Single entry point for all email sends in this project.
 * When RESEND_API_KEY is absent (dev/CI), logs to console instead of sending.
 * Never call the Resend SDK directly — always use this wrapper.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[email/send] No RESEND_API_KEY — would have sent:', {
      to: params.to,
      subject: params.subject,
    })
    return { success: true, messageId: 'dev-no-send' }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const from = params.from ?? (process.env.RESEND_FROM_EMAIL ?? 'orders@tx.coolman.my')

    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      html: params.html,
    })

    if (error) {
      console.error('[email/send] Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[email/send] Exception:', message)
    return { success: false, error: message }
  }
}
