import { z } from 'zod';

export const CovarianceMatrixResultSchema = z.object({
  matrix: z.array(z.array(z.number())),
  labels: z.array(z.string()),
  variances: z.array(z.number()), // Diagonal elements
  averageCovariance: z.number(),
});

export type CovarianceMatrixResult = z.infer<
  typeof CovarianceMatrixResultSchema
>;