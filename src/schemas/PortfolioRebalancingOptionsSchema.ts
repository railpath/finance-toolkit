import { z } from 'zod';

export const PortfolioRebalancingOptionsSchema = z.object({
  /**
   * Current portfolio weights
   */
  currentWeights: z.array(z.number()).min(2),
  
  /**
   * Target portfolio weights
   */
  targetWeights: z.array(z.number()).min(2),
  
  /**
   * Current portfolio value
   */
  portfolioValue: z.number().positive(),
  
  /**
   * Rebalancing method
   * - 'proportional': Scale all weights proportionally
   * - 'fixed': Rebalance to exact target weights
   */
  method: z.enum(['proportional', 'fixed']).default('fixed'),
  
  /**
   * Minimum trade size (as percentage of portfolio value)
   */
  minTradeSize: z.number().min(0).max(1).default(0.001), // 0.1% default
  
  /**
   * Transaction costs (as percentage of trade value)
   */
  transactionCosts: z.number().min(0).max(1).default(0), // 0% default
  
  /**
   * Whether to consider transaction costs in calculations
   */
  includeTransactionCosts: z.boolean().default(false),
});

export type PortfolioRebalancingOptions = z.infer<typeof PortfolioRebalancingOptionsSchema>;
