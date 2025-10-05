import {
  calculateEqualityConstraintViolation,
  calculateInequalityConstraintViolation,
  isSolutionFeasible,
  projectGradientOntoEqualityConstraints,
  projectGradientOntoNonNegativityConstraints,
  projectOntoBoxConstraints,
  projectOntoEqualityConstraints,
  projectOntoNonNegativityConstraints,
  projectOntoSimplex
} from './constraintProjection';

describe('Constraint Projection', () => {
  describe('projectOntoEqualityConstraints', () => {
    it('should project onto sum constraint', () => {
      const x = [0.5, 0.3, 0.4];
      const A = [[1, 1, 1]];
      const b = [1];
      const projected = projectOntoEqualityConstraints(x, A, b);
      
      expect(projected.reduce((sum, val) => sum + val, 0)).toBeCloseTo(1, 10);
    });

    it('should handle multiple equality constraints', () => {
      const x = [0.5, 0.3, 0.4];
      const A = [[1, 1, 0], [0, 1, 1]];
      const b = [1, 1];
      const projected = projectOntoEqualityConstraints(x, A, b);
      
      // Check first constraint: x[0] + x[1] = 1
      expect(projected[0] + projected[1]).toBeCloseTo(1, 6);
      // Check second constraint: x[1] + x[2] = 1
      expect(projected[1] + projected[2]).toBeCloseTo(1, 6);
    });

    it('should handle empty constraints', () => {
      const x = [0.5, 0.3, 0.4];
      const A: number[][] = [];
      const b: number[] = [];
      const projected = projectOntoEqualityConstraints(x, A, b);
      
      expect(projected).toEqual(x);
    });

    it('should handle zero sum constraint', () => {
      const x = [0.5, 0.3, 0.4];
      const A = [[1, 1, 1]];
      const b = [0];
      const projected = projectOntoEqualityConstraints(x, A, b);
      
      expect(projected.reduce((sum, val) => sum + val, 0)).toBeCloseTo(0, 10);
    });
  });

  describe('projectOntoNonNegativityConstraints', () => {
    it('should project negative values to zero', () => {
      const x = [-0.1, 0.5, -0.2];
      const projected = projectOntoNonNegativityConstraints(x);
      
      expect(projected).toEqual([0, 0.5, 0]);
    });

    it('should leave positive values unchanged', () => {
      const x = [0.1, 0.5, 0.2];
      const projected = projectOntoNonNegativityConstraints(x);
      
      expect(projected).toEqual(x);
    });

    it('should handle zero values', () => {
      const x = [0, 0.5, 0];
      const projected = projectOntoNonNegativityConstraints(x);
      
      expect(projected).toEqual(x);
    });
  });

  describe('projectOntoBoxConstraints', () => {
    it('should project values within bounds', () => {
      const x = [0.1, 0.8, 0.05];
      const lower = [0.1, 0.1, 0.1];
      const upper = [0.5, 0.5, 0.5];
      const projected = projectOntoBoxConstraints(x, lower, upper);
      
      expect(projected).toEqual([0.1, 0.5, 0.1]);
    });

    it('should handle values already within bounds', () => {
      const x = [0.2, 0.3, 0.4];
      const lower = [0.1, 0.1, 0.1];
      const upper = [0.5, 0.5, 0.5];
      const projected = projectOntoBoxConstraints(x, lower, upper);
      
      expect(projected).toEqual(x);
    });

    it('should throw error for mismatched lengths', () => {
      const x = [0.1, 0.8];
      const lower = [0.1, 0.1, 0.1];
      const upper = [0.5, 0.5];
      
      expect(() => projectOntoBoxConstraints(x, lower, upper))
        .toThrow('All vectors must have the same length');
    });
  });

  describe('projectOntoSimplex', () => {
    it('should project onto unit simplex', () => {
      const x = [0.5, 0.3, 0.4];
      const projected = projectOntoSimplex(x);
      
      // Check non-negativity
      expect(projected.every(val => val >= 0)).toBe(true);
      
      // Check sum constraint
      expect(projected.reduce((sum, val) => sum + val, 0)).toBeCloseTo(1, 10);
    });

    it('should handle negative values', () => {
      const x = [-0.1, 0.5, 0.8];
      const projected = projectOntoSimplex(x);
      
      expect(projected.every(val => val >= 0)).toBe(true);
      expect(projected.reduce((sum, val) => sum + val, 0)).toBeCloseTo(1, 10);
    });

    it('should handle values that already sum to 1', () => {
      const x = [0.3, 0.3, 0.4];
      const projected = projectOntoSimplex(x);
      
      expect(projected).toEqual([0.3, 0.3, 0.4]);
    });
  });

  describe('projectGradientOntoEqualityConstraints', () => {
    it('should project gradient onto null space', () => {
      const gradient = [1, 2, 3];
      const A = [[1, 1, 1]];
      const projected = projectGradientOntoEqualityConstraints(gradient, A);
      
      // Projected gradient should be orthogonal to constraint normal
      const dotProduct = projected.reduce((sum, val) => sum + val, 0);
      expect(dotProduct).toBeCloseTo(0, 10);
    });

    it('should handle empty constraints', () => {
      const gradient = [1, 2, 3];
      const A: number[][] = [];
      const projected = projectGradientOntoEqualityConstraints(gradient, A);
      
      expect(projected).toEqual(gradient);
    });

    it('should handle singular constraint matrix gracefully', () => {
      const gradient = [1, 2, 3];
      const A = [[1, 1, 1], [1, 1, 1]]; // Singular
      const projected = projectGradientOntoEqualityConstraints(gradient, A);
      
      // Should return original gradient when solving fails
      expect(projected).toEqual(gradient);
    });
  });

  describe('projectGradientOntoNonNegativityConstraints', () => {
    it('should zero out negative gradients at boundary', () => {
      const gradient = [1, -2, 3];
      const x = [0.1, 0, 0.5];
      const projected = projectGradientOntoNonNegativityConstraints(gradient, x);
      
      expect(projected[0]).toBe(1); // Not at boundary
      expect(projected[1]).toBe(0); // At boundary with negative gradient
      expect(projected[2]).toBe(3); // Not at boundary
    });

    it('should leave positive gradients at boundary unchanged', () => {
      const gradient = [1, 2, 3];
      const x = [0.1, 0, 0.5];
      const projected = projectGradientOntoNonNegativityConstraints(gradient, x);
      
      expect(projected).toEqual(gradient);
    });

    it('should throw error for mismatched lengths', () => {
      const gradient = [1, 2];
      const x = [0.1, 0, 0.5];
      
      expect(() => projectGradientOntoNonNegativityConstraints(gradient, x))
        .toThrow('Gradient and solution vectors must have the same length');
    });
  });

  describe('calculateEqualityConstraintViolation', () => {
    it('should calculate violation for unsatisfied constraints', () => {
      const x = [0.5, 0.3, 0.4];
      const A = [[1, 1, 1]];
      const b = [1];
      const violation = calculateEqualityConstraintViolation(x, A, b);
      
      // x sums to 1.2, constraint requires 1, violation = 0.2
      expect(violation).toBeCloseTo(0.2, 10);
    });

    it('should return zero for satisfied constraints', () => {
      const x = [0.3, 0.3, 0.4];
      const A = [[1, 1, 1]];
      const b = [1];
      const violation = calculateEqualityConstraintViolation(x, A, b);
      
      expect(violation).toBeCloseTo(0, 10);
    });

    it('should handle empty constraints', () => {
      const x = [0.5, 0.3, 0.4];
      const A: number[][] = [];
      const b: number[] = [];
      const violation = calculateEqualityConstraintViolation(x, A, b);
      
      expect(violation).toBe(0);
    });
  });

  describe('calculateInequalityConstraintViolation', () => {
    it('should calculate violation for unsatisfied constraints', () => {
      const x = [-0.1, 0.5, 0.2];
      const G = [[-1, 0, 0], [0, -1, 0], [0, 0, -1]]; // -x ≥ -0, i.e., x ≤ 0
      const h = [0, 0, 0];
      const violation = calculateInequalityConstraintViolation(x, G, h);
      
      // First element is negative, but constraint is x ≤ 0, so violation = 0.1
      expect(violation).toBeCloseTo(0.1, 10);
    });

    it('should return zero for satisfied constraints', () => {
      const x = [0.1, 0.5, 0.2];
      const G = [[-1, 0, 0], [0, -1, 0], [0, 0, -1]]; // -x ≤ 0, i.e., x ≥ 0
      const h = [0, 0, 0];
      const violation = calculateInequalityConstraintViolation(x, G, h);
      
      // All elements are positive, so -x ≤ 0 is satisfied, no violation
      expect(violation).toBe(0);
    });

    it('should handle empty constraints', () => {
      const x = [0.5, 0.3, 0.4];
      const G: number[][] = [];
      const h: number[] = [];
      const violation = calculateInequalityConstraintViolation(x, G, h);
      
      expect(violation).toBe(0);
    });
  });

  describe('isSolutionFeasible', () => {
    it('should return true for feasible solution', () => {
      const x = [0.3, 0.3, 0.4];
      const eq = { A: [[1, 1, 1]], b: [1] };
      const ineq = { G: [[-1, 0, 0], [0, -1, 0], [0, 0, -1]], h: [0, 0, 0] }; // x ≥ 0
      
      expect(isSolutionFeasible(x, eq, ineq)).toBe(true);
    });

    it('should return false for infeasible solution', () => {
      const x = [-0.1, 0.5, 0.6];
      const eq = { A: [[1, 1, 1]], b: [1] };
      const ineq = { G: [[-1, 0, 0], [0, -1, 0], [0, 0, -1]], h: [0, 0, 0] }; // x ≥ 0
      
      expect(isSolutionFeasible(x, eq, ineq)).toBe(false);
    });

    it('should handle only equality constraints', () => {
      const x = [0.3, 0.3, 0.4];
      const eq = { A: [[1, 1, 1]], b: [1] };
      
      expect(isSolutionFeasible(x, eq)).toBe(true);
    });

    it('should handle only inequality constraints', () => {
      const x = [0.1, 0.5, 0.2];
      const ineq = { G: [[-1, 0, 0], [0, -1, 0], [0, 0, -1]], h: [0, 0, 0] }; // x ≥ 0
      
      expect(isSolutionFeasible(x, undefined, ineq)).toBe(true);
    });

    it('should handle no constraints', () => {
      const x = [0.5, -0.3, 0.8];
      
      expect(isSolutionFeasible(x)).toBe(true);
    });
  });
});
