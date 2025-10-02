import { z } from 'zod';

export const EqualWeightResultSchema = z.object({
  /**
   * Equal weight for each asset (1/N)
   */
  equalWeight: z.number(),
  
  /**
   * Array of portfolio weights
   */
  weights: z.array(z.number()),
  
  /**
   * Number of assets
   */
  numberOfAssets: z.number(),
  
  /**
   * Sum of all weights
   */
  totalWeight: z.number(),
  
  /**
   * Whether weights sum to exactly 1
   */
  sumTo1: z.boolean(),
});

export type EqualWeightResult = z.infer<typeof EqualWeightResultSchema>;
