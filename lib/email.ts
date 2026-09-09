import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendJobEmail(email: string, address: string, link: string) {
  try {
    const data = await resend.emails.send({
      from: 'Crown Tracker <onboarding@resend.dev>',
      to: [email],
      subject: `Action Required: Update Job Stages for ${address}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Job Assigned</h2>
          <p>A new job has been created for the following address:</p>
          <p><strong>${address}</strong></p>
          <p>Please click the button below to access the mobile tracker and update the production stages.</p>
          <a href="${link}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Open Job Tracker
          </a>
        </div>
      `,
    })
    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}