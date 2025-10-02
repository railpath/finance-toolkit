import { z } from 'zod';

export const PortfolioOptimizationOptionsSchema = z.object({
  /**
   * Array of expected returns for each asset
   */
  expectedReturns: z.array(z.number()).min(2),
  
  /**
   * Covariance matrix (n x n) for the assets
   */
  covarianceMatrix: z.array(z.array(z.number())).min(1),
  
  /**
   * Risk-free rate (optional, required for Sharpe ratio optimization)
   */
  riskFreeRate: z.number().optional(),
  
  /**
   * Target return (optional, required for target return optimization)
   */
  targetReturn: z.number().optional(),
  
  /**
   * Minimum weight per asset (optional, defaults to 0)
   */
  minWeight: z.number().min(0).default(0),
  
  /**
   * Maximum weight per asset (optional, defaults to 1)
   */
  maxWeight: z.number().max(1).default(1),
  
  /**
   * Whether weights should sum to 1 (portfolio constraint)
   */
  sumTo1: z.boolean().default(true),
});

export type PortfolioOptimizationOptions = z.infer<typeof PortfolioOptimizationOptionsSchema>;
