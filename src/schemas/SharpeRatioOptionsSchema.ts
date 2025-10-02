import { z } from 'zod';

export const SharpeRatioOptionsSchema = z.object({
  returns: z.array(z.number()).min(2, 'Need at least 2 returns'),
  riskFreeRate: z.number().default(0), // Annualized risk-free rate
  annualizationFactor: z.number().default(252), // Trading days per year
});

export type SharpeRatioOptions = z.infer<typeof SharpeRatioOptionsSchema>;
