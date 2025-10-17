/**
 * Statistical Utility Functions for Machine Learning
 * 
 * Provides statistical functions commonly used in ML algorithms
 */

/**
 * Calculate Gaussian Probability Density Function
 * 
 * @param x - Value to evaluate
 * @param mean - Mean of the Gaussian
 * @param variance - Variance of the Gaussian
 * @returns PDF value
 * 
 * @example
 * ```typescript
 * const pdf = gaussianPDF(1.0, 0.0, 1.0); // Standard normal at x=1
 * ```
 */
export function gaussianPDF(x: number, mean: number, variance: number): number {
  if (variance <= 0) {
    throw new Error('Variance must be positive');
  }
  
  const coefficient = 1 / Math.sqrt(2 * Math.PI * variance);
  const exponent = -Math.pow(x - mean, 2) / (2 * variance);
  
  return coefficient * Math.exp(exponent);
}

/**
 * Calculate log of Gaussian PDF for numerical stability
 * 
 * @param x - Value to evaluate
 * @param mean - Mean of the Gaussian
 * @param variance - Variance of the Gaussian
 * @returns Log PDF value
 */
export function logGaussianPDF(x: number, mean: number, variance: number): number {
  if (variance <= 0) {
    throw new Error('Variance must be positive');
  }
  
  const logCoefficient = -0.5 * Math.log(2 * Math.PI * variance);
  const exponent = -Math.pow(x - mean, 2) / (2 * variance);
  
  return logCoefficient + exponent;
}

/**
 * Calculate mean of values
 * 
 * @param values - Array of numbers
 * @returns Mean value
 * 
 * @example
 * ```typescript
 * const mean = calculateMean([1, 2, 3, 4, 5]); // 3
 * ```
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate mean of empty array');
  }
  
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate variance of values
 * 
 * @param values - Array of numbers
 * @param mean - Pre-computed mean (optional)
 * @returns Variance
 * 
 * @example
 * ```typescript
 * const variance = calculateVariance([1, 2, 3, 4, 5]); // 2
 * ```
 */
export function calculateVariance(values: number[], mean?: number): number {
  if (values.length === 0) {
    throw new Error('Cannot calculate variance of empty array');
  }
  
  const mu = mean !== undefined ? mean : calculateMean(values);
  const squaredDiffs = values.map(val => Math.pow(val - mu, 2));
  
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Standardize values (z-score normalization)
 * 
 * Transforms values to have mean=0 and variance=1
 * 
 * @param values - Array of numbers
 * @returns Standardized values
 * 
 * @example
 * ```typescript
 * const standardized = standardize([1, 2, 3, 4, 5]);
 * ```
 */
export function standardize(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }
  
  const mean = calculateMean(values);
  const variance = calculateVariance(values, mean);
  
  // If variance is 0, return array of zeros
  if (variance === 0) {
    return values.map(() => 0);
  }
  
  const stdDev = Math.sqrt(variance);
  
  return values.map(val => (val - mean) / stdDev);
}

/**
 * Calculate multivariate Gaussian PDF
 * 
 * For a feature vector x with independent features
 * 
 * @param x - Feature vector
 * @param means - Mean for each feature
 * @param variances - Variance for each feature
 * @returns PDF value
 */
export function multivariateGaussianPDF(
  x: number[],
  means: number[],
  variances: number[]
): number {
  if (x.length !== means.length || x.length !== variances.length) {
    throw new Error('Dimension mismatch in multivariate Gaussian PDF');
  }
  
  let product = 1;
  for (let i = 0; i < x.length; i++) {
    product *= gaussianPDF(x[i], means[i], variances[i]);
  }
  
  return product;
}

/**
 * Calculate log of multivariate Gaussian PDF for numerical stability
 * 
 * @param x - Feature vector
 * @param means - Mean for each feature
 * @param variances - Variance for each feature
 * @returns Log PDF value
 */
export function logMultivariateGaussianPDF(
  x: number[],
  means: number[],
  variances: number[]
): number {
  if (x.length !== means.length || x.length !== variances.length) {
    throw new Error('Dimension mismatch in multivariate Gaussian PDF');
  }
  
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += logGaussianPDF(x[i], means[i], variances[i]);
  }
  
  return sum;
}

