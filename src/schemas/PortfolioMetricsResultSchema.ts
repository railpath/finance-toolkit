import { z } from 'zod';

export const PortfolioMetricsResultSchema = z.object({
  /**
   * Total return over the entire period
   */
  totalReturn: z.number(),
  
  /**
   * Compound Annual Growth Rate (CAGR)
   */
  cagr: z.number(),
  
  /**
   * Maximum drawdown (largest peak-to-trough decline)
   */
  maxDrawdown: z.number(),
  
  /**
   * Maximum drawdown as a percentage
   */
  maxDrawdownPercent: z.number(),
  
  /**
   * Current drawdown (current decline from peak)
   */
  currentDrawdown: z.number(),
  
  /**
   * Current drawdown as a percentage
   */
  currentDrawdownPercent: z.number(),
  
  /**
   * Sharpe ratio (risk-adjusted return)
   */
  sharpeRatio: z.number(),
  
  /**
   * Sortino ratio (downside risk-adjusted return)
   */
  sortinoRatio: z.number(),
  
  /**
   * Value at Risk (VaR) at specified confidence level
   */
  valueAtRisk: z.number(),
  
  /**
   * Expected Shortfall (Conditional VaR) at specified confidence level
   */
  expectedShortfall: z.number(),
  
  /**
   * Volatility (annualized standard deviation of returns)
   */
  volatility: z.number(),
  
  /**
   * Mean return (annualized)
   */
  meanReturn: z.number(),
  
  /**
   * Number of periods
   */
  periods: z.number().int().positive(),
  
  /**
   * Number of years (calculated from periods and annualization factor)
   */
  years: z.number(),
  
  /**
   * Annualization factor used
   */
  annualizationFactor: z.number(),
  
  /**
   * Risk-free rate used
   */
  riskFreeRate: z.number(),
  
  /**
   * Confidence level used for VaR/ES calculations
   */
  confidenceLevel: z.number(),
});

export type PortfolioMetricsResult = z.infer<typeof PortfolioMetricsResultSchema>;
