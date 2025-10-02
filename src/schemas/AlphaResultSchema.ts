import { z } from 'zod';

export const AlphaResultSchema = z.object({
  alpha: z.number(),
  annualizedAlpha: z.number(),
  beta: z.number(),
  assetReturn: z.number(),
  benchmarkReturn: z.number(),
  expectedReturn: z.number(), // CAPM expected return
});

export type AlphaResult = z.infer<typeof AlphaResultSchema>;
