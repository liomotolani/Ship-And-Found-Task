'use server';

import { auth } from '@/lib/auth';
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
