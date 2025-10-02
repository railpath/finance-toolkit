import { z } from 'zod';

export const SortinoRatioResultSchema = z.object({
  sortinoRatio: z.number(),
  annualizedReturn: z.number(),
  downsideDeviation: z.number(),
  annualizedDownsideDeviation: z.number(),
  excessReturn: z.number(),
});

export type SortinoRatioResult = z.infer<typeof SortinoRatioResultSchema>;
