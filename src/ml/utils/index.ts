/**
 * Machine Learning Utility Functions
 * 
 * Reusable utilities for ML algorithms
 */

// Matrix Utils
export { logSumExp, normalizeRows, normalizeArray, addNoise } from './matrixUtils';

// Statistics Utils
export {
  gaussianPDF,
  logGaussianPDF,
  calculateMean,
  calculateVariance,
  standardize,
  multivariateGaussianPDF,
  logMultivariateGaussianPDF,
} from './statisticsUtils';

// Validation Utils
export {
  validatePriceArray,
  validateFeatureMatrix,
  validateHMMParameters,
  validateNumStates,
} from './validationUtils';

