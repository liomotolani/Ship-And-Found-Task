import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z
      .string()
      .min(1, 'Full name is required.')
      .max(100, 'Keep this under 100 characters.'),
  ),
  email: z.preprocess(
    (value) =>
      typeof value === 'string' ? value.trim().toLowerCase() : '',
    z
      .string()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.'),
  ),
  password: z.preprocess(
    (value) => (typeof value === 'string' ? value : ''),
    z
      .string()
      .min(1, 'Password is required.')
      .min(12, 'Use at least 12 characters.'),
  ),
  age: z
    .boolean()
    .refine((value) => value === true, 'I am 18 or over is required.'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
