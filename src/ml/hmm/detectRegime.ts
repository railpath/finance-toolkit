/**
 * Regime Detection using Hidden Markov Models
 * 
 * High-Level API for detecting market regimes from price data
 */

import {
  RegimeDetectionOptions,
  RegimeDetectionOptionsSchema,
} from '../schemas/RegimeDetectionOptionsSchema';
import {
  RegimeDetectionResult,
  RegimeDetectionResultSchema,
} from '../schemas/RegimeDetectionResultSchema';

import { HMMModel } from '../schemas/HMMModelSchema';
import { extractFeatures } from './core/extractFeatures';
import { forward } from './algorithms/forward';
import { trainHMM } from './core/trainHMM';
import { validatePriceArray } from '../utils/validationUtils';
import { viterbi } from './algorithms/viterbi';

/**
 * Detect market regimes from price data
 * 
 * Uses Hidden Markov Models to identify different market regimes
 * (bullish, bearish, neutral by default)
 * 
 * @param prices - Array of prices
 * @param options - Regime detection options
 * @returns Regime detection result with labeled regimes and model
 * 
 * @example
 * ```typescript
 * // Simple usage with defaults (3 states: bearish, neutral, bullish)
 * const result = detectRegime(prices);
 * console.log(result.currentRegime); // 'bullish'
 * console.log(result.confidence); // 0.85
 * 
 * // Advanced usage with custom features
 * const result = detectRegime(prices, {
 *   numStates: 4,
 *   features: ['returns', 'volatility', 'rsi'],
 *   stateLabels: ['strong_bearish', 'weak_bearish', 'weak_bullish', 'strong_bullish']
 * });
 * 
 * // With custom feature matrix
 * const result = detectRegime(prices, {
 *   features: myCustomFeatures,
 *   numStates: 3
 * });
 * ```
 */
export function detectRegime(
  prices: number[],
  options?: Partial<RegimeDetectionOptions>
): RegimeDetectionResult {
  // Validate prices
  validatePriceArray(prices);
  
  // Parse and validate options with defaults
  const validatedOptions = RegimeDetectionOptionsSchema.parse(options || {});
  
  const {
    numStates,
    features,
    featureWindow,
    maxIterations,
    convergenceTolerance,
    stateLabels,
  } = validatedOptions;
  
  // Default state labels based on numStates
  const labels = stateLabels || getDefaultStateLabels(numStates);
  
  if (labels.length !== numStates) {
    throw new Error(`stateLabels length (${labels.length}) must match numStates (${numStates})`);
  }
  
  // Extract features
  const featureMatrix = extractFeatures(prices, {
    features,
    window: featureWindow,
  });
  
  if (featureMatrix.length < numStates * 2) {
    throw new Error(
      `Not enough observations (${featureMatrix.length}) for ${numStates} states. ` +
      `Need at least ${numStates * 2} observations.`
    );
  }
  
  // Train HMM
  const model = trainHMM(featureMatrix, {
    numStates,
    maxIterations,
    convergenceTolerance,
  });
  
  // Get most likely state sequence using Viterbi
  const viterbiResult = viterbi(
    featureMatrix,
    model.transitionMatrix,
    model.emissionParams,
    model.initialProbs
  );
  
  const stateSequence = viterbiResult.path;
  
  // Map state indices to labels
  // By default, sort states by mean return to assign labels
  const stateMeanReturns = sortStatesByMeanReturn(model);
  const stateToLabelMap = createStateLabelMapping(stateMeanReturns, labels);
  
  const regimes = stateSequence.map(state => stateToLabelMap[state]);
  const currentRegime = regimes[regimes.length - 1];
  
  // Calculate state probabilities using forward algorithm
  const forwardResult = forward(
    featureMatrix,
    model.transitionMatrix,
    model.emissionParams,
    model.initialProbs
  );
  
  // Normalize alpha to get probabilities
  const stateProbabilities = forwardResult.alpha.map(alphaRow => {
    const sum = alphaRow.reduce((acc, val) => acc + val, 0);
    return alphaRow.map(val => (sum > 0 ? val / sum : 1 / numStates));
  });
  
  // Calculate confidence as mean of max probabilities
  const confidence = calculateConfidence(stateProbabilities);
  
  // Prepare result
  const result: RegimeDetectionResult = {
    currentRegime,
    regimes,
    stateSequence,
    stateProbabilities,
    model,
    confidence,
  };
  
  // Validate and return
  return RegimeDetectionResultSchema.parse(result);
}

/**
 * Get default state labels based on number of states
 */
function getDefaultStateLabels(numStates: number): string[] {
  if (numStates === 2) {
    return ['bearish', 'bullish'];
  } else if (numStates === 3) {
    return ['bearish', 'neutral', 'bullish'];
  } else if (numStates === 4) {
    return ['strong_bearish', 'weak_bearish', 'weak_bullish', 'strong_bullish'];
  } else {
    // Generic labels for other numbers
    return Array.from({ length: numStates }, (_, i) => `state_${i}`);
  }
}

/**
 * Sort states by their mean return (first feature dimension)
 * 
 * Returns array of [stateIndex, meanReturn] sorted by meanReturn
 */
function sortStatesByMeanReturn(
  model: HMMModel,
): Array<[number, number]> {
  const numStates = model.numStates;
  const stateMeans: number[] = [];
  
  for (let i = 0; i < numStates; i++) {
    // Use first feature (returns) mean
    stateMeans.push(model.emissionParams[i].means[0]);
  }
  
  // Create [index, mean] pairs and sort by mean
  const indexedMeans: Array<[number, number]> = stateMeans.map((mean, idx) => [idx, mean]);
  indexedMeans.sort((a, b) => a[1] - b[1]);
  
  return indexedMeans;
}

/**
 * Create mapping from state index to label
 * 
 * States are mapped to labels based on their mean return:
 * - Lowest mean return → most bearish label
 * - Highest mean return → most bullish label
 */
function createStateLabelMapping(
  sortedStates: Array<[number, number]>,
  labels: string[]
): { [stateIndex: number]: string } {
  const mapping: { [stateIndex: number]: string } = {};
  
  for (let i = 0; i < sortedStates.length; i++) {
    const stateIndex = sortedStates[i][0];
    mapping[stateIndex] = labels[i];
  }
  
  return mapping;
}

/**
 * Calculate confidence as mean of maximum state probabilities
 */
function calculateConfidence(stateProbabilities: number[][]): number {
  if (stateProbabilities.length === 0) {
    return 0;
  }
  
  const maxProbs = stateProbabilities.map(probs => Math.max(...probs));
  const meanMaxProb = maxProbs.reduce((sum, p) => sum + p, 0) / maxProbs.length;
  
  return meanMaxProb;
}

