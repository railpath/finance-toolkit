import { z } from 'zod';
import { HMMModelSchema } from './HMMModelSchema';

/**
 * Zod schema for Baum-Welch training algorithm options
 */
export const BaumWelchOptionsSchema = z.object({
  maxIterations: z.number().int().positive(),
  convergenceTolerance: z.number().positive(),
  initialModel: HMMModelSchema.optional(),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type BaumWelchOptions = z.infer<typeof BaumWelchOptionsSchema>;

/**
 * Validated type after parsing
 */
export type BaumWelchOptionsValidated = z.output<typeof BaumWelchOptionsSchema>;

