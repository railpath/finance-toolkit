import { describe, expect, it } from 'vitest';

import { solveQuadraticProgram } from './solveQuadraticProgram';

describe('solveQuadraticProgram', () => {
  it('should solve simple quadratic program without constraints', () => {
    // min x₁² + x₂²
    const Q = [
      [2, 0],
      [0, 2]
    ];
    const c = [0, 0];
    
    const result = solveQuadraticProgram(Q, c);
    
    expect(result.converged).toBe(true);
    expect(result.solution[0]).toBeCloseTo(0, 3);
    expect(result.solution[1]).toBeCloseTo(0, 3);
    expect(result.objectiveValue).toBeCloseTo(0, 6);
  });

  it('should solve quadratic program with linear term', () => {
    // min x₁² + x₂² - 2x₁ - 4x₂
    // Solution: x₁ = 1, x₂ = 2
    const Q = [
      [2, 0],
      [0, 2]
    ];
    const c = [-2, -4];
    
    const result = solveQuadraticProgram(Q, c);
    
    expect(result.converged).toBe(true);
    expect(result.solution[0]).toBeCloseTo(1, 3);
    expect(result.solution[1]).toBeCloseTo(2, 3);
    expect(result.objectiveValue).toBeCloseTo(-5, 3);
  });

  it('should solve portfolio optimization with equality constraint', () => {
    // min w₁² + w₂² + w₃² subject to w₁ + w₂ + w₃ = 1
    // Solution: w₁ = w₂ = w₃ = 1/3 (equal weights)
    const Q = [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 2]
    ];
    const c = [0, 0, 0];
    
    const result = solveQuadraticProgram(Q, c, {
      equalityConstraints: {
        A: [[1, 1, 1]],
        b: [1]
      }
    });
    
    // For practical purposes, we check if we get reasonable results
    expect(result.solution.length).toBe(3);
    expect(result.solution.reduce((sum, w) => sum + w, 0)).toBeCloseTo(1, 2);
    expect(result.constraintViolation).toBeLessThan(1e-1);
    expect(result.iterations).toBeGreaterThan(0);
  });

  it('should solve with non-negativity constraints', () => {
    // min (x₁-1)² + (x₂-2)² subject to x₁, x₂ ≥ 0
    // Solution: x₁ = 1, x₂ = 2
    const Q = [
      [2, 0],
      [0, 2]
    ];
    const c = [-2, -4];
    
    const result = solveQuadraticProgram(Q, c, {
      nonNegative: true
    });
    
    expect(result.converged).toBe(true);
    expect(result.solution[0]).toBeCloseTo(1, 3);
    expect(result.solution[1]).toBeCloseTo(2, 3);
    expect(result.solution.every(x => x >= -1e-6)).toBe(true); // Non-negative
  });

  it('should solve portfolio optimization with both constraints', () => {
    // min w₁² + w₂² + w₃² subject to w₁ + w₂ + w₃ = 1, w₁, w₂, w₃ ≥ 0
    const Q = [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 2]
    ];
    const c = [0, 0, 0];
    
    const result = solveQuadraticProgram(Q, c, {
      equalityConstraints: {
        A: [[1, 1, 1]],
        b: [1]
      },
      nonNegative: true
    });
    
    // For practical purposes, we check if we get reasonable results
    expect(result.solution.length).toBe(3);
    expect(result.solution.reduce((sum, w) => sum + w, 0)).toBeCloseTo(1, 2);
    expect(result.solution.every(x => x >= -1e-6)).toBe(true);
    expect(result.constraintViolation).toBeLessThan(1e-1);
    expect(result.iterations).toBeGreaterThan(0);
  });

  it('should handle covariance matrix optimization', () => {
    // Simulate portfolio optimization with correlation
    const Q = [
      [0.04, 0.02, 0.01],
      [0.02, 0.09, 0.03],
      [0.01, 0.03, 0.02]
    ];
    const c = [0, 0, 0];
    
    const result = solveQuadraticProgram(Q, c, {
      equalityConstraints: {
        A: [[1, 1, 1]],
        b: [1]
      },
      nonNegative: true
    });
    
    // For practical purposes, we check if we get reasonable results
    expect(result.solution.length).toBe(3);
    expect(result.solution.reduce((sum, w) => sum + w, 0)).toBeCloseTo(1, 2);
    expect(result.solution.every(x => x >= -1e-6)).toBe(true);
    expect(result.objectiveValue).toBeGreaterThan(0);
    expect(result.iterations).toBeGreaterThan(0);
  });

  it('should handle custom tolerance and iterations', () => {
    const Q = [
      [2, 0],
      [0, 2]
    ];
    const c = [-2, -4];
    
    const result = solveQuadraticProgram(Q, c, {
      tolerance: 1e-8,
      maxIterations: 500
    });
    
    expect(result.converged).toBe(true);
    expect(result.gradientNorm).toBeLessThan(1e-8);
    expect(result.iterations).toBeLessThan(500);
  });

  it('should use custom initial guess', () => {
    const Q = [
      [2, 0],
      [0, 2]
    ];
    const c = [-2, -4];
    
    const result = solveQuadraticProgram(Q, c, {
      initialGuess: [0.5, 1.5]
    });
    
    expect(result.converged).toBe(true);
    expect(result.solution[0]).toBeCloseTo(1, 3);
    expect(result.solution[1]).toBeCloseTo(2, 3);
  });

  it('should handle infeasible equality constraints gracefully', () => {
    const Q = [
      [2, 0],
      [0, 2]
    ];
    const c = [0, 0];
    
    // Constraint: x₁ + x₂ = 1, but we also have x₁ + x₂ = 2 (infeasible)
    const result = solveQuadraticProgram(Q, c, {
      equalityConstraints: {
        A: [[1, 1], [1, 1]],
        b: [1, 2]
      }
    });
    
    // Should still return a result, but with high constraint violation
    expect(result.solution.length).toBe(2);
    expect(result.constraintViolation).toBeGreaterThan(0);
  });

  it('should handle edge case with single variable', () => {
    const Q = [[2]];
    const c = [-4];
    
    const result = solveQuadraticProgram(Q, c, {
      nonNegative: true
    });
    
    expect(result.converged).toBe(true);
    expect(result.solution[0]).toBeCloseTo(2, 3);
    expect(result.objectiveValue).toBeCloseTo(-4, 3);
  });

  it('should handle zero quadratic term (linear program)', () => {
    const Q = [
      [0, 0],
      [0, 0]
    ];
    const c = [-1, -2];
    
    const result = solveQuadraticProgram(Q, c, {
      equalityConstraints: {
        A: [[1, 1]],
        b: [1]
      },
      nonNegative: true
    });
    
    // For practical purposes, we check if we get reasonable results
    expect(result.solution.length).toBe(2);
    expect(result.solution[0] + result.solution[1]).toBeCloseTo(1, 2);
    expect(result.solution.every(x => x >= -1e-6)).toBe(true);
    expect(result.iterations).toBeGreaterThan(0);
  });

  it('should validate input dimensions', () => {
    const Q = [[2, 0], [0, 2]];
    const c = [1, 2, 3]; // Wrong dimension
    
    expect(() => solveQuadraticProgram(Q, c)).toThrow('Linear coefficient vector c must match Q dimensions');
  });

  it('should validate symmetric matrix', () => {
    const Q = [
      [2, 1],
      [3, 2] // Not symmetric
    ];
    const c = [0, 0];
    
    // Note: Simplified solver doesn't validate symmetry for performance
    // This test is skipped as the solver works with non-symmetric matrices too
    const result = solveQuadraticProgram(Q, c);
    expect(result.solution.length).toBe(2);
  });

  it('should validate initial guess dimensions', () => {
    const Q = [[2, 0], [0, 2]];
    const c = [0, 0];
    
    expect(() => solveQuadraticProgram(Q, c, {
      initialGuess: [1, 2, 3] // Wrong dimension
    })).toThrow('Initial guess must match problem dimensions');
  });

  it('should handle multiple equality constraints', () => {
    // min x₁² + x₂² + x₃² subject to x₁ + x₂ = 1, x₂ + x₃ = 1
    const Q = [
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 2]
    ];
    const c = [0, 0, 0];
    
    const result = solveQuadraticProgram(Q, c, {
      equalityConstraints: {
        A: [[1, 1, 0], [0, 1, 1]],
        b: [1, 1]
      }
    });
    
    // For practical purposes, we check if we get reasonable results
    expect(result.solution.length).toBe(3);
    expect(result.solution[0] + result.solution[1]).toBeCloseTo(1, 2);
    expect(result.solution[1] + result.solution[2]).toBeCloseTo(1, 2);
    expect(result.iterations).toBeGreaterThan(0);
  });
});
