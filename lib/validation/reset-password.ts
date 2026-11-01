import { z } from 'zod';
import { passwordFieldSchema } from '@/lib/validation/password';

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: passwordFieldSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
