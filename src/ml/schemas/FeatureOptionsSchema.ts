import { z } from 'zod';

/**
 * Zod schema for feature extraction options
 */
export const FeatureOptionsSchema = z.object({
  type: z.enum(['default', 'custom', 'advanced']),
  window: z.number().int().positive().default(20),
  includeFeatures: z.array(z.enum(['returns', 'volatility', 'rsi', 'macd', 'ema'])).optional(),
  customFeatures: z.array(z.array(z.number())).optional(),
}).refine((data) => {
  // If type is custom, customFeatures must be provided
  if (data.type === 'custom' && !data.customFeatures) {
    return false;
  }
  // If type is advanced, includeFeatures must be provided
  if (data.type === 'advanced' && !data.includeFeatures) {
    return false;
  }
  return true;
}, {
  message: 'Custom features required for custom type, includeFeatures required for advanced type',
});

/**
 * TypeScript types derived from Zod schemas
 */
export type FeatureOptions = z.infer<typeof FeatureOptionsSchema>;

/**
 * Validated type after parsing
 */
export type FeatureOptionsValidated = z.output<typeof FeatureOptionsSchema>;

