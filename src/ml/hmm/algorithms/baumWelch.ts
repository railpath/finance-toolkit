/**
 * Baum-Welch Algorithm (EM) for Hidden Markov Models
 * 
 * Learns HMM parameters from observations using Expectation-Maximization
 */

import { BaumWelchOptions, BaumWelchOptionsSchema } from '../../schemas/BaumWelchOptionsSchema';
import { HMMModel, HMMModelSchema } from '../../schemas/HMMModelSchema';
import { normalizeArray, normalizeRows } from '../../utils/matrixUtils';
import { validateFeatureMatrix, validateNumStates } from '../../utils/validationUtils';

import { backward } from './backward';
import { forward } from './forward';

/**
 * Baum-Welch Algorithm
 * 
 * @param observations - T x D matrix of observations
 * @param numStates - Number of hidden states
 * @param options - Training options (maxIterations, tolerance, initial model)
 * @returns Trained HMM model
 * 
 * @example
 * ```typescript
 * const model = baumWelch(observations, 3, {
 *   maxIterations: 100,
 *   convergenceTolerance: 1e-6
 * });
 * ```
 */
export function baumWelch(
  observations: number[][],
  numStates: number,
  options: BaumWelchOptions
): HMMModel {
  validateFeatureMatrix(observations);
  validateNumStates(numStates, observations);
  
  const validatedOptions = BaumWelchOptionsSchema.parse(options);
  
  const T = observations.length;
  const N = numStates;
  const D = observations[0].length;
  const { maxIterations, convergenceTolerance, initialModel } = validatedOptions;
  
  // Initialize model or use provided initial model
  let model: HMMModel;
  if (initialModel) {
    model = initialModel;
  } else {
    model = initializeModelUniform(N, D);
  }
  
  let prevLogLikelihood = -Infinity;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // E-Step: Forward-Backward to compute gamma and xi
    const forwardResult = forward(
      observations,
      model.transitionMatrix,
      model.emissionParams,
      model.initialProbs
    );
    
    const backwardResult = backward(
      observations,
      model.transitionMatrix,
      model.emissionParams,
      forwardResult.scalingFactors
    );
    
    const { alpha } = forwardResult;
    const { beta } = backwardResult;
    
    // Compute gamma: γ(t,i) = P(qₜ=i | O, λ)
    const gamma: number[][] = Array(T).fill(0).map(() => Array(N).fill(0));
    for (let t = 0; t < T; t++) {
      let sum = 0;
      for (let i = 0; i < N; i++) {
        gamma[t][i] = alpha[t][i] * beta[t][i];
        sum += gamma[t][i];
      }
      // Normalize
      if (sum > 0) {
        for (let i = 0; i < N; i++) {
          gamma[t][i] /= sum;
        }
      }
    }
    
    // M-Step: Update parameters
    
    // Update initial probabilities
    model.initialProbs = gamma[0].slice();
    
    // Update transition matrix
    const newTransitionMatrix: number[][] = Array(N).fill(0).map(() => Array(N).fill(1e-10));
    
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let numerator = 0;
        let denominator = 0;
        
        for (let t = 0; t < T - 1; t++) {
          const xi = computeXi(t, i, j, alpha, beta, model, observations);
          numerator += xi;
          denominator += gamma[t][i];
        }
        
        if (denominator > 0) {
          newTransitionMatrix[i][j] = numerator / denominator;
        }
      }
    }
    
    model.transitionMatrix = normalizeRows(newTransitionMatrix);
    
    // Update emission parameters
    for (let i = 0; i < N; i++) {
      const newMeans: number[] = Array(D).fill(0);
      const newVariances: number[] = Array(D).fill(0);
      
      let gammaSum = 0;
      for (let t = 0; t < T; t++) {
        gammaSum += gamma[t][i];
      }
      
      if (gammaSum > 0) {
        // Update means
        for (let d = 0; d < D; d++) {
          let sum = 0;
          for (let t = 0; t < T; t++) {
            sum += gamma[t][i] * observations[t][d];
          }
          newMeans[d] = sum / gammaSum;
        }
        
        // Update variances
        for (let d = 0; d < D; d++) {
          let sum = 0;
          for (let t = 0; t < T; t++) {
            sum += gamma[t][i] * Math.pow(observations[t][d] - newMeans[d], 2);
          }
          newVariances[d] = Math.max(sum / gammaSum, 1e-6); // Prevent zero variance
        }
        
        model.emissionParams[i] = {
          means: newMeans,
          variances: newVariances,
        };
      }
    }
    
    // Check convergence
    const logLikelihood = forwardResult.logLikelihood;
    model.logLikelihood = logLikelihood;
    
    if (Math.abs(logLikelihood - prevLogLikelihood) < convergenceTolerance) {
      break;
    }
    
    prevLogLikelihood = logLikelihood;
  }
  
  return HMMModelSchema.parse(model);
}

/**
 * Initialize model with uniform parameters
 */
function initializeModelUniform(numStates: number, numFeatures: number): HMMModel {
  const N = numStates;
  const D = numFeatures;
  
  // Uniform transition matrix with small noise
  const transitionMatrix = Array(N).fill(0).map(() =>
    Array(N).fill(1 / N).map(p => p + (Math.random() - 0.5) * 0.01)
  );
  
  // Normalize rows
  const normalizedTransitionMatrix = normalizeRows(transitionMatrix);
  
  // Random emission parameters
  const emissionParams = Array(N).fill(0).map(() => ({
    means: Array(D).fill(0).map(() => (Math.random() - 0.5) * 0.1),
    variances: Array(D).fill(1),
  }));
  
  // Uniform initial probabilities
  const initialProbs = normalizeArray(Array(N).fill(1));
  
  return {
    numStates: N,
    numFeatures: D,
    transitionMatrix: normalizedTransitionMatrix,
    emissionParams,
    initialProbs,
  };
}

/**
 * Compute xi: ξ(t,i,j) = P(qₜ=i, qₜ₊₁=j | O, λ)
 */
function computeXi(
  t: number,
  i: number,
  j: number,
  alpha: number[][],
  beta: number[][],
  model: HMMModel,
  observations: number[][]
): number {
  // Emission probability for observation at t+1
  let emissionProb = 1;
  for (let d = 0; d < observations[t + 1].length; d++) {
    const mean = model.emissionParams[j].means[d];
    const variance = model.emissionParams[j].variances[d];
    const x = observations[t + 1][d];
    
    const coeff = 1 / Math.sqrt(2 * Math.PI * variance);
    const exp = Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
    emissionProb *= coeff * exp;
  }
  
  const xi = alpha[t][i] * model.transitionMatrix[i][j] * emissionProb * beta[t + 1][j];
  
  return xi;
}

