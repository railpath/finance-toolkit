import { z } from 'zod';

/**
 * Zod schema for Gaussian emission parameters
 */
export const EmissionParamsSchema = z.object({
  means: z.array(z.number()).min(1),
  variances: z.array(z.number().positive()).min(1),
}).refine((data) => data.means.length === data.variances.length, {
  message: 'Means and variances arrays must have the same length',
});

/**
 * TypeScript types derived from Zod schemas
 */
export type EmissionParams = z.infer<typeof EmissionParamsSchema>;

/**
 * Validated type after parsing
 */
export type EmissionParamsValidated = z.output<typeof EmissionParamsSchema>;

