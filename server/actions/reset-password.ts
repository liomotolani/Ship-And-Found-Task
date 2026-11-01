'use server';

import { auth } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validation/reset-password';

export type ResetPasswordState = {
  error?: string;
  field?: 'newPassword';
  success?: string;
};

const invalidLink = 'This reset link is invalid or has expired.';
const successMessage = 'Your password has been reset.';

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const result = resetPasswordSchema.safeParse({
    token: formData.get('token'),
    newPassword: formData.get('newPassword'),
  });

  if (!result.success) {
    const issue = result.error.issues[0];

    if (issue?.path[0] === 'token') {
      return { error: invalidLink };
    }

    return {
      error: issue?.message ?? invalidLink,
      field: 'newPassword',
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: result.data.newPassword,
        token: result.data.token,
      },
    });
  } catch {
    return { error: invalidLink };
  }

  return { success: successMessage };
}
