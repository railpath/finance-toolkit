/**
 * High-Level HMM Training Wrapper
 * 
 * Combines initialization and Baum-Welch training
 */

import { HMMModel, HMMModelSchema } from '../../schemas/HMMModelSchema';
import { TrainHMMOptions, TrainHMMOptionsSchema } from '../../schemas/TrainHMMOptionsSchema';
import { validateFeatureMatrix, validateNumStates } from '../../utils/validationUtils';

import { baumWelch } from '../algorithms/baumWelch';
import { initializeHMM } from './initializeHMM';

/**
 * Train HMM model on observations
 * 
 * @param observations - T x D matrix of observations
 * @param options - Training options
 * @returns Trained HMM model
 * 
 * @example
 * ```typescript
 * const model = trainHMM(features, {
 *   numStates: 3,
 *   maxIterations: 100,
 *   convergenceTolerance: 1e-6
 * });
 * ```
 */
export function trainHMM(
  observations: number[][],
  options: TrainHMMOptions
): HMMModel {
  validateFeatureMatrix(observations);
  
  const validatedOptions = TrainHMMOptionsSchema.parse(options);
  validateNumStates(validatedOptions.numStates, observations);
  
  const {
    numStates,
    maxIterations,
    convergenceTolerance,
    initialModel,
  } = validatedOptions;
  
  // Initialize model if not provided
  const initModel = initialModel || initializeHMM(observations, numStates);
  
  // Train using Baum-Welch
  const trainedModel = baumWelch(observations, numStates, {
    maxIterations,
    convergenceTolerance,
    initialModel: initModel,
  });
  
  // Validate and return
  return HMMModelSchema.parse(trainedModel);
}

