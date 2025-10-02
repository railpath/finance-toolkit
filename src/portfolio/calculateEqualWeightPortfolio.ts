import { EqualWeightOptions, EqualWeightOptionsSchema } from '../schemas/EqualWeightOptionsSchema';
import { EqualWeightResult, EqualWeightResultSchema } from '../schemas/EqualWeightResultSchema';

/**
 * Calculate Equal Weight Portfolio (1/N Portfolio)
 * 
 * The equal weight portfolio assigns the same weight to each asset: w_i = 1/N
 * where N is the number of assets. This is one of the simplest portfolio construction
 * methods and serves as a common benchmark.
 * 
 * Properties:
 * - No optimization required
 * - No historical data needed
 * - Naturally diversified
 * - Easy to rebalance
 * 
 * @param options - Number of assets and optional constraints
 * @returns Equal weight portfolio result
 * 
 * @example
 * ```typescript
 * // Basic equal weight portfolio
 * const equalWeight = calculateEqualWeightPortfolio({
 *   numberOfAssets: 5
 * });
 * 
 * // Equal weight with constraints
 * const constrainedEqualWeight = calculateEqualWeightPortfolio({
 *   numberOfAssets: 10,
 *   minWeight: 0.05,  // 5% minimum
 *   maxWeight: 0.15   // 15% maximum
 * });
 * ```
 */
export function calculateEqualWeightPortfolio(
  options: EqualWeightOptions
): EqualWeightResult {
  const {
    numberOfAssets,
    minWeight,
    maxWeight,
    sumTo1
  } = EqualWeightOptionsSchema.parse(options);

  // Calculate base equal weight
  const baseWeight = 1 / numberOfAssets;
  
  // Initialize weights array
  const weights: number[] = new Array(numberOfAssets).fill(baseWeight);
  
  // Apply constraints if provided
  if (minWeight !== undefined || maxWeight !== undefined) {
    // First, apply constraints
    for (let i = 0; i < numberOfAssets; i++) {
      if (minWeight !== undefined && weights[i] < minWeight) {
        weights[i] = minWeight;
      }
      if (maxWeight !== undefined && weights[i] > maxWeight) {
        weights[i] = maxWeight;
      }
    }
    
    // Then rebalance to sum to 1 if requested
    if (sumTo1) {
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      if (Math.abs(totalWeight - 1) > 1e-10) {
        const scaleFactor = 1 / totalWeight;
        for (let i = 0; i < numberOfAssets; i++) {
          weights[i] *= scaleFactor;
        }
      }
    }
  }
  
  // Calculate total weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  return EqualWeightResultSchema.parse({
    equalWeight: baseWeight,
    weights,
    numberOfAssets,
    totalWeight,
    sumTo1: Math.abs(totalWeight - 1) < 1e-10
  });
}
