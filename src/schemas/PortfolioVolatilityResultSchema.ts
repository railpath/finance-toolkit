import { z } from 'zod';

export const PortfolioVolatilityResultSchema = z.object({
  volatility: z.number(),
  annualizedVolatility: z.number(),
  variance: z.number(),
  covarianceMatrix: z.array(z.array(z.number())),
});

export type PortfolioVolatilityResult = z.infer<
  typeof PortfolioVolatilityResultSchema
>;