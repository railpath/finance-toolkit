import { z } from 'zod';

export const CalmarRatioResultSchema = z.object({
  calmarRatio: z.number(),
  annualizedReturn: z.number(),
  maxDrawdownPercent: z.number(),
});

export type CalmarRatioResult = z.infer<typeof CalmarRatioResultSchema>;
