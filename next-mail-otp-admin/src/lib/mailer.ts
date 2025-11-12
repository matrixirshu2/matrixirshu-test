import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(email: string, code: string) {
  if (!process.env.FROM_EMAIL) throw new Error('FROM_EMAIL not set');
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: `Your login code: ${code}`,
    text: `Use this code to log in: ${code}\nIt expires in 5 minutes.`,
  });
}