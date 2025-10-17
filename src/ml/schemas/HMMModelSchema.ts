import { z } from 'zod';
import { EmissionParamsSchema } from './EmissionParamsSchema';

/**
 * Zod schema for HMM model
 */
export const HMMModelSchema = z.object({
  numStates: z.number().int().positive(),
  numFeatures: z.number().int().positive(),
  transitionMatrix: z.array(z.array(z.number().min(0).max(1))),
  emissionParams: z.array(EmissionParamsSchema),
  initialProbs: z.array(z.number().min(0).max(1)),
  logLikelihood: z.number().optional(),
}).refine((data) => {
  // Validate transition matrix dimensions
  if (data.transitionMatrix.length !== data.numStates) return false;
  if (!data.transitionMatrix.every(row => row.length === data.numStates)) return false;
  
  // Validate emission params length
  if (data.emissionParams.length !== data.numStates) return false;
  
  // Validate initial probs length
  if (data.initialProbs.length !== data.numStates) return false;
  
  return true;
}, {
  message: 'Model dimensions must be consistent',
});

/**
 * TypeScript types derived from Zod schemas
 */
export type HMMModel = z.infer<typeof HMMModelSchema>;

/**
 * Validated type after parsing
 */
export type HMMModelValidated = z.output<typeof HMMModelSchema>;

