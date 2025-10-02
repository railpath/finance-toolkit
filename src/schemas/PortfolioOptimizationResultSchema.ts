import { z } from 'zod';

export const PortfolioOptimizationResultSchema = z.object({
  /**
   * Optimal weights for each asset
   */
  weights: z.array(z.number()),
  
  /**
   * Expected portfolio return
   */
  expectedReturn: z.number(),
  
  /**
   * Portfolio variance
   */
  variance: z.number(),
  
  /**
   * Portfolio volatility (standard deviation)
   */
  volatility: z.number(),
  
  /**
   * Sharpe ratio (if risk-free rate provided)
   */
  sharpeRatio: z.number().optional(),
  
  /**
   * Optimization method used
   */
  method: z.enum(['minimumVariance', 'maximumSharpe', 'targetReturn']),
  
  /**
   * Convergence information
   */
  converged: z.boolean(),
  iterations: z.number().optional(),
  
  /**
   * Lagrange multipliers for constraints
   */
  lagrangeMultipliers: z.array(z.number()).optional(),
});

export type PortfolioOptimizationResult = z.infer<typeof PortfolioOptimizationResultSchema>;
