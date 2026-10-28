import { z } from 'zod';

export const enquirySchema = z.object({
  petName: z
    .preprocess(
      (value) => (typeof value === 'string' ? value.trim() : ''),
      z.string().max(50, 'Keep this under 50 characters.'),
    )
    .transform((value) => (value === '' ? undefined : value)),
  question: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z
      .string()
      .min(1, 'Your question is required.')
      .min(10, 'Your question must be at least 10 characters.')
      .max(2000, 'Keep this under 2000 characters.'),
  ),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
