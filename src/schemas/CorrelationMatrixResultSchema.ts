import { z } from 'zod';

export const CorrelationMatrixResultSchema = z.object({
  matrix: z.array(z.array(z.number())),
  labels: z.array(z.string()),
  averageCorrelation: z.number(),
  maxCorrelation: z.number(),
  minCorrelation: z.number(),
});

export type CorrelationMatrixResult = z.infer<
  typeof CorrelationMatrixResultSchema
>;