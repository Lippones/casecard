import { env } from '@/env'
import { Resend } from 'resend'

const resend = new Resend(env.RESEND_API_KEY)

interface VerificationEmailProps {
  subject: string
  to: string
  text: string
  attachments: {
    content?: string | Buffer
    filename?: string | false | undefined
    path?: string
    contentType?: string
  }[]
}

export async function sendEmail({
  subject,
  to,
  attachments,
  text,
}: VerificationEmailProps) {
  return await resend.emails.send({
    from: `CaseCard <${env.EMAIL_FROM}>`,
    to,
    subject,
    attachments,
    text,
  })
}
