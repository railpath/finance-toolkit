/**
 * Matrix Operations Utilities
 * 
 * Collection of utility functions for matrix operations commonly used in
 * mathematical optimization and portfolio analysis.
 */

import { vectorDot } from './vectorOperations';

/**
 * Multiply a matrix by a vector
 * 
 * @param A - Matrix (m×n)
 * @param x - Vector (n×1)
 * @returns Result vector (m×1)
 * 
 * @example
 * ```typescript
 * const A = [[1, 2], [3, 4]];
 * const x = [5, 6];
 * const result = matrixVectorMultiply(A, x); // [17, 39]
 * ```
 */
export function matrixVectorMultiply(A: number[][], x: number[]): number[] {
  if (A.length === 0 || A[0].length !== x.length) {
    throw new Error('Matrix columns must match vector length');
  }
  
  return A.map(row => vectorDot(row, x));
}

/**
 * Calculate the transpose of a matrix
 * 
 * @param A - Input matrix (m×n)
 * @returns Transpose matrix (n×m)
 * 
 * @example
 * ```typescript
 * const A = [[1, 2, 3], [4, 5, 6]];
 * const At = matrixTranspose(A); // [[1, 4], [2, 5], [3, 6]]
 * ```
 */
export function matrixTranspose(A: number[][]): number[][] {
  if (A.length === 0) {
    return [];
  }
  
  const rows = A.length;
  const cols = A[0].length;
  const result: number[][] = [];
  
  for (let j = 0; j < cols; j++) {
    result[j] = [];
    for (let i = 0; i < rows; i++) {
      result[j][i] = A[i][j];
    }
  }
  
  return result;
}

/**
 * Multiply two matrices
 * 
 * @param A - First matrix (m×k)
 * @param B - Second matrix (k×n)
 * @returns Result matrix (m×n)
 * 
 * @example
 * ```typescript
 * const A = [[1, 2], [3, 4]];
 * const B = [[5, 6], [7, 8]];
 * const result = matrixMatrixMultiply(A, B); // [[19, 22], [43, 50]]
 * ```
 */
export function matrixMatrixMultiply(A: number[][], B: number[][]): number[][] {
  if (A.length === 0 || B.length === 0) {
    throw new Error('Cannot multiply empty matrices');
  }
  
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  
  if (A[0].length !== inner) {
    throw new Error('Matrix dimensions must be compatible for multiplication');
  }
  
  const result: number[][] = [];
  
  for (let i = 0; i < rows; i++) {
    result[i] = [];
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  
  return result;
}

/**
 * Calculate the trace of a square matrix
 * 
 * @param A - Square matrix (n×n)
 * @returns Trace (sum of diagonal elements)
 * 
 * @example
 * ```typescript
 * const A = [[1, 2], [3, 4]];
 * const trace = matrixTrace(A); // 5
 * ```
 */
export function matrixTrace(A: number[][]): number {
  if (A.length === 0 || A.length !== A[0].length) {
    throw new Error('Matrix must be square');
  }
  
  let trace = 0;
  for (let i = 0; i < A.length; i++) {
    trace += A[i][i];
  }
  
  return trace;
}

/**
 * Check if a matrix is symmetric
 * 
 * @param A - Matrix to check
 * @param tolerance - Tolerance for comparison (default: 1e-12)
 * @returns True if matrix is symmetric
 * 
 * @example
 * ```typescript
 * const A = [[1, 2], [2, 3]];
 * const symmetric = isMatrixSymmetric(A); // true
 * ```
 */
export function isMatrixSymmetric(A: number[][], tolerance: number = 1e-12): boolean {
  if (A.length === 0 || A.length !== A[0].length) {
    return false;
  }
  
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A.length; j++) {
      if (Math.abs(A[i][j] - A[j][i]) > tolerance) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Check if a matrix is positive definite (simplified check)
 * 
 * @param A - Square matrix to check
 * @returns True if matrix appears to be positive definite
 * 
 * @example
 * ```typescript
 * const A = [[2, -1], [-1, 2]]; // Positive definite
 * const pd = isMatrixPositiveDefinite(A); // true
 * ```
 */
export function isMatrixPositiveDefinite(A: number[][]): boolean {
  if (A.length === 0 || A.length !== A[0].length) {
    return false;
  }
  
  // Check if matrix is symmetric
  if (!isMatrixSymmetric(A)) {
    return false;
  }
  
  // Simple check: all diagonal elements should be positive
  for (let i = 0; i < A.length; i++) {
    if (A[i][i] <= 0) {
      return false;
    }
  }
  
  // For 2x2 matrices, check determinant
  if (A.length === 2) {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return det > 0;
  }
  
  // For larger matrices, this is a simplified check
  // In practice, you'd want to check all principal minors
  return true;
}

/**
 * Create an identity matrix of specified size
 * 
 * @param size - Size of the identity matrix
 * @returns Identity matrix (n×n)
 * 
 * @example
 * ```typescript
 * const I = createIdentityMatrix(3);
 * // [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
 * ```
 */
export function createIdentityMatrix(size: number): number[][] {
  const I: number[][] = [];
  
  for (let i = 0; i < size; i++) {
    I[i] = [];
    for (let j = 0; j < size; j++) {
      I[i][j] = i === j ? 1 : 0;
    }
  }
  
  return I;
}

/**
 * Create a zero matrix of specified dimensions
 * 
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @returns Zero matrix (m×n)
 * 
 * @example
 * ```typescript
 * const Z = createZeroMatrix(2, 3);
 * // [[0, 0, 0], [0, 0, 0]]
 * ```
 */
export function createZeroMatrix(rows: number, cols: number): number[][] {
  const Z: number[][] = [];
  
  for (let i = 0; i < rows; i++) {
    Z[i] = new Array(cols).fill(0);
  }
  
  return Z;
}

/**
 * Extract diagonal elements from a square matrix
 * 
 * @param A - Square matrix
 * @returns Array of diagonal elements
 * 
 * @example
 * ```typescript
 * const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
 * const diag = matrixDiagonal(A); // [1, 5, 9]
 * ```
 */
export function matrixDiagonal(A: number[][]): number[] {
  if (A.length === 0 || A.length !== A[0].length) {
    throw new Error('Matrix must be square');
  }
  
  const diagonal: number[] = [];
  for (let i = 0; i < A.length; i++) {
    diagonal.push(A[i][i]);
  }
  
  return diagonal;
}

/**
 * Calculate the Frobenius norm of a matrix
 * 
 * @param A - Matrix
 * @returns Frobenius norm (square root of sum of squares of all elements)
 * 
 * @example
 * ```typescript
 * const A = [[1, 2], [3, 4]];
 * const norm = matrixFrobeniusNorm(A); // √30 ≈ 5.477
 * ```
 */
export function matrixFrobeniusNorm(A: number[][]): number {
  let sum = 0;
  
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[i].length; j++) {
      sum += A[i][j] * A[i][j];
    }
  }
  
  return Math.sqrt(sum);
}
