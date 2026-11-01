import { z } from 'zod';

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.preprocess(
    (value) => (typeof value === 'string' ? value : ''),
    z
      .string()
      .min(1, 'Password is required.')
      .min(12, 'Use at least 12 characters.'),
  ),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
