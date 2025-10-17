import { z } from 'zod';

/**
 * Zod schema for forward algorithm result
 */
export const ForwardResultSchema = z.object({
  alpha: z.array(z.array(z.number().nonnegative())),
  scalingFactors: z.array(z.number().positive()),
  logLikelihood: z.number(),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type ForwardResult = z.infer<typeof ForwardResultSchema>;

/**
 * Validated type after parsing
 */
export type ForwardResultValidated = z.output<typeof ForwardResultSchema>;

