import { z } from 'zod';

export const BetaOptionsSchema = z.object({
  assetReturns: z.array(z.number()).min(2, 'Need at least 2 asset returns'),
  benchmarkReturns: z
    .array(z.number())
    .min(2, 'Need at least 2 benchmark returns'),
});

export type BetaOptions = z.infer<typeof BetaOptionsSchema>;
