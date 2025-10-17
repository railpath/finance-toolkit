/**
 * HMM Model Initialization
 * 
 * Initialize HMM parameters using K-means-like clustering
 */

import { addNoise, normalizeArray, normalizeRows } from '../../utils/matrixUtils';
import { calculateMean, calculateVariance } from '../../utils/statisticsUtils';
import { validateFeatureMatrix, validateNumStates } from '../../utils/validationUtils';

import { HMMModel } from '../../schemas/HMMModelSchema';

/**
 * Initialize HMM model using K-means-like clustering
 * 
 * @param observations - T x D matrix of observations
 * @param numStates - Number of hidden states
 * @returns Initialized HMM model
 * 
 * @example
 * ```typescript
 * const model = initializeHMM(features, 3);
 * ```
 */
export function initializeHMM(
  observations: number[][],
  numStates: number
): HMMModel {
  validateFeatureMatrix(observations);
  validateNumStates(numStates, observations);
  
  const T = observations.length;
  const N = numStates;
  const D = observations[0].length;
  
  // Simple K-means-like initialization
  // Divide observations into N roughly equal segments
  const segmentSize = Math.floor(T / N);
  const stateAssignments: number[] = [];
  
  for (let t = 0; t < T; t++) {
    const state = Math.min(Math.floor(t / segmentSize), N - 1);
    stateAssignments.push(state);
  }
  
  // Calculate emission parameters for each state
  const emissionParams = [];
  for (let i = 0; i < N; i++) {
    const stateObservations = observations.filter((_, t) => stateAssignments[t] === i);
    
    if (stateObservations.length === 0) {
      // Fallback: use random parameters
      emissionParams.push({
        means: Array(D).fill(0).map(() => (Math.random() - 0.5) * 0.1),
        variances: Array(D).fill(1),
      });
      continue;
    }
    
    const means: number[] = [];
    const variances: number[] = [];
    
    for (let d = 0; d < D; d++) {
      const featureValues = stateObservations.map(obs => obs[d]);
      means.push(calculateMean(featureValues));
      variances.push(Math.max(calculateVariance(featureValues), 1e-6)); // Prevent zero variance
    }
    
    emissionParams.push({ means, variances });
  }
  
  // Initialize transition matrix
  // Count transitions
  const transitionCounts: number[][] = Array(N).fill(0).map(() => Array(N).fill(1)); // Laplace smoothing
  
  for (let t = 0; t < T - 1; t++) {
    const currentState = stateAssignments[t];
    const nextState = stateAssignments[t + 1];
    transitionCounts[currentState][nextState]++;
  }
  
  // Normalize to get probabilities and add noise to break symmetry
  let transitionMatrix = normalizeRows(transitionCounts);
  transitionMatrix = addNoise(transitionMatrix, 0.01);
  transitionMatrix = normalizeRows(transitionMatrix); // Re-normalize after noise
  
  // Initialize initial probabilities (uniform with noise)
  const initialCounts = Array(N).fill(1); // Laplace smoothing
  for (const state of stateAssignments.slice(0, Math.min(10, T))) {
    initialCounts[state]++;
  }
  
  let initialProbs = normalizeArray(initialCounts);
  initialProbs = initialProbs.map(p => p + (Math.random() - 0.5) * 0.01);
  initialProbs = normalizeArray(initialProbs); // Re-normalize
  
  return {
    numStates: N,
    numFeatures: D,
    transitionMatrix,
    emissionParams,
    initialProbs,
  };
}

