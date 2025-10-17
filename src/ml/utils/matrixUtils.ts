/**
 * Matrix Utility Functions for Machine Learning
 * 
 * Provides numerically stable operations for ML algorithms
 */

/**
 * Log-Sum-Exp trick for numerical stability
 * 
 * Computes log(sum(exp(logValues))) in a numerically stable way
 * 
 * @param logValues - Array of log values
 * @returns log(sum(exp(logValues)))
 * 
 * @example
 * ```typescript
 * const result = logSumExp([-1000, -999, -1001]); // ≈ -998.59
 * ```
 */
export function logSumExp(logValues: number[]): number {
  if (logValues.length === 0) {
    return -Infinity;
  }
  
  const maxLogValue = Math.max(...logValues);
  
  if (!isFinite(maxLogValue)) {
    return maxLogValue;
  }
  
  let sum = 0;
  for (const logValue of logValues) {
    sum += Math.exp(logValue - maxLogValue);
  }
  
  return maxLogValue + Math.log(sum);
}

/**
 * Normalize rows of a matrix (each row sums to 1)
 * 
 * @param matrix - Input matrix
 * @returns Matrix with normalized rows
 * 
 * @example
 * ```typescript
 * const matrix = [[1, 2, 3], [4, 5, 6]];
 * const normalized = normalizeRows(matrix);
 * // [[0.167, 0.333, 0.5], [0.267, 0.333, 0.4]]
 * ```
 */
export function normalizeRows(matrix: number[][]): number[][] {
  return matrix.map(row => {
    const sum = row.reduce((acc, val) => acc + val, 0);
    if (sum === 0 || !isFinite(sum)) {
      // If sum is 0, return uniform distribution (maximum entropy)
      return row.map(() => 1 / row.length);
    }
    return row.map(val => val / sum);
  });
}

/**
 * Normalize an array (values sum to 1)
 * 
 * @param arr - Input array
 * @returns Normalized array
 * 
 * @example
 * ```typescript
 * const arr = [1, 2, 3, 4];
 * const normalized = normalizeArray(arr); // [0.1, 0.2, 0.3, 0.4]
 * ```
 */
export function normalizeArray(arr: number[]): number[] {
  const sum = arr.reduce((acc, val) => acc + val, 0);
  if (sum === 0) {
    // If sum is 0, return uniform distribution
    return arr.map(() => 1 / arr.length);
  }
  return arr.map(val => val / sum);
}

/**
 * Add small noise to break symmetry
 * 
 * @param matrix - Input matrix
 * @param noiseLevel - Level of noise (default: 1e-4)
 * @returns Matrix with added noise
 */
export function addNoise(matrix: number[][], noiseLevel: number = 1e-4): number[][] {
  return matrix.map(row => 
    row.map(val => val + (Math.random() - 0.5) * noiseLevel)
  );
}

