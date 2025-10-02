import { z } from 'zod';

export const MoneyWeightedReturnResultSchema = z.object({
  /**
   * Money-weighted return (period)
   */
  mwr: z.number(),
  
  /**
   * Annualized money-weighted return
   */
  annualizedMWR: z.number(),
  
  /**
   * Number of cash flows
   */
  cashFlowCount: z.number(),
  
  /**
   * Total time period in years
   */
  timePeriodYears: z.number(),
  
  /**
   * Net present value at calculated rate
   */
  npv: z.number(),
  
  /**
   * Number of iterations used for convergence
   */
  iterations: z.number(),
});

export type MoneyWeightedReturnResult = z.infer<typeof MoneyWeightedReturnResultSchema>;

