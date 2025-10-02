import { VolatilityOptions } from '../schemas/VolatilityOptionsSchema';
import { VolatilityResult } from '../schemas/VolatilityResultSchema';
import { calculateEWMAVolatility } from './calculateEWMAVolatility';
import { calculateGarmanKlassVolatility } from './calculateGarmanKlassVolatility';
import { calculateParkinsonVolatility } from './calculateParkinsonVolatility';
import { calculateStandardDeviation } from './calculateStandardDeviation';

/**
 * Calculate volatility using various methods
 * 
 * @param returns Array of log returns
 * @param options Volatility calculation options
 * @returns Volatility result with value and metadata
 */
export function calculateVolatility(
  returns: number[],
  options: VolatilityOptions
): VolatilityResult {
  if (returns.length < 2) {
    throw new Error('At least 2 returns required for volatility calculation');
  }

  let value: number;

  switch (options.method) {
    case 'standard':
      value = calculateStandardDeviation(returns);
      break;

    case 'exponential':
      value = calculateEWMAVolatility(returns, options.lambda ?? 0.94);
      break;

    case 'parkinson':
      if (!options.highPrices || !options.lowPrices) {
        throw new Error('High and low prices required for Parkinson method');
      }
      value = calculateParkinsonVolatility(options.highPrices, options.lowPrices);
      break;

    case 'garman-klass':
      if (!options.highPrices || !options.lowPrices || !options.openPrices || !options.closePrices) {
        throw new Error('OHLC prices required for Garman-Klass method');
      }
      value = calculateGarmanKlassVolatility(
        options.openPrices,
        options.highPrices,
        options.lowPrices,
        options.closePrices
      );
      break;

    default:
      throw new Error(`Unknown volatility method: ${options.method}`);
  }

  const result: VolatilityResult = {
    value,
    method: options.method,
  };

  if (options.annualizationFactor) {
    result.annualized = value * Math.sqrt(options.annualizationFactor);
  }

  return result;
}