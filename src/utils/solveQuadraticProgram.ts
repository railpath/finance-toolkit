/**
 * Solve Quadratic Programming Problem (Simplified Implementation)
 * 
 * Minimizes: ½xᵀQx + cᵀx
 * Subject to: Ax = b (equality constraints)
 *             x ≥ 0   (non-negativity constraints)
 * 
 * Uses a simplified gradient descent with constraint projection.
 * This is a practical implementation suitable for portfolio optimization.
 * 
 * @param Q - Quadratic coefficient matrix (n×n, symmetric, positive semi-definite)
 * @param c - Linear coefficient vector (n×1)
 * @param options - Solver options and constraints
 * @returns Optimization result with solution vector and metadata
 * 
 * @example
 * ```typescript
 * // Portfolio optimization: min wᵀΣw subject to wᵀ1=1, w≥0
 * const result = solveQuadraticProgram(
 *   covarianceMatrix,  // Q = Σ
 *   [0, 0, 0],        // c = 0 (minimum variance)
 *   {
 *     equalityConstraints: { A: [[1,1,1]], b: [1] },  // wᵀ1 = 1
 *     nonNegative: true,                              // w ≥ 0
 *     maxIterations: 1000,
 *     tolerance: 1e-6
 *   }
 * );
 * ```
 */

import { QuadraticProgramOptions, QuadraticProgramOptionsSchema, QuadraticProgramOptionsValidated } from '../schemas/QuadraticProgramOptionsSchema';
import { QuadraticProgramResult, QuadraticProgramResultSchema } from '../schemas/QuadraticProgramResultSchema';
import { calculateEqualityConstraintViolation, projectOntoEqualityConstraints, projectOntoNonNegativityConstraints } from './constraintProjection';
import { vectorAdd, vectorDot, vectorNorm, vectorScale, vectorSubtract } from './vectorOperations';

import { matrixVectorMultiply } from './matrixOperations';

export function solveQuadraticProgram(
  Q: number[][],
  c: number[],
  options: Partial<QuadraticProgramOptions> = {}
): QuadraticProgramResult {
  // Parse und validiere mit Zod (füllt Defaults!)
  const validated: QuadraticProgramOptionsValidated = QuadraticProgramOptionsSchema.parse(options);
  const {
    equalityConstraints,
    nonNegative,
    maxIterations,
    tolerance,
    initialGuess
  } = validated;

  const n = Q.length;
  
  // Validate inputs
  if (Q.length !== n || Q[0].length !== n) {
    throw new Error('Quadratic matrix Q must be square');
  }
  
  if (c.length !== n) {
    throw new Error('Linear coefficient vector c must match Q dimensions');
  }

  // Initialize solution
  let x = initialGuess ? [...initialGuess] : initializeSolution(n, equalityConstraints);
  
  // Validate initial guess
  if (x.length !== n) {
    throw new Error('Initial guess must match problem dimensions');
  }

  let converged = false;
  let iterations = 0;
  let gradientNorm = Infinity;
  let constraintViolation = 0;

  // Simple gradient descent with constraint projection
  for (iterations = 0; iterations < maxIterations; iterations++) {
    // Calculate gradient: ∇f = Qx + c
    const gradient = calculateGradient(Q, c, x);
    
    // Use adaptive step size
    const stepSize = 0.1 / (1 + iterations * 0.01);
    
    // Gradient descent step
    x = vectorSubtract(x, vectorScale(gradient, stepSize));
    
    // Project onto constraints
    x = projectOntoConstraints(x, equalityConstraints, nonNegative);
    
    // Calculate metrics
    gradientNorm = vectorNorm(gradient);
    constraintViolation = calculateEqualityConstraintViolation(x, equalityConstraints?.A || [], equalityConstraints?.b || []);
    
    // Check convergence
    if (gradientNorm < tolerance && constraintViolation < tolerance) {
      converged = true;
      break;
    }
  }

  // Calculate final objective value
  const objectiveValue = calculateObjective(Q, c, x);

  return QuadraticProgramResultSchema.parse({
    solution: x,
    objectiveValue,
    converged,
    iterations,
    gradientNorm,
    constraintViolation: constraintViolation || 0
  });
}

/**
 * Initialize solution vector
 */
function initializeSolution(
  n: number, 
  equalityConstraints?: QuadraticProgramOptions['equalityConstraints']
): number[] {
  if (equalityConstraints && equalityConstraints.A.length > 0) {
    // For equality constraints, find feasible solution
    return findFeasibleSolution(equalityConstraints.A, equalityConstraints.b, n);
  }
  
  // Default: equal weights
  return new Array(n).fill(1 / n);
}

/**
 * Find feasible solution for equality constraints
 */
function findFeasibleSolution(A: number[][], b: number[], n: number): number[] {
  const m = A.length;
  
  if (m === 0) {
    return new Array(n).fill(1 / n);
  }
  
  // For simple cases, use analytical solution
  if (m === 1 && A[0].every(val => Math.abs(val - A[0][0]) < 1e-12)) {
    // All coefficients are the same (e.g., [1,1,1])
    const coefficient = A[0][0];
    const target = b[0];
    const value = target / (coefficient * n);
    return new Array(n).fill(value);
  }
  
  // For other cases, use equal weights as fallback
  return new Array(n).fill(1 / n);
}

/**
 * Calculate gradient: ∇f = Qx + c
 */
function calculateGradient(Q: number[][], c: number[], x: number[]): number[] {
  const Qx = matrixVectorMultiply(Q, x);
  return vectorAdd(Qx, c);
}

/**
 * Project solution onto constraints
 */
function projectOntoConstraints(
  x: number[],
  equalityConstraints?: QuadraticProgramOptions['equalityConstraints'],
  nonNegative?: boolean
): number[] {
  let result = [...x];
  
  // Project onto equality constraints
  if (equalityConstraints && equalityConstraints.A.length > 0) {
    result = projectOntoEqualityConstraints(result, equalityConstraints.A, equalityConstraints.b);
  }
  
  // Project onto non-negative constraints
  if (nonNegative) {
    result = projectOntoNonNegativityConstraints(result);
  }
  
  return result;
}

/**
 * Calculate objective value: f(x) = ½xᵀQx + cᵀx
 */
function calculateObjective(Q: number[][], c: number[], x: number[]): number {
  const quadraticTerm = 0.5 * vectorDot(matrixVectorMultiply(Q, x), x);
  const linearTerm = vectorDot(c, x);
  return quadraticTerm + linearTerm;
}

// Utility functions are now imported from separate modules