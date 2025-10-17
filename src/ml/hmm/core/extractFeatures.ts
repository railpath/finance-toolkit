/**
 * Feature Extraction for Regime Detection
 * 
 * Extracts features from price data for HMM training
 */

import { validateFeatureMatrix, validatePriceArray } from '../../utils/validationUtils';

import { calculateEMA } from '../../../indicators/trend/calculateEMA';
import { calculateMACD } from '../../../indicators/trend/calculateMACD';
import { calculateRSI } from '../../../indicators/momentum/calculateRSI';
import { calculateVolatility } from '../../../risk/calculateVolatility';
import { standardize } from '../../utils/statisticsUtils';

export type FeatureConfig = 'default' | string[] | number[][];

export interface FeatureExtractionOptions {
  features: FeatureConfig;
  window: number;
}

/**
 * Extract features from price data
 * 
 * @param prices - Array of prices
 * @param options - Feature extraction options
 * @returns T x D matrix of standardized features
 * 
 * @example
 * ```typescript
 * // Default: returns + volatility
 * const features = extractFeatures(prices, { features: 'default', window: 20 });
 * 
 * // Advanced: custom feature set
 * const features = extractFeatures(prices, { 
 *   features: ['returns', 'volatility', 'rsi'], 
 *   window: 20 
 * });
 * 
 * // Custom: provide your own features
 * const features = extractFeatures(prices, { 
 *   features: myCustomFeatureMatrix, 
 *   window: 20 
 * });
 * ```
 */
export function extractFeatures(
  prices: number[],
  options: FeatureExtractionOptions
): number[][] {
  validatePriceArray(prices);
  
  const { features, window } = options;
  
  // If features is a matrix, validate and return standardized
  if (Array.isArray(features) && Array.isArray(features[0]) && typeof features[0][0] === 'number') {
    const customFeatures = features as number[][];
    validateFeatureMatrix(customFeatures);
    
    // Standardize each feature column
    return standardizeFeatureMatrix(customFeatures);
  }
  
  // Determine which features to extract
  let featureList: string[];
  if (features === 'default') {
    featureList = ['returns', 'volatility'];
  } else {
    featureList = features as string[];
  }
  
  // Extract features
  const featureArrays: { [key: string]: number[] } = {};
  
  // Returns
  if (featureList.includes('returns')) {
    featureArrays.returns = calculateReturns(prices);
  }
  
  // Volatility (rolling)
  if (featureList.includes('volatility')) {
    featureArrays.volatility = calculateRollingVolatility(prices, window);
  }
  
  // RSI
  if (featureList.includes('rsi')) {
    const rsiResult = calculateRSI({
      prices,
      period: Math.min(14, window),
    });
    featureArrays.rsi = rsiResult.rsi;
  }
  
  // MACD
  if (featureList.includes('macd')) {
    const macdResult = calculateMACD({
      prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    });
    // Use MACD line as feature
    featureArrays.macd = macdResult.macdLine;
  }
  
  // EMA
  if (featureList.includes('ema')) {
    const emaResult = calculateEMA({
      prices,
      period: window,
    });
    featureArrays.ema = emaResult.ema;
  }
  
  // Find minimum length (some indicators have warmup period)
  const lengths = Object.values(featureArrays).map(arr => arr.length);
  const minLength = Math.min(...lengths);
  
  if (minLength === 0) {
    throw new Error('Not enough data to extract features');
  }
  
  // Align all features to same length (trim from start)
  const alignedFeatures: { [key: string]: number[] } = {};
  for (const [name, values] of Object.entries(featureArrays)) {
    const trimStart = values.length - minLength;
    alignedFeatures[name] = values.slice(trimStart);
  }
  
  // Convert to matrix format (T x D)
  const featureNames = featureList.filter(name => alignedFeatures[name]);
  const featureMatrix: number[][] = [];
  
  for (let t = 0; t < minLength; t++) {
    const observation: number[] = [];
    for (const name of featureNames) {
      observation.push(alignedFeatures[name][t]);
    }
    featureMatrix.push(observation);
  }
  
  // Standardize features
  return standardizeFeatureMatrix(featureMatrix);
}

/**
 * Calculate simple returns
 */
function calculateReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

/**
 * Calculate rolling volatility
 */
function calculateRollingVolatility(prices: number[], window: number): number[] {
  const returns = calculateReturns(prices);
  const volatilities: number[] = [];
  
  for (let i = window - 1; i < returns.length; i++) {
    const windowReturns = returns.slice(i - window + 1, i + 1);
    const volatility = calculateVolatility(windowReturns, { method: 'standard' });
    volatilities.push(volatility.value);
  }
  
  return volatilities;
}

/**
 * Standardize feature matrix (each column has mean=0, std=1)
 */
function standardizeFeatureMatrix(features: number[][]): number[][] {
  if (features.length === 0 || features[0].length === 0) {
    return features;
  }
  
  const T = features.length;
  const D = features[0].length;
  
  // Transpose to get features as columns
  const columns: number[][] = [];
  for (let d = 0; d < D; d++) {
    const column: number[] = [];
    for (let t = 0; t < T; t++) {
      column.push(features[t][d]);
    }
    columns.push(column);
  }
  
  // Standardize each column
  const standardizedColumns = columns.map(col => standardize(col));
  
  // Transpose back
  const standardizedFeatures: number[][] = [];
  for (let t = 0; t < T; t++) {
    const observation: number[] = [];
    for (let d = 0; d < D; d++) {
      observation.push(standardizedColumns[d][t]);
    }
    standardizedFeatures.push(observation);
  }
  
  return standardizedFeatures;
}

