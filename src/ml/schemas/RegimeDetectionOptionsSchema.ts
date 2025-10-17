import { z } from 'zod';

/**
 * Zod schema for regime detection options
 */
export const RegimeDetectionOptionsSchema = z.object({
  numStates: z.number().int().positive().default(3),
  features: z.union([
    z.literal('default'),
    z.array(z.enum(['returns', 'volatility', 'rsi', 'macd', 'ema'])),
    z.array(z.array(z.number())),
  ]).default('default'),
  featureWindow: z.number().int().positive().default(20),
  maxIterations: z.number().int().positive().default(100),
  convergenceTolerance: z.number().positive().default(1e-6),
  stateLabels: z.array(z.string()).optional(),
}).refine((data) => {
  // If stateLabels provided, length must match numStates
  if (data.stateLabels && data.stateLabels.length !== data.numStates) {
    return false;
  }
  return true;
}, {
  message: 'stateLabels length must match numStates',
});

/**
 * TypeScript types derived from Zod schemas
 */
export type RegimeDetectionOptions = z.infer<typeof RegimeDetectionOptionsSchema>;

/**
 * Validated type after parsing
 */
export type RegimeDetectionOptionsValidated = z.output<typeof RegimeDetectionOptionsSchema>;

