import { VaRResult } from '../schemas/VaRResultSchema';

/**
 * Historical VaR - Uses empirical distribution of returns
 */
export function calculateHistoricalVaR(returns: number[], confidenceLevel: number): VaRResult {
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel) * sorted.length);
  const varValue = Math.abs(sorted[index]);

  // Calculate CVaR (average of losses beyond VaR)
  const tailLosses = sorted.slice(0, index + 1);
  const cvar = Math.abs(tailLosses.reduce((sum, val) => sum + val, 0) / tailLosses.length);

  return {
    value: varValue,
    confidenceLevel,
    method: 'historical',
    cvar,
  };
}