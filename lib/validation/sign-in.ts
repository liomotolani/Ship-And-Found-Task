import { z } from 'zod';

export const signInSchema = z.object({
  email: z.preprocess(
    (value) =>
      typeof value === 'string' ? value.trim().toLowerCase() : '',
    z
      .string()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.'),
  ),
  password: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'Password is required.'),
  ),
});

export type SignInInput = z.infer<typeof signInSchema>;
