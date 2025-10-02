import { VaRResult } from '../schemas/VaRResultSchema';
import { getZScore } from '../utils/getZScore';

/**
 * Parametric VaR - Assumes normal distribution
 */
export function calculateParametricVaR(returns: number[], confidenceLevel: number): VaRResult {
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance =
    returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);

  // Z-score for confidence level (using standard normal approximation)
  const zScore = getZScore(confidenceLevel);
  const varValue = Math.abs(mean - zScore * stdDev);

  // CVaR for normal distribution
  const cvar = Math.abs(
    mean - stdDev * (Math.exp(-Math.pow(zScore, 2) / 2) / (Math.sqrt(2 * Math.PI) * (1 - confidenceLevel)))
  );

  return {
    value: varValue,
    confidenceLevel,
    method: 'parametric',
    cvar,
  };
}