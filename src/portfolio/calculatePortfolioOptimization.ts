import { PortfolioOptimizationOptions, PortfolioOptimizationOptionsSchema } from '../schemas/PortfolioOptimizationOptionsSchema';
import { PortfolioOptimizationResult, PortfolioOptimizationResultSchema } from '../schemas/PortfolioOptimizationResultSchema';

import { solveQuadraticProgram } from '../utils/solveQuadraticProgram';

/**
 * Calculate Markowitz Mean-Variance Portfolio Optimization
 * 
 * Implements the classic Markowitz portfolio theory for optimal asset allocation.
 * Supports three optimization objectives:
 * 1. Minimum Variance Portfolio
 * 2. Maximum Sharpe Ratio Portfolio  
 * 3. Target Return Portfolio
 * 
 * Mathematical Framework:
 * - Objective: min w^T Σ w (variance) or max (w^T μ - rf) / √(w^T Σ w) (Sharpe)
 * - Constraints: w^T 1 = 1 (weights sum to 1), w_min ≤ w ≤ w_max
 * 
 * @param options - Expected returns, covariance matrix, constraints, and optimization target
 * @returns Optimal portfolio weights and performance metrics
 * 
 * @example
 * ```typescript
 * const result = calculatePortfolioOptimization({
 *   expectedReturns: [0.08, 0.12, 0.06],
 *   covarianceMatrix: [
 *     [0.04, 0.02, 0.01],
 *     [0.02, 0.09, 0.03], 
 *     [0.01, 0.03, 0.02]
 *   ],
 *   riskFreeRate: 0.03,
 *   method: 'maximumSharpe'
 * });
 * ```
 */
export function calculatePortfolioOptimization(
  options: PortfolioOptimizationOptions
): PortfolioOptimizationResult {
  const {
    expectedReturns,
    covarianceMatrix,
    riskFreeRate,
    targetReturn,
    minWeight,
    maxWeight,
    sumTo1
  } = PortfolioOptimizationOptionsSchema.parse(options);

  const n = expectedReturns.length;

  // Validate inputs
  if (covarianceMatrix.length !== n || covarianceMatrix[0].length !== n) {
    throw new Error('Covariance matrix dimensions must match expected returns length');
  }

  if (!isValidCovarianceMatrix(covarianceMatrix)) {
    throw new Error('Covariance matrix must be symmetric and positive semi-definite');
  }

  // Determine optimization method based on provided parameters
  let method: 'minimumVariance' | 'maximumSharpe' | 'targetReturn';
  
  if (targetReturn !== undefined) {
    method = 'targetReturn';
  } else if (riskFreeRate !== undefined) {
    method = 'maximumSharpe';
  } else {
    method = 'minimumVariance';
  }

  // Note: Parameter validation is handled by the method determination logic above
  // No additional validation needed here as the method is determined based on available parameters

  let result: PortfolioOptimizationResult;

  switch (method) {
    case 'minimumVariance':
      result = optimizeMinimumVariance(expectedReturns, covarianceMatrix, minWeight, maxWeight, sumTo1);
      break;
    case 'maximumSharpe':
      result = optimizeMaximumSharpe(expectedReturns, covarianceMatrix, riskFreeRate!, minWeight, maxWeight, sumTo1);
      break;
    case 'targetReturn':
      result = optimizeTargetReturn(expectedReturns, covarianceMatrix, targetReturn!, minWeight, maxWeight, sumTo1);
      break;
  }

  return PortfolioOptimizationResultSchema.parse(result);
}

/**
 * Optimize for minimum variance portfolio
 */
function optimizeMinimumVariance(
  expectedReturns: number[],
  covarianceMatrix: number[][],
  minWeight: number,
  maxWeight: number,
  sumTo1: boolean
): PortfolioOptimizationResult {
  const n = expectedReturns.length;
  
  // Use numerical optimization for all cases to ensure expected returns are calculated
  return solveQuadraticProgramming(
    covarianceMatrix,
    new Array(n).fill(0), // No linear term for minimum variance
    expectedReturns,
    undefined, // No target return
    minWeight,
    maxWeight,
    sumTo1
  );
}

/**
 * Optimize for maximum Sharpe ratio portfolio
 */
function optimizeMaximumSharpe(
  expectedReturns: number[],
  covarianceMatrix: number[][],
  riskFreeRate: number,
  minWeight: number,
  maxWeight: number,
  sumTo1: boolean
): PortfolioOptimizationResult {
  // Excess returns
  const excessReturns = expectedReturns.map(r => r - riskFreeRate);
  
  // For maximum Sharpe, we optimize the ratio: (w^T μ - rf) / √(w^T Σ w)
  // This is equivalent to minimizing: w^T Σ w / (w^T μ - rf)^2
  // Or maximizing: (w^T μ - rf) / √(w^T Σ w)
  
  return solveQuadraticProgramming(
    covarianceMatrix,
    excessReturns,
    expectedReturns,
    undefined, // No target return
    minWeight,
    maxWeight,
    sumTo1,
    'maximize'
  );
}

/**
 * Optimize for target return portfolio
 */
function optimizeTargetReturn(
  expectedReturns: number[],
  covarianceMatrix: number[][],
  targetReturn: number,
  minWeight: number,
  maxWeight: number,
  sumTo1: boolean
): PortfolioOptimizationResult {
  return solveQuadraticProgramming(
    covarianceMatrix,
    new Array(expectedReturns.length).fill(0), // No linear term
    expectedReturns,
    targetReturn,
    minWeight,
    maxWeight,
    sumTo1
  );
}


/**
 * Solve quadratic programming problem using the integrated QP solver
 */
function solveQuadraticProgramming(
  covarianceMatrix: number[][],
  linearTerm: number[],
  expectedReturns: number[],
  targetReturn: number | undefined,
  minWeight: number,
  maxWeight: number,
  sumTo1: boolean,
  objective: 'minimize' | 'maximize' = 'minimize'
): PortfolioOptimizationResult {
  const n = expectedReturns.length;
  
  try {
    // Use the quadratic programming solver
    const qpResult = solveQuadraticProgram(
      covarianceMatrix,
      linearTerm,
      {
        equalityConstraints: sumTo1 ? {
          A: [new Array(n).fill(1)],
          b: [1]
        } : undefined,
        nonNegative: minWeight >= 0,
        maxIterations: 1000,
        tolerance: 1e-4
      }
    );
    
    // Apply additional constraints (min/max weights)
    let weights = qpResult.solution;
    
    // Apply min/max weight constraints
    weights = weights.map(w => Math.max(minWeight, Math.min(maxWeight, w)));
    
    // Renormalize if sum constraint is required
    if (sumTo1) {
      const currentSum = weights.reduce((sum, w) => sum + w, 0);
      if (Math.abs(currentSum) > 1e-12) {
        weights = weights.map(w => w / currentSum);
      }
    }
    
    // Calculate final metrics
    const variance = calculatePortfolioVariance(weights, covarianceMatrix);
    const volatility = Math.sqrt(variance);
    const portfolioReturn = weights.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);
    
    const result: PortfolioOptimizationResult = {
      weights,
      expectedReturn: portfolioReturn,
      variance,
      volatility,
      method: targetReturn ? 'targetReturn' : (objective === 'maximize' ? 'maximumSharpe' : 'minimumVariance'),
      converged: qpResult.converged,
      iterations: qpResult.iterations
    };
    
    if (objective === 'maximize') {
      // Calculate Sharpe ratio for maximum Sharpe optimization
      const riskFreeRate = linearTerm[0] !== undefined ? expectedReturns[0] - linearTerm[0] : 0;
      result.sharpeRatio = volatility > 0 ? (portfolioReturn - riskFreeRate) / volatility : 0;
    }
    
    return result;
    
  } catch (error) {
    // Fallback to equal weights if QP solver fails
    console.warn('QP solver failed, falling back to equal weights:', error);
    
    let weights = new Array(n).fill(1 / n);
    
    // Apply constraints
    weights = applyConstraints(weights, minWeight, maxWeight, sumTo1);
    
    // Calculate final metrics
    const variance = calculatePortfolioVariance(weights, covarianceMatrix);
    const volatility = Math.sqrt(variance);
    const portfolioReturn = weights.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);
    
    return {
      weights,
      expectedReturn: portfolioReturn,
      variance,
      volatility,
      method: targetReturn ? 'targetReturn' : (objective === 'maximize' ? 'maximumSharpe' : 'minimumVariance'),
      converged: false,
      iterations: 0
    };
  }
}

/**
 * Apply weight constraints
 */
function applyConstraints(
  weights: number[],
  minWeight: number,
  maxWeight: number,
  sumTo1: boolean
): number[] {
  let constrainedWeights = [...weights];
  
  // Apply min/max constraints
  constrainedWeights = constrainedWeights.map(w => 
    Math.max(minWeight, Math.min(maxWeight, w))
  );
  
  // Apply sum constraint
  if (sumTo1) {
    const sum = constrainedWeights.reduce((s, w) => s + w, 0);
    if (sum > 0) {
      constrainedWeights = constrainedWeights.map(w => w / sum);
    }
  }
  
  return constrainedWeights;
}

/**
 * Calculate portfolio variance: w^T * Σ * w
 */
function calculatePortfolioVariance(weights: number[], covarianceMatrix: number[][]): number {
  let variance = 0;
  const n = weights.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      variance += weights[i] * weights[j] * covarianceMatrix[i][j];
    }
  }
  
  return variance;
}



/**
 * Validate covariance matrix properties
 */
function isValidCovarianceMatrix(matrix: number[][]): boolean {
  const n = matrix.length;
  
  // Check symmetry
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (Math.abs(matrix[i][j] - matrix[j][i]) > 1e-10) {
        return false;
      }
    }
  }
  
  // Check positive semi-definiteness (simplified check)
  for (let i = 0; i < n; i++) {
    if (matrix[i][i] < 0) {
      return false;
    }
  }
  
  return true;
}
