import { BetaOptions, BetaOptionsSchema } from '../schemas/BetaOptionsSchema';
import { BetaResult, BetaResultSchema } from '../schemas/BetaResultSchema';

/**
 * Calculate Beta (β)
 * 
 * β = Cov(asset, benchmark) / Var(benchmark)
 * 
 * Measures systematic risk relative to market/benchmark.
 * β = 1: moves with market
 * β > 1: more volatile than market
 * β < 1: less volatile than market
 * 
 * @param options - Asset returns and benchmark returns
 * @returns Beta, covariance, variance, correlation
 */
export function calculateBeta(options: BetaOptions): BetaResult {
  const { assetReturns, benchmarkReturns } = BetaOptionsSchema.parse(options);

  if (assetReturns.length !== benchmarkReturns.length) {
    throw new Error('Asset and benchmark returns must have same length');
  }

  const n = assetReturns.length;

  // Mean returns
  const assetMean =
    assetReturns.reduce((sum, r) => sum + r, 0) / n;
  const benchmarkMean =
    benchmarkReturns.reduce((sum, r) => sum + r, 0) / n;

  // Covariance
  let covariance = 0;
  for (let i = 0; i < n; i++) {
    covariance +=
      (assetReturns[i] - assetMean) * (benchmarkReturns[i] - benchmarkMean);
  }
  covariance /= n - 1; // Sample covariance

  // Benchmark variance
  let benchmarkVariance = 0;
  for (let i = 0; i < n; i++) {
    benchmarkVariance += Math.pow(benchmarkReturns[i] - benchmarkMean, 2);
  }
  benchmarkVariance /= n - 1; // Sample variance

  // Beta
  const beta = benchmarkVariance !== 0 ? covariance / benchmarkVariance : 0;

  // Asset standard deviation (for correlation)
  let assetVariance = 0;
  for (let i = 0; i < n; i++) {
    assetVariance += Math.pow(assetReturns[i] - assetMean, 2);
  }
  assetVariance /= n - 1;
  const assetStdDev = Math.sqrt(assetVariance);
  const benchmarkStdDev = Math.sqrt(benchmarkVariance);

  // Correlation
  const correlation =
    assetStdDev !== 0 && benchmarkStdDev !== 0
      ? covariance / (assetStdDev * benchmarkStdDev)
      : 0;

  return BetaResultSchema.parse({
    beta,
    covariance,
    benchmarkVariance,
    correlation,
  });
}
