import { z } from 'zod';

export const PortfolioVolatilityOptionsSchema = z.object({
  weights: z
    .array(z.number())
    .refine((w) => Math.abs(w.reduce((sum, x) => sum + x, 0) - 1) < 0.0001, {
      message: 'Weights must sum to 1',
    }),
  returns: z.array(z.array(z.number())),
  annualizationFactor: z.number().default(252),
});

export type PortfolioVolatilityOptions = z.infer<
  typeof PortfolioVolatilityOptionsSchema
>;
