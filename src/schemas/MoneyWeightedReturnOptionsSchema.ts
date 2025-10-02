import { z } from 'zod';

const MoneyWeightedReturnOptionsBaseSchema = z.object({
  /**
   * Array of cash flows (positive for inflows, negative for outflows)
   */
  cashFlows: z.array(z.number()).min(2),
  
  /**
   * Array of dates corresponding to each cash flow
   */
  dates: z.array(z.date()).min(2),
  
  /**
   * Final portfolio value
   */
  finalValue: z.number().positive(),
  
  /**
   * Initial portfolio value (optional, defaults to 0)
   */
  initialValue: z.number().nonnegative().default(0),
  
  /**
   * Maximum number of iterations for IRR calculation
   */
  maxIterations: z.number().positive().optional(),
  
  /**
   * Tolerance for IRR convergence
   */
  tolerance: z.number().positive().optional(),
});

export const MoneyWeightedReturnOptionsSchema = MoneyWeightedReturnOptionsBaseSchema.transform((data) => ({
  ...data,
  maxIterations: data.maxIterations ?? 100,
  tolerance: data.tolerance ?? 1e-6,
}));

export type MoneyWeightedReturnOptions = z.input<typeof MoneyWeightedReturnOptionsBaseSchema>;
