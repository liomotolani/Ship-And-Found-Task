import type { EmailType } from '@prisma/client';
import nodemailer from 'nodemailer';
import { createEmailLog } from '@/server/data/email-log';

type SendEmailInput = {
  type: EmailType;
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type SendEmailOptions = {
  onError?: (code: string) => void;
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

export async function sendEmail(
  input: SendEmailInput,
  options?: SendEmailOptions,
) {
  try {
    const user = process.env.GMAIL_USER;
    const password = process.env.GMAIL_APP_PASSWORD;

    if (!user || !password) {
      const code = 'MISSING_CREDENTIALS';

      await createEmailLog({
        type: input.type,
        recipient: input.to,
        status: 'FAILED',
        errorCode: code,
      });

      options?.onError?.(code);

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
      html: input.html,
    });

    await createEmailLog({
      type: input.type,
      recipient: input.to,
      status: 'SENT',
    });

    console.log(`[email] sent ${input.type} to ${input.to}.`);

    return true;
  } catch (error) {
    const code = errorCode(error);
    const message =
      error instanceof Error ? error.message : 'Unknown email error';

    console.error(
      `[email] failed ${input.type} to ${input.to}: ${code}: ${message}`,
    );

    options?.onError?.(code);

    try {
      await createEmailLog({
        type: input.type,
        recipient: input.to,
        status: 'FAILED',
        errorCode: code,
      });
    } catch {
      return false;
    }

    return false;
  }
}
