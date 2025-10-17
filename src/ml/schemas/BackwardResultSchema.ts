import { z } from 'zod';

/**
 * Zod schema for backward algorithm result
 */
export const BackwardResultSchema = z.object({
  beta: z.array(z.array(z.number().nonnegative())),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type BackwardResult = z.infer<typeof BackwardResultSchema>;

/**
 * Validated type after parsing
 */
export type BackwardResultValidated = z.output<typeof BackwardResultSchema>;

