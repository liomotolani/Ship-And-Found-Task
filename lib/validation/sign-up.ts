import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z
      .string()
      .min(1, 'Full name is required.')
      .min(2, 'Full name must be at least 2 characters.')
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
  membershipNumber: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'Membership number is required.'),
  ),
  terms: z
    .boolean()
    .refine(
      (value) => value === true,
      'Please confirm that you have read and agree to the terms and conditions.',
    ),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
