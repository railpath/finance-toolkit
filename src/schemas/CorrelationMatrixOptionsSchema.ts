import { z } from 'zod';

export const CorrelationMatrixOptionsSchema = z.object({
  returns: z
    .array(z.array(z.number()))
    .min(2, 'Need at least 2 return series'),
  labels: z.array(z.string()).optional(),
});

export type CorrelationMatrixOptions = z.infer<
  typeof CorrelationMatrixOptionsSchema
>;
