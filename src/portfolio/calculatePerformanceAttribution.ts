import { PerformanceAttributionOptions, PerformanceAttributionOptionsSchema } from '../schemas/PerformanceAttributionOptionsSchema';
import { PerformanceAttributionResult, PerformanceAttributionResultSchema } from '../schemas/PerformanceAttributionResultSchema';

/**
 * Calculate Performance Attribution
 * 
 * Performance attribution decomposes excess returns into three components:
 * 1. Asset Allocation Effect: Returns from overweighting/underweighting sectors/assets
 * 2. Security Selection Effect: Returns from picking better/worse securities within sectors
 * 3. Interaction Effect: Returns from the combination of allocation and selection
 * 
 * Brinson Model Formula:
 * - Allocation Effect = Σ(w_p - w_b) × r_b
 * - Selection Effect = Σ(w_b × (r_p - r_b))
 * - Interaction Effect = Σ(w_p - w_b) × (r_p - r_b)
 * 
 * Where:
 * - w_p = portfolio weights, w_b = benchmark weights
 * - r_p = portfolio returns, r_b = benchmark returns
 * 
 * @param options - Portfolio returns, benchmark returns, asset returns, and weights
 * @returns Performance attribution breakdown
 * 
 * @example
 * ```typescript
 * const attribution = calculatePerformanceAttribution({
 *   portfolioReturns: [0.05, 0.03, 0.07],
 *   benchmarkReturns: [0.04, 0.03, 0.06],
 *   assetReturns: [
 *     [0.06, 0.04, 0.08], // Asset 1 returns
 *     [0.04, 0.02, 0.06]  // Asset 2 returns
 *   ],
 *   portfolioWeights: [
 *     [0.6, 0.5, 0.7], // Portfolio weights over time
 *     [0.4, 0.5, 0.3]
 *   ],
 *   benchmarkWeights: [
 *     [0.5, 0.5, 0.5], // Benchmark weights over time
 *     [0.5, 0.5, 0.5]
 *   ],
 *   method: 'brinson'
 * });
 * ```
 */
export function calculatePerformanceAttribution(
  options: PerformanceAttributionOptions
): PerformanceAttributionResult {
  const {
    portfolioReturns,
    benchmarkReturns,
    assetReturns,
    portfolioWeights,
    benchmarkWeights,
    method,
    annualizationFactor
  } = PerformanceAttributionOptionsSchema.parse(options);

  // Validate input dimensions
  const periods = portfolioReturns.length;
  const assets = assetReturns.length;

  if (benchmarkReturns.length !== periods) {
    throw new Error('Benchmark returns length must match portfolio returns length');
  }

  if (portfolioWeights.length !== assets || benchmarkWeights.length !== assets) {
    throw new Error('Weight matrices must have same number of assets as asset returns');
  }

  // Validate weight matrices dimensions
  for (let i = 0; i < assets; i++) {
    if (portfolioWeights[i].length !== periods || benchmarkWeights[i].length !== periods) {
      throw new Error('Weight matrices must have same number of periods as returns');
    }
  }

  // Calculate total returns
  const portfolioReturn = portfolioReturns.reduce((sum, return_) => sum + return_, 0) / periods;
  const benchmarkReturn = benchmarkReturns.reduce((sum, return_) => sum + return_, 0) / periods;
  const excessReturn = portfolioReturn - benchmarkReturn;

  // Calculate attribution components
  let allocationEffect = 0;
  let selectionEffect = 0;
  let interactionEffect = 0;

  const assetAttribution = [];

  for (let assetIndex = 0; assetIndex < assets; assetIndex++) {
    let assetAllocationEffect = 0;
    let assetSelectionEffect = 0;
    let assetInteractionEffect = 0;

    for (let periodIndex = 0; periodIndex < periods; periodIndex++) {
      const portfolioWeight = portfolioWeights[assetIndex][periodIndex];
      const benchmarkWeight = benchmarkWeights[assetIndex][periodIndex];
      const assetReturn = assetReturns[assetIndex][periodIndex];
      const benchmarkReturnPeriod = benchmarkReturns[periodIndex];

      if (method === 'brinson') {
        // Brinson attribution model
        const allocation = (portfolioWeight - benchmarkWeight) * benchmarkReturnPeriod;
        const selection = benchmarkWeight * (assetReturn - benchmarkReturnPeriod);
        const interaction = (portfolioWeight - benchmarkWeight) * (assetReturn - benchmarkReturnPeriod);

        assetAllocationEffect += allocation;
        assetSelectionEffect += selection;
        assetInteractionEffect += interaction;
      } else {
        // Arithmetic attribution (simplified)
        const allocation = (portfolioWeight - benchmarkWeight) * assetReturn;
        const selection = benchmarkWeight * (assetReturn - benchmarkReturnPeriod);
        const interaction = 0; // No interaction in arithmetic method

        assetAllocationEffect += allocation;
        assetSelectionEffect += selection;
        assetInteractionEffect += interaction;
      }
    }

    // Average over periods
    assetAllocationEffect /= periods;
    assetSelectionEffect /= periods;
    assetInteractionEffect /= periods;

    const totalEffect = assetAllocationEffect + assetSelectionEffect + assetInteractionEffect;

    assetAttribution.push({
      assetIndex,
      allocationEffect: assetAllocationEffect,
      selectionEffect: assetSelectionEffect,
      interactionEffect: assetInteractionEffect,
      totalEffect
    });

    allocationEffect += assetAllocationEffect;
    selectionEffect += assetSelectionEffect;
    interactionEffect += assetInteractionEffect;
  }

  return PerformanceAttributionResultSchema.parse({
    portfolioReturn,
    benchmarkReturn,
    excessReturn,
    allocationEffect,
    selectionEffect,
    interactionEffect,
    assetAttribution,
    periods,
    assets,
    annualizationFactor,
    method
  });
}
