import { z } from 'zod';
import { HMMModelSchema } from './HMMModelSchema';

/**
 * Zod schema for HMM training options
 */
export const TrainHMMOptionsSchema = z.object({
  numStates: z.number().int().positive(),
  maxIterations: z.number().int().positive().default(100),
  convergenceTolerance: z.number().positive().default(1e-6),
  initialModel: HMMModelSchema.optional(),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type TrainHMMOptions = z.infer<typeof TrainHMMOptionsSchema>;

/**
 * Validated type after parsing
 */
export type TrainHMMOptionsValidated = z.output<typeof TrainHMMOptionsSchema>;

