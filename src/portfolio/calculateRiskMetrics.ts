import { RiskMetricsOptions, RiskMetricsOptionsSchema } from '../schemas/RiskMetricsOptionsSchema';
import { RiskMetricsResult, RiskMetricsResultSchema } from '../schemas/RiskMetricsResultSchema';

/**
 * Calculate Risk Metrics (Beta, Correlation, Downside Deviation)
 * 
 * Calculates comprehensive risk metrics for portfolio analysis:
 * 
 * 1. Beta: Measures systematic risk relative to benchmark
 *    Formula: β = Cov(Asset, Benchmark) / Var(Benchmark)
 * 
 * 2. Correlation Matrix: Measures relationships between assets
 *    Formula: ρ = Cov(Asset1, Asset2) / (σ1 × σ2)
 * 
 * 3. Downside Deviation: Measures volatility of negative returns
 *    Formula: DD = √(Σ(min(r_i, 0))² / n) × √(annualization_factor)
 * 
 * @param options - Asset returns, benchmark returns, and calculation parameters
 * @returns Risk metrics including beta, correlation, and downside deviation
 * 
 * @example
 * ```typescript
 * const riskMetrics = calculateRiskMetrics({
 *   assetReturns: [
 *     [0.05, 0.03, 0.07, 0.02], // Asset 1 returns
 *     [0.04, 0.02, 0.06, 0.01], // Asset 2 returns
 *     [0.06, 0.04, 0.08, 0.03]  // Asset 3 returns
 *   ],
 *   benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
 *   riskFreeRate: 0.02,
 *   annualizationFactor: 252
 * });
 * ```
 */
export function calculateRiskMetrics(
  options: RiskMetricsOptions
): RiskMetricsResult {
  const {
    assetReturns,
    benchmarkReturns,
    riskFreeRate,
    annualizationFactor,
    confidenceLevel
  } = RiskMetricsOptionsSchema.parse(options);

  const assets = assetReturns.length;
  const periods = assetReturns[0].length;

  // Validate input dimensions
  for (let i = 0; i < assets; i++) {
    if (assetReturns[i].length !== periods) {
      throw new Error(`Asset ${i} returns length must match other assets`);
    }
  }

  if (benchmarkReturns && benchmarkReturns.length !== periods) {
    throw new Error('Benchmark returns length must match asset returns length');
  }

  // Calculate betas (if benchmark provided)
  const betas: number[] = [];
  if (benchmarkReturns) {
    for (let i = 0; i < assets; i++) {
      const beta = calculateBeta(assetReturns[i], benchmarkReturns);
      betas.push(isNaN(beta) ? 0 : beta); // Replace NaN with 0
    }
  } else {
    // If no benchmark, betas are 0 (not applicable)
    betas.push(...new Array(assets).fill(0));
  }

  // Calculate correlation matrix
  const correlationMatrix: number[][] = [];
  for (let i = 0; i < assets; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < assets; j++) {
      if (i === j) {
        correlationMatrix[i][j] = 1.0; // Perfect correlation with itself
      } else {
        const correlation = calculateCorrelation(assetReturns[i], assetReturns[j]);
        correlationMatrix[i][j] = isNaN(correlation) ? 0 : correlation; // Replace NaN with 0
      }
    }
  }

  // Calculate downside deviations
  const downsideDeviations: number[] = [];
  const downsideDeviationsAnnualized: number[] = [];
  
  for (let i = 0; i < assets; i++) {
    const downsideDev = calculateDownsideDeviation(assetReturns[i], confidenceLevel);
    downsideDeviations.push(downsideDev);
    downsideDeviationsAnnualized.push(downsideDev * Math.sqrt(annualizationFactor));
  }

  return RiskMetricsResultSchema.parse({
    betas,
    correlationMatrix,
    downsideDeviations,
    downsideDeviationsAnnualized,
    assets,
    periods,
    annualizationFactor,
    confidenceLevel,
    riskFreeRate
  });
}

/**
 * Calculate Beta (systematic risk)
 */
function calculateBeta(assetReturns: number[], benchmarkReturns: number[]): number {
  const n = assetReturns.length;
  
  // Calculate means
  const assetMean = assetReturns.reduce((sum, r) => sum + r, 0) / n;
  const benchmarkMean = benchmarkReturns.reduce((sum, r) => sum + r, 0) / n;
  
  // Calculate covariance
  let covariance = 0;
  for (let i = 0; i < n; i++) {
    covariance += (assetReturns[i] - assetMean) * (benchmarkReturns[i] - benchmarkMean);
  }
  covariance /= (n - 1); // Sample covariance
  
  // Calculate benchmark variance
  let benchmarkVariance = 0;
  for (let i = 0; i < n; i++) {
    benchmarkVariance += Math.pow(benchmarkReturns[i] - benchmarkMean, 2);
  }
  benchmarkVariance /= (n - 1); // Sample variance
  
  if (benchmarkVariance === 0) {
    return 0; // Cannot calculate beta if benchmark has no variance
  }
  
  return covariance / benchmarkVariance;
}

/**
 * Calculate Correlation between two assets
 */
function calculateCorrelation(returns1: number[], returns2: number[]): number {
  const n = returns1.length;
  
  // Calculate means
  const mean1 = returns1.reduce((sum, r) => sum + r, 0) / n;
  const mean2 = returns2.reduce((sum, r) => sum + r, 0) / n;
  
  // Calculate covariance
  let covariance = 0;
  for (let i = 0; i < n; i++) {
    covariance += (returns1[i] - mean1) * (returns2[i] - mean2);
  }
  covariance /= (n - 1);
  
  // Calculate standard deviations
  let variance1 = 0;
  let variance2 = 0;
  for (let i = 0; i < n; i++) {
    variance1 += Math.pow(returns1[i] - mean1, 2);
    variance2 += Math.pow(returns2[i] - mean2, 2);
  }
  variance1 /= (n - 1);
  variance2 /= (n - 1);
  
  const stdDev1 = Math.sqrt(variance1);
  const stdDev2 = Math.sqrt(variance2);
  
  if (stdDev1 === 0 || stdDev2 === 0) {
    return 0; // Cannot calculate correlation if either asset has no variance
  }
  
  return covariance / (stdDev1 * stdDev2);
}

/**
 * Calculate Downside Deviation
 */
function calculateDownsideDeviation(returns: number[], confidenceLevel: number): number {
  
  // Calculate downside returns (returns below threshold)
  const threshold = confidenceLevel; // Simple threshold, could be mean or zero
  let downsideSum = 0;
  let downsideCount = 0;
  
  for (const return_ of returns) {
    if (return_ < threshold) {
      downsideSum += Math.pow(return_ - threshold, 2);
      downsideCount++;
    }
  }
  
  if (downsideCount === 0) {
    return 0; // No downside returns
  }
  
  const downsideVariance = downsideSum / downsideCount;
  return Math.sqrt(downsideVariance);
}
