import { z } from 'zod';

export const CalmarRatioOptionsSchema = z.object({
  prices: z.array(z.number()).min(2, 'Need at least 2 prices'),
  returns: z.array(z.number()).min(2, 'Need at least 2 returns'),
  annualizationFactor: z.number().default(252), // Trading days per year
  lookbackPeriod: z.number().default(36).optional(), // Months (standard: 36)
});

export type CalmarRatioOptions = z.infer<typeof CalmarRatioOptionsSchema>;
