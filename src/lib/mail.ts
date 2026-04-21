import nodemailer from 'nodemailer';
import { resend } from './resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}

export async function sendEmail(
  options: EmailOptions,
  smtpConfig?: {
    host: string;
    port: string;
    user: string;
    password: string;
    provider?: string;
  }
) {
  // If SMTP config is provided, use Nodemailer
  if (smtpConfig && smtpConfig.host && smtpConfig.user && smtpConfig.password) {
    const isGmail = smtpConfig.host.includes('gmail.com');
    const transporter = nodemailer.createTransport({
      ...(isGmail ? { service: 'gmail' } : {
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port) || 465,
        secure: parseInt(smtpConfig.port) === 465,
      }),
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password.replace(/\s+/g, ''), // Strip spaces from App Password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"${options.fromName || 'Flodon'}" <${smtpConfig.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: smtpConfig.user,
    });

    return { success: true, messageId: info.messageId };
  }

  // Fallback to Resend if no SMTP config
  if (!resend) {
    throw new Error('Email service not configured. Please set up SMTP or Resend.');
  }

  const { data, error } = await resend.emails.send({
    from: `${options.fromName || 'Flodon'} <team@flodon.in>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, messageId: data?.id };
}
