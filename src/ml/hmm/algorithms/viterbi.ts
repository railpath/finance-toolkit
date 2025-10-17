/**
 * Viterbi Algorithm for Hidden Markov Models
 * 
 * Finds the most likely sequence of hidden states given observations
 * Uses log probabilities for numerical stability
 */

import { ViterbiResult, ViterbiResultSchema } from '../../schemas/ViterbiResultSchema';

import { EmissionParams } from '../../schemas/EmissionParamsSchema';
import { logMultivariateGaussianPDF } from '../../utils/statisticsUtils';

/**
 * Viterbi Algorithm
 * 
 * @param observations - T x D matrix of observations
 * @param transitionMatrix - N x N transition probability matrix
 * @param emissionParams - Emission parameters for each state
 * @param initialProbs - Initial state probabilities
 * @returns Most likely state sequence and its log probability
 * 
 * @example
 * ```typescript
 * const result = viterbi(observations, transitionMatrix, emissionParams, initialProbs);
 * console.log(result.path); // [0, 1, 2, 1, 0, ...]
 * ```
 */
export function viterbi(
  observations: number[][],
  transitionMatrix: number[][],
  emissionParams: EmissionParams[],
  initialProbs: number[]
): ViterbiResult {
  const T = observations.length;
  const N = initialProbs.length;
  
  // Convert to log probabilities for numerical stability
  const logInitialProbs = initialProbs.map(p => Math.log(Math.max(p, 1e-300)));
  const logTransitionMatrix = transitionMatrix.map(row =>
    row.map(p => Math.log(Math.max(p, 1e-300)))
  );
  
  // Initialize delta (max probabilities) and psi (backpointers)
  const delta: number[][] = Array(T).fill(0).map(() => Array(N).fill(-Infinity));
  const psi: number[][] = Array(T).fill(0).map(() => Array(N).fill(0));
  
  // t = 0: Initialize
  for (let i = 0; i < N; i++) {
    const logEmissionProb = logMultivariateGaussianPDF(
      observations[0],
      emissionParams[i].means,
      emissionParams[i].variances
    );
    
    delta[0][i] = logInitialProbs[i] + logEmissionProb;
  }
  
  // t = 1..T-1: Recursion
  for (let t = 1; t < T; t++) {
    for (let j = 0; j < N; j++) {
      let maxProb = -Infinity;
      let maxState = 0;
      
      for (let i = 0; i < N; i++) {
        const prob = delta[t - 1][i] + logTransitionMatrix[i][j];
        if (prob > maxProb) {
          maxProb = prob;
          maxState = i;
        }
      }
      
      const logEmissionProb = logMultivariateGaussianPDF(
        observations[t],
        emissionParams[j].means,
        emissionParams[j].variances
      );
      
      delta[t][j] = maxProb + logEmissionProb;
      psi[t][j] = maxState;
    }
  }
  
  // Termination: Find best final state
  let maxProb = -Infinity;
  let bestFinalState = 0;
  for (let i = 0; i < N; i++) {
    if (delta[T - 1][i] > maxProb) {
      maxProb = delta[T - 1][i];
      bestFinalState = i;
    }
  }
  
  // Backtrack to find best path
  const path: number[] = Array(T).fill(0);
  path[T - 1] = bestFinalState;
  
  for (let t = T - 2; t >= 0; t--) {
    path[t] = psi[t + 1][path[t + 1]];
  }
  
  return ViterbiResultSchema.parse({
    path,
    logProbability: maxProb,
  });
}

