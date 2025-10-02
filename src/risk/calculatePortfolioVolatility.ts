import { PortfolioVolatilityOptions, PortfolioVolatilityOptionsSchema } from '../schemas/PortfolioVolatilityOptionsSchema';
import { PortfolioVolatilityResult, PortfolioVolatilityResultSchema } from '../schemas/PortfolioVolatilityResultSchema';

import { calculateCovarianceMatrix } from './calculateCovarianceMatrix';

/**
 * Calculate Portfolio Volatility
 * 
 * σ_p = √(w^T × Σ × w)
 * where:
 * w = weight vector
 * Σ = covariance matrix
 * 
 * Accounts for correlations between assets.
 * 
 * @param options - Weights, return series, annualization factor
 * @returns Portfolio volatility (period and annualized)
 */
export function calculatePortfolioVolatility(
  options: PortfolioVolatilityOptions
): PortfolioVolatilityResult {
  const { weights, returns, annualizationFactor } =
    PortfolioVolatilityOptionsSchema.parse(options);

  if (weights.length !== returns.length) {
    throw new Error('Weights and returns arrays must have same length');
  }

  // Calculate covariance matrix
  const { matrix: covarianceMatrix } = calculateCovarianceMatrix({ returns });

  // Portfolio variance: w^T × Σ × w
  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * covarianceMatrix[i][j];
    }
  }

  // Portfolio volatility
  const volatility = Math.sqrt(variance);

  // Annualized volatility
  const annualizedVolatility = volatility * Math.sqrt(annualizationFactor);

  return PortfolioVolatilityResultSchema.parse({
    volatility,
    annualizedVolatility,
    variance,
    covarianceMatrix,
  });
}
