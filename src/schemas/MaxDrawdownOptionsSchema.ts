import { z } from 'zod';

export const MaxDrawdownOptionsSchema = z.object({
  prices: z.array(z.number()).min(2, 'Need at least 2 prices'),
});

export type MaxDrawdownOptions = z.infer<typeof MaxDrawdownOptionsSchema>;