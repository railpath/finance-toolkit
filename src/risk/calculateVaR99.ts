import { calculateVaR } from './calculateVaR';

/**
 * Convenience function for 99% VaR
 */
export function calculateVaR99(returns: number[]): number {
  return calculateVaR(returns, { confidenceLevel: 0.99 }).value;
}