/**
 * Vector Operations Utilities
 * 
 * Collection of utility functions for vector operations commonly used in
 * mathematical optimization and portfolio analysis.
 */

/**
 * Calculate the Euclidean norm (magnitude) of a vector
 * 
 * @param v - Input vector
 * @returns Euclidean norm of the vector
 * 
 * @example
 * ```typescript
 * const norm = vectorNorm([3, 4]); // 5
 * const norm2 = vectorNorm([1, 1, 1]); // √3 ≈ 1.732
 * ```
 */
export function vectorNorm(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Add two vectors element-wise
 * 
 * @param a - First vector
 * @param b - Second vector
 * @returns Vector sum a + b
 * 
 * @example
 * ```typescript
 * const sum = vectorAdd([1, 2, 3], [4, 5, 6]); // [5, 7, 9]
 * ```
 */
export function vectorAdd(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  return a.map((val, i) => val + b[i]);
}

/**
 * Subtract two vectors element-wise
 * 
 * @param a - First vector (minuend)
 * @param b - Second vector (subtrahend)
 * @returns Vector difference a - b
 * 
 * @example
 * ```typescript
 * const diff = vectorSubtract([5, 7, 9], [1, 2, 3]); // [4, 5, 6]
 * ```
 */
export function vectorSubtract(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  return a.map((val, i) => val - b[i]);
}

/**
 * Scale a vector by a scalar value
 * 
 * @param v - Input vector
 * @param scalar - Scalar multiplier
 * @returns Scaled vector
 * 
 * @example
 * ```typescript
 * const scaled = vectorScale([1, 2, 3], 2); // [2, 4, 6]
 * const scaled2 = vectorScale([1, 2, 3], -1); // [-1, -2, -3]
 * ```
 */
export function vectorScale(v: number[], scalar: number): number[] {
  return v.map(val => val * scalar);
}

/**
 * Calculate the dot product (inner product) of two vectors
 * 
 * @param a - First vector
 * @param b - Second vector
 * @returns Dot product a · b
 * 
 * @example
 * ```typescript
 * const dot = vectorDot([1, 2, 3], [4, 5, 6]); // 1*4 + 2*5 + 3*6 = 32
 * ```
 */
export function vectorDot(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Calculate the cross product of two 3D vectors
 * 
 * @param a - First 3D vector
 * @param b - Second 3D vector
 * @returns Cross product a × b
 * 
 * @example
 * ```typescript
 * const cross = vectorCross([1, 0, 0], [0, 1, 0]); // [0, 0, 1]
 * ```
 */
export function vectorCross(a: number[], b: number[]): number[] {
  if (a.length !== 3 || b.length !== 3) {
    throw new Error('Cross product is only defined for 3D vectors');
  }
  
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

/**
 * Normalize a vector to unit length
 * 
 * @param v - Input vector
 * @returns Normalized vector (unit vector)
 * 
 * @example
 * ```typescript
 * const normalized = vectorNormalize([3, 4]); // [0.6, 0.8]
 * ```
 */
export function vectorNormalize(v: number[]): number[] {
  const norm = vectorNorm(v);
  if (norm === 0) {
    throw new Error('Cannot normalize zero vector');
  }
  return vectorScale(v, 1 / norm);
}

/**
 * Calculate the distance between two vectors
 * 
 * @param a - First vector
 * @param b - Second vector
 * @returns Euclidean distance between vectors
 * 
 * @example
 * ```typescript
 * const distance = vectorDistance([0, 0], [3, 4]); // 5
 * ```
 */
export function vectorDistance(a: number[], b: number[]): number {
  return vectorNorm(vectorSubtract(a, b));
}

/**
 * Check if two vectors are approximately equal within tolerance
 * 
 * @param a - First vector
 * @param b - Second vector
 * @param tolerance - Tolerance for comparison (default: 1e-12)
 * @returns True if vectors are approximately equal
 * 
 * @example
 * ```typescript
 * const equal = vectorEquals([1.0000001, 2], [1, 2.0000001], 1e-6); // true
 * ```
 */
export function vectorEquals(a: number[], b: number[], tolerance: number = 1e-12): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > tolerance) {
      return false;
    }
  }
  
  return true;
}

/**
 * Create a zero vector of specified length
 * 
 * @param length - Length of the vector
 * @returns Zero vector
 * 
 * @example
 * ```typescript
 * const zero = createZeroVector(3); // [0, 0, 0]
 * ```
 */
export function createZeroVector(length: number): number[] {
  return new Array(length).fill(0);
}

/**
 * Create a vector filled with a constant value
 * 
 * @param length - Length of the vector
 * @param value - Value to fill
 * @returns Vector filled with constant value
 * 
 * @example
 * ```typescript
 * const ones = createConstantVector(3, 1); // [1, 1, 1]
 * ```
 */
export function createConstantVector(length: number, value: number): number[] {
  return new Array(length).fill(value);
}
