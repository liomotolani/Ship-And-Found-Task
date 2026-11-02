import { z } from 'zod';

export const passwordHint = 'Use at least 12 characters.';

export const passwordFieldSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : ''),
  z
    .string()
    .min(1, 'Password is required.')
    .min(12, 'Use at least 12 characters.'),
);
