import { z } from 'zod';

export const PortfolioRebalancingResultSchema = z.object({
  /**
   * New portfolio weights after rebalancing
   */
  newWeights: z.array(z.number()),
  
  /**
   * Trade amounts for each asset (positive = buy, negative = sell)
   */
  tradeAmounts: z.array(z.number()),
  
  /**
   * Trade amounts as percentage of portfolio value
   */
  tradePercentages: z.array(z.number()),
  
  /**
   * Total absolute trade amount
   */
  totalTradeAmount: z.number(),
  
  /**
   * Total transaction costs
   */
  totalTransactionCosts: z.number(),
  
  /**
   * Portfolio value after transaction costs
   */
  portfolioValueAfterCosts: z.number(),
  
  /**
   * Number of assets that need rebalancing
   */
  assetsToRebalance: z.number(),
  
  /**
   * Rebalancing method used
   */
  method: z.enum(['proportional', 'fixed']),
  
  /**
   * Whether rebalancing was actually needed
   */
  rebalancingNeeded: z.boolean(),
  
  /**
   * Portfolio turnover (sum of absolute trades / 2)
   */
  turnover: z.number(),
});

export type PortfolioRebalancingResult = z.infer<typeof PortfolioRebalancingResultSchema>;
