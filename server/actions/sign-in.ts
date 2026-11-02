'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getClientIp, isLimited, recordAttempt } from '@/lib/rate-limit';
import { setPendingVerificationEmail } from '@/lib/verification-cookie';
import { roleHomePath } from '@/lib/role-home';
import { signInSchema } from '@/lib/validation/sign-in';

export type SignInField = 'email' | 'password';

export type SignInState = {
  error?: string;
  field?: SignInField;
};

const invalidCredentials = 'Email or password is incorrect.';

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

export async function signInAction(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const requestHeaders = await headers();
  const ip = getClientIp(requestHeaders);
  const ipKey = `signin:ip:${ip}`;
  const emailKey = `signin:email:${String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()}`;

  if (await isLimited(ipKey, 20, 15 * 60 * 1000)) {
    console.log(`[rate-limit] blocked ${ipKey}`);
    return { error: 'Too many attempts. Please try again later.' };
  }

  if (await isLimited(emailKey, 5, 15 * 60 * 1000)) {
    console.log(`[rate-limit] blocked ${emailKey}`);
    return { error: 'Too many attempts. Please try again later.' };
  }

  await recordAttempt(ipKey);

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (session) {
    redirect(roleHomePath(session.user.role));
  }

  const result = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    const issue = result.error.issues[0];

    return {
      error: issue?.message ?? invalidCredentials,
      field: issue?.path[0] as SignInField | undefined,
    };
  }

  let role: string | undefined;

  try {
    const response = await auth.api.signInEmail({
      body: {
        email: result.data.email,
        password: result.data.password,
      },
      headers: requestHeaders,
    });

    role = (response.user as { role?: string } | undefined)?.role;
  } catch (error) {
    const code = apiErrorCode(error);

    if (code === 'EMAIL_NOT_VERIFIED') {
      const email = String(formData.get('email') ?? '').trim().toLowerCase();
      await setPendingVerificationEmail(email);
      redirect('/verify-email?reason=unconfirmed');
    }

    if (code === 'INVALID_EMAIL_OR_PASSWORD' || code === 'INVALID_PASSWORD') {
      await recordAttempt(emailKey);
    }

    return { error: invalidCredentials };
  }

  redirect(roleHomePath(role));
}
