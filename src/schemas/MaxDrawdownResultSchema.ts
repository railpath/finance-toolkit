import { z } from 'zod';

export const MaxDrawdownResultSchema = z.object({
  maxDrawdown: z.number(),
  maxDrawdownPercent: z.number(),
  peakIndex: z.number(),
  troughIndex: z.number(),
  peakValue: z.number(),
  troughValue: z.number(),
  recoveryIndex: z.number().nullable(),
  drawdownDuration: z.number(),
  recoveryDuration: z.number().nullable(),
});

export type MaxDrawdownResult = z.infer<typeof MaxDrawdownResultSchema>;
