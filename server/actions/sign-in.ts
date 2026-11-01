'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { roleHomePath } from '@/lib/role-home';
import { signInSchema } from '@/lib/validation/sign-in';

export type SignInField = 'email' | 'password';

export type SignInState = {
  error?: string;
  field?: SignInField;
};

const invalidCredentials = 'Email or password is incorrect.';
const unconfirmed = 'Confirm your email first. We have sent a new link.';

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
        callbackURL: '/confirm-email',
      },
      headers: requestHeaders,
    });

    role = (response.user as { role?: string } | undefined)?.role;
  } catch (error) {
    if (apiErrorCode(error) === 'EMAIL_NOT_VERIFIED') {
      return { error: unconfirmed };
    }

    return { error: invalidCredentials };
  }

  redirect(roleHomePath(role));
}
