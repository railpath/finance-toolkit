import { z } from 'zod';

/**
 * Zod schema for Expected Shortfall calculation result
 */
export const ExpectedShortfallResultSchema = z.object({
  /** Expected Shortfall value (expected loss beyond VaR threshold) */
  value: z.number(),
  /** Confidence level used */
  confidenceLevel: z.number(),
  /** Method used for calculation */
  method: z.enum(['historical', 'parametric', 'monteCarlo']),
  /** Number of data points used */
  dataPoints: z.number().int(),
  /** Timestamp of calculation */
  timestamp: z.date(),
});

export type ExpectedShortfallResult = z.infer<typeof ExpectedShortfallResultSchema>;