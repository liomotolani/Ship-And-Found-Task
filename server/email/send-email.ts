import type { EmailType } from '@prisma/client';
import nodemailer from 'nodemailer';
import { createEmailLog } from '@/server/data/email-log';

type SendEmailInput = {
  type: EmailType;
  to: string;
  subject: string;
  text: string;
};

function errorCode(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }

  return 'SEND_FAILED';
}

export async function sendEmail(input: SendEmailInput) {
  try {
    const user = process.env.GMAIL_USER;
    const password = process.env.GMAIL_APP_PASSWORD;

    if (!user || !password) {
      await createEmailLog({
        type: input.type,
        recipient: input.to,
        status: 'FAILED',
        errorCode: 'MISSING_CREDENTIALS',
      });

      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: password,
      },
    });

    await transporter.sendMail({
      from: user,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });

    await createEmailLog({
      type: input.type,
      recipient: input.to,
      status: 'SENT',
    });

    return true;
  } catch (error) {
    try {
      await createEmailLog({
        type: input.type,
        recipient: input.to,
        status: 'FAILED',
        errorCode: errorCode(error),
      });
    } catch {
      return false;
    }

    return false;
  }
}
