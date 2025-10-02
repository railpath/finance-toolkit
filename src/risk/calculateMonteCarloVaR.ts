import { VaRResult } from '../schemas/VaRResultSchema';
import { calculateHistoricalVaR } from './calculateHistoricalVaR';

/**
 * Monte Carlo VaR - Simulates future returns
 */
export function calculateMonteCarloVaR(
  returns: number[],
  confidenceLevel: number,
  simulations: number
): VaRResult {
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance =
    returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);

  // Generate simulated returns using Box-Muller transform
  const simulatedReturns: number[] = [];
  for (let i = 0; i < simulations; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    simulatedReturns.push(mean + z * stdDev);
  }

  return calculateHistoricalVaR(simulatedReturns, confidenceLevel);
}