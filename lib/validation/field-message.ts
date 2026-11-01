import type { z } from 'zod';

export function fieldMessage(schema: z.ZodType, value: unknown) {
  const result = schema.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
}
