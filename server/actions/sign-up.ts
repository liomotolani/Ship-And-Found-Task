'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { signUpSchema } from '@/lib/validation/sign-up';

export type SignUpField =
  | 'name'
  | 'email'
  | 'password'
  | 'membershipNumber'
  | 'terms';

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
  const requestStart = performance.now();
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (session) {
    console.log(
      `[timing] sign-up total: ${(performance.now() - requestStart).toFixed(1)} ms`,
    );
    redirect('/');
  }

  const validationStart = performance.now();
  const result = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    membershipNumber: formData.get('membershipNumber'),
    terms: formData.get('terms') === 'on',
  });
  console.log(
    `[timing] sign-up validation: ${(performance.now() - validationStart).toFixed(3)} ms`,
  );

  if (!result.success) {
    const issue = result.error.issues[0];

    console.log(
      `[timing] sign-up total: ${(performance.now() - requestStart).toFixed(1)} ms`,
    );
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
        membershipNumber: result.data.membershipNumber,
        termsAcceptedAt: new Date(),
        callbackURL: '/confirm-email',
      },
      headers: requestHeaders,
    });
  } catch (error) {
    if (!isUserAlreadyExists(error)) {
      console.log(
        `[timing] sign-up total: ${(performance.now() - requestStart).toFixed(1)} ms`,
      );
      return { error: genericError };
    }
  }

  console.log(
    `[timing] sign-up total: ${(performance.now() - requestStart).toFixed(1)} ms`,
  );
  return { success: successMessage };
}
