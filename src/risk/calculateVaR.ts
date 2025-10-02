import { VaROptions, VaROptionsSchema, VaROptionsValidated } from '../schemas/VaROptionsSchema';

import { VaRResult } from '../schemas/VaRResultSchema';
import { calculateHistoricalVaR } from './calculateHistoricalVaR';
import { calculateMonteCarloVaR } from './calculateMonteCarloVaR';
import { calculateParametricVaR } from './calculateParametricVaR';

/**
 * Calculate Value at Risk using historical method
 *
 * @param returns - Array of historical returns (e.g., daily returns)
 * @param options - VaR calculation options
 * @returns VaR result with value and metadata
 *
 * @example
 * ```typescript
 * const returns = [-0.02, 0.01, -0.015, 0.03, -0.01];
 * const var95 = calculateVaR(returns, { confidenceLevel: 0.95 });
 * console.log(`95% VaR: ${var95.value}`);
 * ```
 */
export function calculateVaR(returns: number[], options: VaROptions): VaRResult {
  // Parse und validiere mit Zod (füllt Defaults!)
  const validated: VaROptionsValidated = VaROptionsSchema.parse(options);
  const { confidenceLevel, method, simulations } = validated;

  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }

  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('Confidence level must be between 0 and 1');
  }

  switch (method) {
    case 'historical':
      return calculateHistoricalVaR(returns, confidenceLevel);
    case 'parametric':
      return calculateParametricVaR(returns, confidenceLevel);
    case 'monteCarlo':
      return calculateMonteCarloVaR(returns, confidenceLevel, simulations);
    default:
      throw new Error(`Unknown VaR method: ${method}`);
  }
}
