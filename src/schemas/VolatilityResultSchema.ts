import { z } from 'zod';

/**
 * Zod schema for volatility calculation result
 */
export const VolatilityResultSchema = z.object({
  value: z.number().nonnegative(),
  method: z.string(),
  annualized: z.number().nonnegative().optional(),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type VolatilityResult = z.infer<typeof VolatilityResultSchema>;

/**
 * Validated type after parsing
 */
export type VolatilityResultValidated = z.output<typeof VolatilityResultSchema>;
