import { z } from 'zod';

export const SharpeRatioResultSchema = z.object({
  sharpeRatio: z.number(),
  annualizedReturn: z.number(),
  annualizedVolatility: z.number(),
  excessReturn: z.number(),
});

export type SharpeRatioResult = z.infer<typeof SharpeRatioResultSchema>;
