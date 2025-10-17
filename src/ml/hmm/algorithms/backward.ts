/**
 * Backward Algorithm for Hidden Markov Models
 * 
 * Computes backward probabilities β(t,i) = P(oₜ₊₁...oₜ | qₜ=i, λ)
 * Uses same scaling factors as forward algorithm for consistency
 */

import { BackwardResult, BackwardResultSchema } from '../../schemas/BackwardResultSchema';

import { EmissionParams } from '../../schemas/EmissionParamsSchema';
import { logMultivariateGaussianPDF } from '../../utils/statisticsUtils';

/**
 * Backward Algorithm with scaling
 * 
 * @param observations - T x D matrix of observations
 * @param transitionMatrix - N x N transition probability matrix
 * @param emissionParams - Emission parameters for each state
 * @param scalingFactors - Scaling factors from forward algorithm
 * @returns Backward probabilities
 * 
 * @example
 * ```typescript
 * const forwardResult = forward(observations, transitionMatrix, emissionParams, initialProbs);
 * const backwardResult = backward(observations, transitionMatrix, emissionParams, forwardResult.scalingFactors);
 * ```
 */
export function backward(
  observations: number[][],
  transitionMatrix: number[][],
  emissionParams: EmissionParams[],
  scalingFactors: number[]
): BackwardResult {
  const T = observations.length;
  const N = transitionMatrix.length;
  
  // Initialize beta
  const beta: number[][] = Array(T).fill(0).map(() => Array(N).fill(0));
  
  // t = T-1: Initialize (all to 1, then scale)
  for (let i = 0; i < N; i++) {
    beta[T - 1][i] = 1;
  }
  
  // Scale last row
  if (scalingFactors[T - 1] > 0) {
    for (let i = 0; i < N; i++) {
      beta[T - 1][i] /= scalingFactors[T - 1];
    }
  }
  
  // t = T-2..0: Recursion (backward)
  for (let t = T - 2; t >= 0; t--) {
    for (let i = 0; i < N; i++) {
      let sum = 0;
      for (let j = 0; j < N; j++) {
        // Calculate emission probability for next observation
        const emissionProb = Math.exp(
          logMultivariateGaussianPDF(
            observations[t + 1],
            emissionParams[j].means,
            emissionParams[j].variances
          )
        );
        
        sum += transitionMatrix[i][j] * emissionProb * beta[t + 1][j];
      }
      beta[t][i] = sum;
    }
    
    // Scale using same scaling factor as forward
    if (scalingFactors[t] > 0) {
      for (let i = 0; i < N; i++) {
        beta[t][i] /= scalingFactors[t];
      }
    }
  }
  
  return BackwardResultSchema.parse({ beta });
}

