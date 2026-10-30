'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { signUpSchema } from '@/lib/validation/sign-up';

export type SignUpField = 'name' | 'email' | 'password' | 'age';

export type SignUpState = {
  error?: string;
  field?: SignUpField;
  success?: string;
};

const genericError =
  'Something went wrong. Nothing was changed. Try again.';

const successMessage = 'Check your email to confirm your account.';

function isUserAlreadyExists(error: unknown) {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const body = 'body' in error ? error.body : undefined;

  return (
    typeof body === 'object' &&
    body !== null &&
    'code' in body &&
    body.code === 'USER_ALREADY_EXISTS'
  );
}

export async function signUpAction(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (session) {
    redirect('/');
  }

  const result = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    age: formData.get('age') === 'on',
  });

  if (!result.success) {
    const issue = result.error.issues[0];

    return {
      error: issue?.message ?? genericError,
      field: issue?.path[0] as SignUpField | undefined,
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      },
      headers: requestHeaders,
    });
  } catch (error) {
    if (!isUserAlreadyExists(error)) {
      return { error: genericError };
    }
  }

  return { success: successMessage };
}
