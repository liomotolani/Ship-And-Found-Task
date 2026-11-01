import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.preprocess(
    (value) =>
      typeof value === 'string' ? value.trim().toLowerCase() : '',
    z
      .string()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.'),
  ),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
