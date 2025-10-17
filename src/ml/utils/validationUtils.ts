/**
 * Validation Utility Functions for Machine Learning
 * 
 * Provides input validation helpers for ML algorithms
 */

import { HMMModel } from '../schemas/HMMModelSchema';

/**
 * Validate price array
 * 
 * @param prices - Array of prices
 * @throws Error if validation fails
 */
export function validatePriceArray(prices: number[]): void {
  if (!Array.isArray(prices)) {
    throw new Error('Prices must be an array');
  }
  
  if (prices.length < 2) {
    throw new Error('At least 2 prices required');
  }
  
  if (!prices.every(p => typeof p === 'number' && isFinite(p))) {
    throw new Error('All prices must be finite numbers');
  }
  
  if (!prices.every(p => p > 0)) {
    throw new Error('All prices must be positive');
  }
}

/**
 * Validate feature matrix
 * 
 * @param features - T x D matrix of features
 * @throws Error if validation fails
 */
export function validateFeatureMatrix(features: number[][]): void {
  if (!Array.isArray(features)) {
    throw new Error('Features must be an array');
  }
  
  if (features.length === 0) {
    throw new Error('Features array cannot be empty');
  }
  
  const numFeatures = features[0].length;
  
  if (numFeatures === 0) {
    throw new Error('Each observation must have at least one feature');
  }
  
  for (let t = 0; t < features.length; t++) {
    if (!Array.isArray(features[t])) {
      throw new Error(`Observation at index ${t} is not an array`);
    }
    
    if (features[t].length !== numFeatures) {
      throw new Error(`All observations must have the same number of features. Expected ${numFeatures}, got ${features[t].length} at index ${t}`);
    }
    
    if (!features[t].every(f => typeof f === 'number' && isFinite(f))) {
      throw new Error(`All features must be finite numbers at observation ${t}`);
    }
  }
}

/**
 * Validate HMM parameters
 * 
 * @param model - HMM model to validate
 * @throws Error if validation fails
 */
export function validateHMMParameters(model: HMMModel): void {
  const { numStates, transitionMatrix, emissionParams, initialProbs } = model;
  
  // Validate dimensions
  if (transitionMatrix.length !== numStates) {
    throw new Error(`Transition matrix must have ${numStates} rows`);
  }
  
  if (!transitionMatrix.every(row => row.length === numStates)) {
    throw new Error(`All rows in transition matrix must have ${numStates} columns`);
  }
  
  if (emissionParams.length !== numStates) {
    throw new Error(`Must have ${numStates} emission parameter sets`);
  }
  
  if (initialProbs.length !== numStates) {
    throw new Error(`Initial probabilities must have ${numStates} elements`);
  }
  
  // Validate probability constraints
  const validateProbabilities = (probs: number[], name: string) => {
    if (!probs.every(p => p >= 0 && p <= 1)) {
      throw new Error(`${name} must be between 0 and 1`);
    }
    
    const sum = probs.reduce((acc, p) => acc + p, 0);
    if (Math.abs(sum - 1) > 1e-6) {
      throw new Error(`${name} must sum to 1 (sum = ${sum})`);
    }
  };
  
  // Validate transition matrix rows sum to 1
  transitionMatrix.forEach((row, i) => {
    validateProbabilities(row, `Transition matrix row ${i}`);
  });
  
  // Validate initial probabilities sum to 1
  validateProbabilities(initialProbs, 'Initial probabilities');
  
  // Validate emission parameters
  emissionParams.forEach((params, i) => {
    if (params.means.length !== params.variances.length) {
      throw new Error(`Emission params ${i}: means and variances must have same length`);
    }
    
    if (!params.variances.every(v => v > 0)) {
      throw new Error(`Emission params ${i}: all variances must be positive`);
    }
  });
}

/**
 * Validate number of states
 * 
 * @param numStates - Number of states
 * @param observations - Observation matrix
 * @throws Error if validation fails
 */
export function validateNumStates(numStates: number, observations: number[][]): void {
  if (!Number.isInteger(numStates) || numStates < 2) {
    throw new Error('Number of states must be an integer >= 2');
  }
  
  if (numStates > observations.length) {
    throw new Error(`Number of states (${numStates}) cannot exceed number of observations (${observations.length})`);
  }
}

