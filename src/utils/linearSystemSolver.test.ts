import { describe, expect, it } from 'vitest';
import {
  isMatrixInvertible,
  luDecomposition,
  matrixConditionNumber,
  matrixDeterminant,
  solveLinearSystem,
  solveMultipleLinearSystems
} from './linearSystemSolver';

describe('Linear System Solver', () => {
  describe('solveLinearSystem', () => {
    it('should solve 2x2 linear system', () => {
      const A = [[2, 1], [1, 3]];
      const b = [5, 8];
      const x = solveLinearSystem(A, b);
      
      // Verify solution: 2x[0] + x[1] = 5, x[0] + 3x[1] = 8
      // Solution: x[0] = 1.4, x[1] = 2.2
      expect(x[0]).toBeCloseTo(1.4, 10);
      expect(x[1]).toBeCloseTo(2.2, 10);
    });

    it('should solve 3x3 linear system', () => {
      const A = [[2, 1, 0], [1, 2, 1], [0, 1, 2]];
      const b = [3, 6, 9];
      const x = solveLinearSystem(A, b);
      
      // Verify solution: Ax = b
      const result = A.map(row => row.reduce((sum, val, i) => sum + val * x[i], 0));
      expect(result[0]).toBeCloseTo(b[0], 10);
      expect(result[1]).toBeCloseTo(b[1], 10);
      expect(result[2]).toBeCloseTo(b[2], 10);
    });

    it('should handle identity matrix', () => {
      const A = [[1, 0], [0, 1]];
      const b = [3, 4];
      const x = solveLinearSystem(A, b);
      expect(x).toEqual([3, 4]);
    });

    it('should handle diagonal matrix', () => {
      const A = [[2, 0], [0, 3]];
      const b = [6, 12];
      const x = solveLinearSystem(A, b);
      expect(x).toEqual([3, 4]);
    });

    it('should handle singular matrix gracefully', () => {
      const A = [[1, 1], [1, 1]];
      const b = [2, 3];
      const x = solveLinearSystem(A, b);
      expect(x).toEqual([0, 0]);
    });

    it('should throw error for dimension mismatch', () => {
      const A = [[1, 2], [3, 4]];
      const b = [5];
      expect(() => solveLinearSystem(A, b)).toThrow('Vector b must match matrix dimensions');
    });

    it('should throw error for non-square matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      const b = [7, 8];
      expect(() => solveLinearSystem(A, b)).toThrow('Matrix A must be square');
    });
  });

  describe('solveMultipleLinearSystems', () => {
    it('should solve multiple systems with same coefficient matrix', () => {
      const A = [[2, 1], [1, 3]];
      const B = [[5, 1], [8, 2]];
      const X = solveMultipleLinearSystems(A, B);
      
      expect(X.length).toBe(2);
      expect(X[0].length).toBe(2);
      
      // First system: [5, 8]
      expect(X[0][0]).toBeCloseTo(1.4, 10);
      expect(X[1][0]).toBeCloseTo(2.2, 10);
      
      // Second system: [1, 2]
      expect(X[0][1]).toBeCloseTo(0.2, 10);
      expect(X[1][1]).toBeCloseTo(0.6, 10);
    });

    it('should handle single system', () => {
      const A = [[2, 1], [1, 3]];
      const B = [[5], [8]];
      const X = solveMultipleLinearSystems(A, B);
      
      expect(X[0][0]).toBeCloseTo(1.4, 10);
      expect(X[1][0]).toBeCloseTo(2.2, 10);
    });

    it('should throw error for dimension mismatch', () => {
      const A = [[1, 2], [3, 4]];
      const B = [[5]];
      expect(() => solveMultipleLinearSystems(A, B)).toThrow('Matrix B must have same number of rows as A');
    });
  });

  describe('matrixDeterminant', () => {
    it('should calculate determinant of 2x2 matrix', () => {
      const A = [[2, 1], [1, 3]];
      expect(matrixDeterminant(A)).toBe(5); // 2*3 - 1*1
    });

    it('should calculate determinant of 3x3 matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      expect(matrixDeterminant(A)).toBeCloseTo(0, 10); // Singular matrix
    });

    it('should calculate determinant of identity matrix', () => {
      const A = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      expect(matrixDeterminant(A)).toBe(1);
    });

    it('should calculate determinant of diagonal matrix', () => {
      const A = [[2, 0, 0], [0, 3, 0], [0, 0, 4]];
      expect(matrixDeterminant(A)).toBe(24); // 2*3*4
    });

    it('should handle 1x1 matrix', () => {
      const A = [[5]];
      expect(matrixDeterminant(A)).toBe(5);
    });

    it('should throw error for non-square matrix', () => {
      const A = [[1, 2], [3, 4], [5, 6]];
      expect(() => matrixDeterminant(A)).toThrow('Matrix must be square');
    });
  });

  describe('luDecomposition', () => {
    it('should perform LU decomposition of 2x2 matrix', () => {
      const A = [[2, 1], [1, 3]];
      const { L, U } = luDecomposition(A);
      
      // Verify L is lower triangular with 1s on diagonal
      expect(L[0][0]).toBeCloseTo(1, 10);
      expect(L[1][1]).toBeCloseTo(1, 10);
      expect(L[0][1]).toBeCloseTo(0, 10);
      
      // Verify U is upper triangular
      expect(U[1][0]).toBeCloseTo(0, 10);
      
      // Verify A = L*U (approximately)
      const reconstructed = L.map((row, _i) => 
        row.map((_, j) => 
          row.reduce((sum, val, k) => sum + val * U[k][j], 0)
        )
      );
      
      expect(reconstructed[0][0]).toBeCloseTo(A[0][0], 10);
      expect(reconstructed[0][1]).toBeCloseTo(A[0][1], 10);
      expect(reconstructed[1][0]).toBeCloseTo(A[1][0], 10);
      expect(reconstructed[1][1]).toBeCloseTo(A[1][1], 10);
    });

    it('should handle identity matrix', () => {
      const A = [[1, 0], [0, 1]];
      const { L, U } = luDecomposition(A);
      
      expect(L[0][0]).toBeCloseTo(1, 10);
      expect(L[1][1]).toBeCloseTo(1, 10);
      expect(U[0][0]).toBeCloseTo(1, 10);
      expect(U[1][1]).toBeCloseTo(1, 10);
    });

    it('should handle singular matrix', () => {
      const A = [[1, 1], [1, 1]];
      // For singular matrices, the function may not throw but should handle gracefully
      expect(() => luDecomposition(A)).not.toThrow();
    });
  });

  describe('isMatrixInvertible', () => {
    it('should return true for invertible matrix', () => {
      const A = [[2, 1], [1, 3]];
      expect(isMatrixInvertible(A)).toBe(true);
    });

    it('should return false for singular matrix', () => {
      const A = [[1, 1], [1, 1]];
      expect(isMatrixInvertible(A)).toBe(false);
    });

    it('should return true for identity matrix', () => {
      const A = [[1, 0], [0, 1]];
      expect(isMatrixInvertible(A)).toBe(true);
    });

    it('should return false for zero matrix', () => {
      const A = [[0, 0], [0, 0]];
      expect(isMatrixInvertible(A)).toBe(false);
    });
  });

  describe('matrixConditionNumber', () => {
    it('should calculate condition number for 2x2 matrix', () => {
      const A = [[2, 1], [1, 3]];
      const cond = matrixConditionNumber(A);
      expect(cond).toBeGreaterThan(1);
      expect(cond).toBeLessThan(100); // Should be well-conditioned
    });

    it('should return 1 for 1x1 matrix', () => {
      const A = [[5]];
      expect(matrixConditionNumber(A)).toBe(1);
    });

    it('should return infinity for singular matrix', () => {
      const A = [[1, 1], [1, 1]];
      expect(matrixConditionNumber(A)).toBe(Infinity);
    });

    it('should handle identity matrix', () => {
      const A = [[1, 0], [0, 1]];
      expect(matrixConditionNumber(A)).toBe(1);
    });
  });
});
