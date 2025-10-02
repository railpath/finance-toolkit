import { calculateVaR } from './calculateVaR';

/**
 * Convenience function for 95% VaR
 */
export function calculateVaR95(returns: number[]): number {
  return calculateVaR(returns, { confidenceLevel: 0.95 }).value;
}