import { z } from 'zod';

export const AlphaOptionsSchema = z.object({
  assetReturns: z.array(z.number()).min(2, 'Need at least 2 asset returns'),
  benchmarkReturns: z
    .array(z.number())
    .min(2, 'Need at least 2 benchmark returns'),
  riskFreeRate: z.number().default(0), // Annualized risk-free rate
  annualizationFactor: z.number().default(252), // Trading days per year
});

export type AlphaOptions = z.infer<typeof AlphaOptionsSchema>;
