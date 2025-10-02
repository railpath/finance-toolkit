import { z } from 'zod';

export const EqualWeightOptionsSchema = z.object({
  /**
   * Number of assets in the portfolio
   */
  numberOfAssets: z.number().int().min(2),
  
  /**
   * Optional constraint: minimum weight per asset
   */
  minWeight: z.number().min(0).max(1).optional(),
  
  /**
   * Optional constraint: maximum weight per asset
   */
  maxWeight: z.number().min(0).max(1).optional(),
  
  /**
   * Whether weights should sum to exactly 1
   */
  sumTo1: z.boolean().default(true),
}).refine(
  (data) => {
    if (data.minWeight !== undefined && data.maxWeight !== undefined) {
      return data.minWeight <= data.maxWeight;
    }
    return true;
  },
  {
    message: "minWeight must be less than or equal to maxWeight",
    path: ["minWeight", "maxWeight"],
  }
);

export type EqualWeightOptions = z.infer<typeof EqualWeightOptionsSchema>;
