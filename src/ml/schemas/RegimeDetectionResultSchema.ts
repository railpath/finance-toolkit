import { z } from 'zod';
import { HMMModelSchema } from './HMMModelSchema';

/**
 * Zod schema for regime detection result
 */
export const RegimeDetectionResultSchema = z.object({
  currentRegime: z.string(),
  regimes: z.array(z.string()),
  stateSequence: z.array(z.number().int().nonnegative()),
  stateProbabilities: z.array(z.array(z.number().min(0).max(1))),
  model: HMMModelSchema,
  confidence: z.number().min(0).max(1),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type RegimeDetectionResult = z.infer<typeof RegimeDetectionResultSchema>;

/**
 * Validated type after parsing
 */
export type RegimeDetectionResultValidated = z.output<typeof RegimeDetectionResultSchema>;

