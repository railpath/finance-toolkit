import { z } from 'zod';

export const BetaResultSchema = z.object({
  beta: z.number(),
  covariance: z.number(),
  benchmarkVariance: z.number(),
  correlation: z.number(),
});

export type BetaResult = z.infer<typeof BetaResultSchema>;
