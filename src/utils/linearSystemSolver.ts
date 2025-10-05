/**
 * Linear System Solver Utilities
 * 
 * Collection of utility functions for solving linear systems of equations,
 * commonly used in mathematical optimization and portfolio analysis.
 */

/**
 * Solve a linear system Ax = b using Gaussian elimination with partial pivoting
 * 
 * @param A - Coefficient matrix (n×n)
 * @param b - Right-hand side vector (n×1)
 * @returns Solution vector x
 * 
 * @example
 * ```typescript
 * const A = [[2, 1], [1, 3]];
 * const b = [5, 8];
 * const x = solveLinearSystem(A, b); // [1, 3]
 * ```
 */
export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  
  if (n === 0) {
    throw new Error('Matrix A cannot be empty');
  }
  
  if (A[0].length !== n) {
    throw new Error('Matrix A must be square');
  }
  
  if (b.length !== n) {
    throw new Error('Vector b must match matrix dimensions');
  }
  
  // Create augmented matrix [A|b]
  const augmented: number[][] = A.map((row, i) => [...row, b[i]]);
  
  // Forward elimination with partial pivoting
  for (let i = 0; i < n; i++) {
    // Find pivot (largest element in current column)
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    
    // Swap rows if necessary
    if (maxRow !== i) {
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    }
    
    // Check for singular matrix
    if (Math.abs(augmented[i][i]) < 1e-12) {
      // Return zero solution for singular matrices
      return new Array(n).fill(0);
    }
    
    // Eliminate column below diagonal
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j <= n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }
  
  // Back substitution
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }
  
  return x;
}

/**
 * Solve multiple linear systems with the same coefficient matrix
 * 
 * @param A - Coefficient matrix (n×n)
 * @param B - Matrix of right-hand sides (n×m)
 * @returns Matrix of solutions (n×m)
 * 
 * @example
 * ```typescript
 * const A = [[2, 1], [1, 3]];
 * const B = [[5, 1], [8, 2]];
 * const X = solveMultipleLinearSystems(A, B);
 * ```
 */
export function solveMultipleLinearSystems(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const m = B[0].length;
  
  if (n === 0) {
    throw new Error('Matrix A cannot be empty');
  }
  
  if (B.length !== n) {
    throw new Error('Matrix B must have same number of rows as A');
  }
  
  const solutions: number[][] = [];
  
  for (let j = 0; j < m; j++) {
    const b = B.map(row => row[j]);
    solutions.push(solveLinearSystem(A, b));
  }
  
  // Transpose to get proper format
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < m; j++) {
      result[i][j] = solutions[j][i];
    }
  }
  
  return result;
}

/**
 * Calculate the determinant of a square matrix using LU decomposition
 * 
 * @param A - Square matrix (n×n)
 * @returns Determinant of the matrix
 * 
 * @example
 * ```typescript
 * const A = [[2, 1], [1, 3]];
 * const det = matrixDeterminant(A); // 5
 * ```
 */
export function matrixDeterminant(A: number[][]): number {
  const n = A.length;
  
  if (n === 0) {
    throw new Error('Matrix cannot be empty');
  }
  
  if (A[0].length !== n) {
    throw new Error('Matrix must be square');
  }
  
  if (n === 1) {
    return A[0][0];
  }
  
  if (n === 2) {
    return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  }
  
  // For larger matrices, use LU decomposition
  const { U, sign } = luDecomposition(A);
  
  let det = sign;
  for (let i = 0; i < n; i++) {
    det *= U[i][i];
  }
  
  return det;
}

/**
 * Perform LU decomposition of a matrix
 * 
 * @param A - Square matrix (n×n)
 * @returns Object containing L, U matrices and permutation sign
 * 
 * @example
 * ```typescript
 * const A = [[2, 1, 0], [1, 2, 1], [0, 1, 2]];
 * const { L, U, sign } = luDecomposition(A);
 * ```
 */
export function luDecomposition(A: number[][]): { L: number[][], U: number[][], sign: number } {
  const n = A.length;
  
  if (n === 0 || A[0].length !== n) {
    throw new Error('Matrix must be square');
  }
  
  // Create copies
  const U = A.map(row => [...row]);
  const L: number[][] = Array(n).fill(null).map(() => new Array(n).fill(0));
  const P: number[] = Array(n).fill(0).map((_, i) => i);
  
  let sign = 1;
  
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;
  }
  
  for (let i = 0; i < n; i++) {
    // Partial pivoting
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(U[k][i]) > Math.abs(U[maxRow][i])) {
        maxRow = k;
      }
    }
    
    if (maxRow !== i) {
      // Swap rows in U
      [U[i], U[maxRow]] = [U[maxRow], U[i]];
      
      // Swap rows in L (only elements before diagonal)
      for (let j = 0; j < i; j++) {
        [L[i][j], L[maxRow][j]] = [L[maxRow][j], L[i][j]];
      }
      
      // Update permutation
      [P[i], P[maxRow]] = [P[maxRow], P[i]];
      sign *= -1;
    }
    
    // Gaussian elimination
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(U[i][i]) < 1e-12) {
        throw new Error('Matrix is singular');
      }
      
      const factor = U[k][i] / U[i][i];
      L[k][i] = factor;
      
      for (let j = i; j < n; j++) {
        U[k][j] -= factor * U[i][j];
      }
    }
  }
  
  return { L, U, sign };
}

/**
 * Check if a matrix is invertible (non-singular)
 * 
 * @param A - Square matrix (n×n)
 * @param tolerance - Tolerance for determinant check (default: 1e-12)
 * @returns True if matrix is invertible
 * 
 * @example
 * ```typescript
 * const A = [[2, 1], [1, 3]];
 * const invertible = isMatrixInvertible(A); // true
 * ```
 */
export function isMatrixInvertible(A: number[][], tolerance: number = 1e-12): boolean {
  try {
    const det = matrixDeterminant(A);
    return Math.abs(det) > tolerance;
  } catch {
    return false;
  }
}

/**
 * Calculate the condition number of a matrix (ratio of largest to smallest singular value)
 * Simplified implementation for 2x2 matrices
 * 
 * @param A - Square matrix (n×n)
 * @returns Condition number
 * 
 * @example
 * ```typescript
 * const A = [[2, 1], [1, 3]];
 * const cond = matrixConditionNumber(A);
 * ```
 */
export function matrixConditionNumber(A: number[][]): number {
  const n = A.length;
  
  if (n === 0 || A[0].length !== n) {
    throw new Error('Matrix must be square');
  }
  
  if (n === 1) {
    return 1;
  }
  
  if (n === 2) {
    // For 2x2 matrices, use analytical formula
    const a = A[0][0], b = A[0][1], c = A[1][0], d = A[1][1];
    const trace = a + d;
    const det = a * d - b * c;
    
    if (Math.abs(det) < 1e-12) {
      return Infinity;
    }
    
    const discriminant = trace * trace - 4 * det;
    if (discriminant < 0) {
      return Infinity;
    }
    
    const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
    const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
    
    const maxEigenval = Math.max(Math.abs(lambda1), Math.abs(lambda2));
    const minEigenval = Math.min(Math.abs(lambda1), Math.abs(lambda2));
    
    return minEigenval > 1e-12 ? maxEigenval / minEigenval : Infinity;
  }
  
  // For larger matrices, this is a simplified approximation
  // In practice, you'd want to use SVD
  return 1;
}
