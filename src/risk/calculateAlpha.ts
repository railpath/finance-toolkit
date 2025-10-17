import { AlphaOptions, AlphaOptionsSchema } from '../schemas/AlphaOptionsSchema';
import { AlphaResult, AlphaResultSchema } from '../schemas/AlphaResultSchema';

import { calculateBeta } from './calculateBeta';

/**
 * Calculate Alpha (α) using CAPM
 * 
 * α = Actual Return - Expected Return
 * Expected Return = Rf + β × (Rm - Rf)
 * 
 * Positive α: outperformance vs. market-adjusted expectations
 * Negative α: underperformance
 * 
 * @param options - Asset returns, benchmark returns, risk-free rate
 * @returns Alpha, beta, returns, expected return
 */
export function calculateAlpha(options: AlphaOptions): AlphaResult {
  const { assetReturns, benchmarkReturns, riskFreeRate, annualizationFactor } =
    AlphaOptionsSchema.parse(options);

  if (assetReturns.length !== benchmarkReturns.length) {
    throw new Error('Asset and benchmark returns must have same length');
  }

  if (annualizationFactor <= 0) {
    throw new Error('Annualization factor must be positive');
  }

  // Calculate beta
  const { beta } = calculateBeta({ assetReturns, benchmarkReturns });

  // Mean returns (period)
  const assetMeanReturn =
    assetReturns.reduce((sum, r) => sum + r, 0) / assetReturns.length;
  const benchmarkMeanReturn =
    benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length;

  // Annualized returns
  const assetReturn = assetMeanReturn * annualizationFactor;
  const benchmarkReturn = benchmarkMeanReturn * annualizationFactor;

  // CAPM expected return (annualized)
  const expectedReturn = riskFreeRate + beta * (benchmarkReturn - riskFreeRate);

  // Alpha
  const annualizedAlpha = assetReturn - expectedReturn;
  const alpha = annualizedAlpha / annualizationFactor;

  return AlphaResultSchema.parse({
    alpha,
    annualizedAlpha,
    beta,
    assetReturn,
    benchmarkReturn,
    expectedReturn,
  });
}
