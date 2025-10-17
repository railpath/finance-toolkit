import { z } from 'zod';

/**
 * Zod schema for Viterbi algorithm result
 */
export const ViterbiResultSchema = z.object({
  path: z.array(z.number().int().nonnegative()),
  logProbability: z.number(),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type ViterbiResult = z.infer<typeof ViterbiResultSchema>;

/**
 * Validated type after parsing
 */
export type ViterbiResultValidated = z.output<typeof ViterbiResultSchema>;

