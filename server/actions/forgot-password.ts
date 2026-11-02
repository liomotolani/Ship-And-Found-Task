'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getClientIp, isLimited, recordAttempt } from '@/lib/rate-limit';
import { forgotPasswordSchema } from '@/lib/validation/forgot-password';

export type ForgotPasswordState = {
  error?: string;
  field?: 'email';
  success?: string;
};

const successMessage = 'If an account exists, we have sent a link';

export async function forgotPasswordAction(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const requestHeaders = await headers();
  const ip = getClientIp(requestHeaders);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const emailKey = `forgot:email:${email}`;
  const ipKey = `forgot:ip:${ip}`;

  if (await isLimited(emailKey, 3, 60 * 60 * 1000)) {
    console.log(`[rate-limit] blocked ${emailKey}`);
    return { error: 'Too many attempts. Please try again later.' };
  }

  if (await isLimited(ipKey, 10, 60 * 60 * 1000)) {
    console.log(`[rate-limit] blocked ${ipKey}`);
    return { error: 'Too many attempts. Please try again later.' };
  }

  await recordAttempt(emailKey);
  await recordAttempt(ipKey);

  const result = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    const issue = result.error.issues[0];

    return {
      error: issue?.message ?? 'Email is required.',
      field: 'email',
    };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: result.data.email,
        redirectTo: '/reset-password',
      },
    });
  } catch {
    return { success: successMessage };
  }

  return { success: successMessage };
}
