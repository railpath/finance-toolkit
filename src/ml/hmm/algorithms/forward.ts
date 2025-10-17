/**
 * Forward Algorithm for Hidden Markov Models
 * 
 * Computes forward probabilities α(t,i) = P(o₁...oₜ, qₜ=i | λ)
 * Uses scaling for numerical stability
 */

import { ForwardResult, ForwardResultSchema } from '../../schemas/ForwardResultSchema';

import { EmissionParams } from '../../schemas/EmissionParamsSchema';
import { logMultivariateGaussianPDF } from '../../utils/statisticsUtils';

/**
 * Forward Algorithm with scaling
 * 
 * @param observations - T x D matrix of observations
 * @param transitionMatrix - N x N transition probability matrix
 * @param emissionParams - Emission parameters for each state
 * @param initialProbs - Initial state probabilities
 * @returns Forward probabilities and scaling factors
 * 
 * @example
 * ```typescript
 * const result = forward(observations, transitionMatrix, emissionParams, initialProbs);
 * console.log(result.logLikelihood); // Log-likelihood of observations
 * ```
 */
export function forward(
  observations: number[][],
  transitionMatrix: number[][],
  emissionParams: EmissionParams[],
  initialProbs: number[]
): ForwardResult {
  const T = observations.length;
  const N = initialProbs.length;
  
  // Initialize alpha and scaling factors
  const alpha: number[][] = Array(T).fill(0).map(() => Array(N).fill(0));
  const scalingFactors: number[] = Array(T).fill(0);
  
  // t = 0: Initialize
  for (let i = 0; i < N; i++) {
    // Calculate emission probability for first observation
    const emissionProb = Math.exp(
      logMultivariateGaussianPDF(
        observations[0],
        emissionParams[i].means,
        emissionParams[i].variances
      )
    );
    
    alpha[0][i] = initialProbs[i] * emissionProb;
  }
  
  // Scale first row
  scalingFactors[0] = alpha[0].reduce((sum, val) => sum + val, 0);
  if (scalingFactors[0] > 0) {
    for (let i = 0; i < N; i++) {
      alpha[0][i] /= scalingFactors[0];
    }
  }
  
  // t = 1..T-1: Recursion
  for (let t = 1; t < T; t++) {
    for (let j = 0; j < N; j++) {
      let sum = 0;
      for (let i = 0; i < N; i++) {
        sum += alpha[t - 1][i] * transitionMatrix[i][j];
      }
      
      // Calculate emission probability for current observation
      const emissionProb = Math.exp(
        logMultivariateGaussianPDF(
          observations[t],
          emissionParams[j].means,
          emissionParams[j].variances
        )
      );
      
      alpha[t][j] = sum * emissionProb;
    }
    
    // Scale current row
    scalingFactors[t] = alpha[t].reduce((sum, val) => sum + val, 0);
    if (scalingFactors[t] > 0) {
      for (let j = 0; j < N; j++) {
        alpha[t][j] /= scalingFactors[t];
      }
    }
  }
  
  // Calculate log-likelihood using scaling factors
  let logLikelihood = 0;
  for (let t = 0; t < T; t++) {
    if (scalingFactors[t] > 0) {
      logLikelihood += Math.log(scalingFactors[t]);
    }
  }
  
  return ForwardResultSchema.parse({
    alpha,
    scalingFactors,
    logLikelihood,
  });
}

