'use server';

import { createHash } from 'node:crypto';
import { auth } from '@/lib/auth';
import { getPendingVerificationEmail } from '@/lib/verification-cookie';
import { verifyEmailSchema } from '@/lib/validation/verify-email';
import { prisma } from '@/server/data/prisma';

export type VerifyEmailState = {
  error?: string;
  field?: 'code';
  success?: string;
};

const genericError =
  'Something went wrong. Nothing was changed. Try again.';

function apiErrorCode(error: unknown) {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const body = 'body' in error ? error.body : undefined;

  if (
    typeof body === 'object' &&
    body !== null &&
    'code' in body &&
    typeof body.code === 'string'
  ) {
    return body.code;
  }

  return undefined;
}

function hashCode(email: string, code: string) {
  return createHash('sha256').update(`${email}:${code}`).digest('hex');
}

export async function verifyEmailAction(
  _previousState: VerifyEmailState,
  formData: FormData,
): Promise<VerifyEmailState> {
  const email = await getPendingVerificationEmail();

  if (!email) {
    return { error: 'Your verification session has expired. Sign up again.' };
  }

  const result = verifyEmailSchema.safeParse({
    code: formData.get('code'),
  });

  if (!result.success) {
    const issue = result.error.issues[0];

    return {
      error: issue?.message ?? 'Enter the 6-digit code.',
      field: 'code',
    };
  }

  const code = result.data.code;
  const codeHash = hashCode(email, code);

  try {
    const used = await prisma.usedVerificationCode.findUnique({
      where: {
        email_codeHash: { email, codeHash },
      },
    });

    if (used) {
      return {
        error: 'That code has already been used. Request a new code.',
      };
    }
  } catch {
    return { error: genericError };
  }

  try {
    await auth.api.verifyEmailOTP({
      body: { email, otp: code },
    });
  } catch (error) {
    const errorCode = apiErrorCode(error);

    if (errorCode === 'OTP_EXPIRED') {
      return { error: 'That code has expired. Request a new code.' };
    }

    if (errorCode === 'TOO_MANY_ATTEMPTS') {
      return { error: 'Too many attempts. Request a new code.' };
    }

    if (errorCode === 'INVALID_OTP' || errorCode === 'USER_NOT_FOUND') {
      return {
        error: 'That code is incorrect. Check the email and try again.',
      };
    }

    return { error: genericError };
  }

  try {
    await prisma.usedVerificationCode.create({
      data: { email, codeHash },
    });
  } catch {
  }

  return {
    success: 'Your email is confirmed. You can sign in.',
  };
}
