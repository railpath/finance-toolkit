/**
 * Constraint Projection Utilities
 * 
 * Collection of utility functions for projecting solutions onto constraint sets,
 * commonly used in mathematical optimization and portfolio analysis.
 */

import { matrixMatrixMultiply, matrixTranspose, matrixVectorMultiply } from './matrixOperations';
import { vectorDot, vectorScale, vectorSubtract } from './vectorOperations';

import { solveLinearSystem } from './linearSystemSolver';

/**
 * Project a solution vector onto equality constraints Ax = b
 * 
 * @param x - Current solution vector
 * @param A - Constraint matrix (m×n)
 * @param b - Right-hand side vector (m×1)
 * @returns Projected solution vector
 * 
 * @example
 * ```typescript
 * const x = [0.5, 0.3, 0.2];
 * const A = [[1, 1, 1]];
 * const b = [1];
 * const projected = projectOntoEqualityConstraints(x, A, b);
 * ```
 */
export function projectOntoEqualityConstraints(
  x: number[],
  A: number[][],
  b: number[]
): number[] {
  const m = A.length;
  
  if (m === 0) {
    return x;
  }
  
  // Handle simple case: sum constraint
  if (m === 1 && A[0].every(val => Math.abs(val - 1) < 1e-12)) {
    // Constraint: sum(x) = b[0]
    const currentSum = x.reduce((sum, val) => sum + val, 0);
    const targetSum = b[0];
    
    if (Math.abs(currentSum) > 1e-12) {
      const scale = targetSum / currentSum;
      return x.map(val => val * scale);
    }
  }
  
  // For other constraints, use iterative projection
  let result = [...x];
  const maxIter = 10;
  
  for (let iter = 0; iter < maxIter; iter++) {
    let maxViolation = 0;
    
    for (let i = 0; i < m; i++) {
      const constraintValue = vectorDot(A[i], result);
      const violation = constraintValue - b[i];
      
      if (Math.abs(violation) > Math.abs(maxViolation)) {
        maxViolation = violation;
      }
      
      // Simple projection: adjust all variables proportionally
      const constraintNorm = vectorDot(A[i], A[i]);
      if (constraintNorm > 1e-12) {
        const adjustment = violation / constraintNorm;
        result = vectorSubtract(result, vectorScale(A[i], adjustment));
      }
    }
    
    if (Math.abs(maxViolation) < 1e-8) {
      break;
    }
  }
  
  return result;
}

/**
 * Project a solution vector onto non-negativity constraints x ≥ 0
 * 
 * @param x - Current solution vector
 * @returns Projected solution vector with non-negative elements
 * 
 * @example
 * ```typescript
 * const x = [-0.1, 0.5, -0.2];
 * const projected = projectOntoNonNegativityConstraints(x); // [0, 0.5, 0]
 * ```
 */
export function projectOntoNonNegativityConstraints(x: number[]): number[] {
  return x.map(val => Math.max(0, val));
}

/**
 * Project a solution vector onto box constraints l ≤ x ≤ u
 * 
 * @param x - Current solution vector
 * @param lowerBounds - Lower bounds (n×1)
 * @param upperBounds - Upper bounds (n×1)
 * @returns Projected solution vector within bounds
 * 
 * @example
 * ```typescript
 * const x = [0.1, 0.8, 0.05];
 * const lower = [0.1, 0.1, 0.1];
 * const upper = [0.5, 0.5, 0.5];
 * const projected = projectOntoBoxConstraints(x, lower, upper);
 * ```
 */
export function projectOntoBoxConstraints(
  x: number[],
  lowerBounds: number[],
  upperBounds: number[]
): number[] {
  if (x.length !== lowerBounds.length || x.length !== upperBounds.length) {
    throw new Error('All vectors must have the same length');
  }
  
  return x.map((val, i) => {
    return Math.max(lowerBounds[i], Math.min(upperBounds[i], val));
  });
}

/**
 * Project a solution vector onto the unit simplex (x ≥ 0, sum(x) = 1)
 * 
 * @param x - Current solution vector
 * @returns Projected solution vector on unit simplex
 * 
 * @example
 * ```typescript
 * const x = [0.5, 0.3, 0.4];
 * const projected = projectOntoSimplex(x); // [0.416, 0.25, 0.333]
 * ```
 */
export function projectOntoSimplex(x: number[]): number[] {
  // First project onto non-negativity constraints
  let result = projectOntoNonNegativityConstraints(x);
  
  // Then project onto sum constraint
  const currentSum = result.reduce((sum, val) => sum + val, 0);
  
  if (Math.abs(currentSum) > 1e-12) {
    const scale = 1 / currentSum;
    result = result.map(val => val * scale);
  }
  
  return result;
}

/**
 * Project a gradient onto the null space of equality constraints
 * 
 * @param gradient - Gradient vector
 * @param A - Constraint matrix (m×n)
 * @returns Projected gradient
 * 
 * @example
 * ```typescript
 * const gradient = [1, 2, 3];
 * const A = [[1, 1, 1]];
 * const projected = projectGradientOntoEqualityConstraints(gradient, A);
 * ```
 */
export function projectGradientOntoEqualityConstraints(
  gradient: number[],
  A: number[][]
): number[] {
  if (A.length === 0) {
    return gradient;
  }
  
  // Project gradient onto null space of A
  // P = I - Aᵀ(AAᵀ)⁻¹A
  const At = matrixTranspose(A);
  const AAt = matrixMatrixMultiply(A, At);
  
  try {
    // Solve AAt * y = A * gradient
    const Ag = matrixVectorMultiply(A, gradient);
    const y = solveLinearSystem(AAt, Ag);
    
    // Calculate projection: gradient - Aᵀ * y
    const At_y = matrixVectorMultiply(At, y);
    
    return vectorSubtract(gradient, At_y);
  } catch {
    // If solving fails, return original gradient
    return gradient;
  }
}

/**
 * Project a gradient onto non-negativity constraints
 * 
 * @param gradient - Gradient vector
 * @param x - Current solution vector
 * @returns Projected gradient respecting non-negativity constraints
 * 
 * @example
 * ```typescript
 * const gradient = [1, -2, 3];
 * const x = [0.1, 0, 0.5];
 * const projected = projectGradientOntoNonNegativityConstraints(gradient, x);
 * ```
 */
export function projectGradientOntoNonNegativityConstraints(
  gradient: number[],
  x: number[]
): number[] {
  if (gradient.length !== x.length) {
    throw new Error('Gradient and solution vectors must have the same length');
  }
  
  return gradient.map((g, i) => {
    // If x[i] is at boundary (x[i] = 0) and gradient points inward, set to 0
    if (x[i] <= 1e-12 && g < 0) {
      return 0;
    }
    return g;
  });
}

/**
 * Calculate constraint violation for equality constraints
 * 
 * @param x - Solution vector
 * @param A - Constraint matrix (m×n)
 * @param b - Right-hand side vector (m×1)
 * @returns Maximum constraint violation
 * 
 * @example
 * ```typescript
 * const x = [0.5, 0.3, 0.4];
 * const A = [[1, 1, 1]];
 * const b = [1];
 * const violation = calculateEqualityConstraintViolation(x, A, b);
 * ```
 */
export function calculateEqualityConstraintViolation(
  x: number[],
  A: number[][],
  b: number[]
): number {
  if (A.length === 0) {
    return 0;
  }
  
  let maxViolation = 0;
  
  for (let i = 0; i < A.length; i++) {
    const constraintValue = vectorDot(A[i], x);
    const violation = Math.abs(constraintValue - b[i]);
    maxViolation = Math.max(maxViolation, violation);
  }
  
  return maxViolation;
}

/**
 * Calculate constraint violation for inequality constraints
 * 
 * @param x - Solution vector
 * @param G - Inequality constraint matrix (m×n)
 * @param h - Right-hand side vector (m×1)
 * @returns Maximum constraint violation (positive if violated)
 * 
 * @example
 * ```typescript
 * const x = [0.5, 0.3];
 * const G = [[1, 0], [0, 1]]; // x ≥ 0
 * const h = [0, 0];
 * const violation = calculateInequalityConstraintViolation(x, G, h);
 * ```
 */
export function calculateInequalityConstraintViolation(
  x: number[],
  G: number[][],
  h: number[]
): number {
  if (G.length === 0) {
    return 0;
  }
  
  let maxViolation = 0;
  
  for (let i = 0; i < G.length; i++) {
    const constraintValue = vectorDot(G[i], x);
    // For inequality constraints Gx ≤ h, violation = max(0, constraintValue - h[i])
    // But for x ≥ 0, we want -x ≤ 0, so G = [-1, 0, 0], h = [0]
    const violation = Math.max(0, constraintValue - h[i]);
    maxViolation = Math.max(maxViolation, violation);
  }
  
  return maxViolation;
}

/**
 * Check if a solution is feasible with respect to constraints
 * 
 * @param x - Solution vector
 * @param equalityConstraints - Equality constraints {A, b}
 * @param inequalityConstraints - Inequality constraints {G, h}
 * @param tolerance - Feasibility tolerance (default: 1e-6)
 * @returns True if solution is feasible
 * 
 * @example
 * ```typescript
 * const x = [0.3, 0.3, 0.4];
 * const eq = { A: [[1, 1, 1]], b: [1] };
 * const ineq = { G: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], h: [0, 0, 0] };
 * const feasible = isSolutionFeasible(x, eq, ineq);
 * ```
 */
export function isSolutionFeasible(
  x: number[],
  equalityConstraints?: { A: number[][], b: number[] },
  inequalityConstraints?: { G: number[][], h: number[] },
  tolerance: number = 1e-6
): boolean {
  // Check equality constraints
  if (equalityConstraints) {
    const eqViolation = calculateEqualityConstraintViolation(
      x, 
      equalityConstraints.A, 
      equalityConstraints.b
    );
    if (eqViolation > tolerance) {
      return false;
    }
  }
  
  // Check inequality constraints
  if (inequalityConstraints) {
    const ineqViolation = calculateInequalityConstraintViolation(
      x, 
      inequalityConstraints.G, 
      inequalityConstraints.h
    );
    if (ineqViolation > tolerance) {
      return false;
    }
  }
  
  return true;
}
