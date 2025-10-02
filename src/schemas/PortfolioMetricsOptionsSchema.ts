import { z } from 'zod';

export const PortfolioMetricsOptionsSchema = z.object({
  /**
   * Portfolio values over time (e.g., [100000, 105000, 108000, 102000])
   */
  portfolioValues: z.array(z.number().positive()).min(2),
  
  /**
   * Optional: Dates corresponding to each portfolio value
   */
  dates: z.array(z.date()).optional(),
  
  /**
   * Optional: Cash flows (contributions/withdrawals) at each period
   * Positive for contributions, negative for withdrawals
   */
  cashFlows: z.array(z.number()).optional(),
  
  /**
   * Risk-free rate for risk-adjusted metrics
   */
  riskFreeRate: z.number().default(0.02),
  
  /**
   * Annualization factor (e.g., 252 for daily, 12 for monthly, 1 for annual)
   */
  annualizationFactor: z.number().positive().default(252),
  
  /**
   * Confidence level for Value at Risk calculations (e.g., 0.05 for 5%)
   */
  confidenceLevel: z.number().min(0).max(1).default(0.05),
});

export type PortfolioMetricsOptions = z.infer<typeof PortfolioMetricsOptionsSchema>;
