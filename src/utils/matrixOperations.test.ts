import {
  createIdentityMatrix,
  createZeroMatrix,
  isMatrixPositiveDefinite,
  isMatrixSymmetric,
  matrixDiagonal,
  matrixFrobeniusNorm,
  matrixMatrixMultiply,
  matrixTrace,
  matrixTranspose,
  matrixVectorMultiply
} from './matrixOperations';

describe('Matrix Operations', () => {
  describe('matrixVectorMultiply', () => {
    it('should multiply matrix by vector', () => {
      const A = [[1, 2], [3, 4]];
      const x = [5, 6];
      const result = matrixVectorMultiply(A, x);
      expect(result).toEqual([17, 39]); // [1*5+2*6, 3*5+4*6]
    });

    it('should handle single row matrix', () => {
      const A = [[1, 2, 3]];
      const x = [4, 5, 6];
      const result = matrixVectorMultiply(A, x);
      expect(result).toEqual([32]); // 1*4 + 2*5 + 3*6
    });

    it('should handle single column vector', () => {
      const A = [[1], [2], [3]];
      const x = [4];
      const result = matrixVectorMultiply(A, x);
      expect(result).toEqual([4, 8, 12]);
    });

    it('should throw error for dimension mismatch', () => {
      const A = [[1, 2], [3, 4]];
      const x = [5, 6, 7];
      expect(() => matrixVectorMultiply(A, x)).toThrow('Matrix columns must match vector length');
    });
  });

  describe('matrixTranspose', () => {
    it('should transpose square matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      const At = matrixTranspose(A);
      expect(At).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
    });

    it('should transpose rectangular matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      const At = matrixTranspose(A);
      expect(At).toEqual([[1, 4], [2, 5], [3, 6]]);
    });

    it('should handle single row matrix', () => {
      const A = [[1, 2, 3]];
      const At = matrixTranspose(A);
      expect(At).toEqual([[1], [2], [3]]);
    });

    it('should handle empty matrix', () => {
      const A: number[][] = [];
      const At = matrixTranspose(A);
      expect(At).toEqual([]);
    });
  });

  describe('matrixMatrixMultiply', () => {
    it('should multiply two square matrices', () => {
      const A = [[1, 2], [3, 4]];
      const B = [[5, 6], [7, 8]];
      const result = matrixMatrixMultiply(A, B);
      expect(result).toEqual([[19, 22], [43, 50]]);
    });

    it('should multiply rectangular matrices', () => {
      const A = [[1, 2], [3, 4]];
      const B = [[5, 6, 7], [8, 9, 10]];
      const result = matrixMatrixMultiply(A, B);
      expect(result).toEqual([[21, 24, 27], [47, 54, 61]]);
    });

    it('should handle identity matrix multiplication', () => {
      const A = [[1, 2], [3, 4]];
      const I = [[1, 0], [0, 1]];
      const result = matrixMatrixMultiply(A, I);
      expect(result).toEqual(A);
    });

    it('should throw error for incompatible dimensions', () => {
      const A = [[1, 2], [3, 4]];
      const B = [[5, 6, 7]];
      expect(() => matrixMatrixMultiply(A, B)).toThrow('Matrix dimensions must be compatible for multiplication');
    });
  });

  describe('matrixTrace', () => {
    it('should calculate trace of square matrix', () => {
      const A = [[1, 2], [3, 4]];
      expect(matrixTrace(A)).toBe(5); // 1 + 4
    });

    it('should calculate trace of 3x3 matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      expect(matrixTrace(A)).toBe(15); // 1 + 5 + 9
    });

    it('should handle zero matrix', () => {
      const A = [[0, 0], [0, 0]];
      expect(matrixTrace(A)).toBe(0);
    });

    it('should throw error for non-square matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      expect(() => matrixTrace(A)).toThrow('Matrix must be square');
    });
  });

  describe('isMatrixSymmetric', () => {
    it('should return true for symmetric matrix', () => {
      const A = [[1, 2], [2, 3]];
      expect(isMatrixSymmetric(A)).toBe(true);
    });

    it('should return false for non-symmetric matrix', () => {
      const A = [[1, 2], [3, 4]];
      expect(isMatrixSymmetric(A)).toBe(false);
    });

    it('should handle approximately symmetric matrix', () => {
      const A = [[1, 2.0000001], [2, 3]];
      expect(isMatrixSymmetric(A, 1e-6)).toBe(true);
    });

    it('should return false for non-square matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      expect(isMatrixSymmetric(A)).toBe(false);
    });
  });

  describe('isMatrixPositiveDefinite', () => {
    it('should return true for positive definite matrix', () => {
      const A = [[2, -1], [-1, 2]];
      expect(isMatrixPositiveDefinite(A)).toBe(true);
    });

    it('should return false for non-symmetric matrix', () => {
      const A = [[1, 2], [3, 4]];
      expect(isMatrixPositiveDefinite(A)).toBe(false);
    });

    it('should return false for matrix with non-positive diagonal', () => {
      const A = [[-1, 0], [0, 2]];
      expect(isMatrixPositiveDefinite(A)).toBe(false);
    });

    it('should return false for non-square matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      expect(isMatrixPositiveDefinite(A)).toBe(false);
    });
  });

  describe('createIdentityMatrix', () => {
    it('should create 2x2 identity matrix', () => {
      const I = createIdentityMatrix(2);
      expect(I).toEqual([[1, 0], [0, 1]]);
    });

    it('should create 3x3 identity matrix', () => {
      const I = createIdentityMatrix(3);
      expect(I).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    });

    it('should create 1x1 identity matrix', () => {
      const I = createIdentityMatrix(1);
      expect(I).toEqual([[1]]);
    });
  });

  describe('createZeroMatrix', () => {
    it('should create 2x3 zero matrix', () => {
      const Z = createZeroMatrix(2, 3);
      expect(Z).toEqual([[0, 0, 0], [0, 0, 0]]);
    });

    it('should create 1x1 zero matrix', () => {
      const Z = createZeroMatrix(1, 1);
      expect(Z).toEqual([[0]]);
    });

    it('should create empty matrix', () => {
      const Z = createZeroMatrix(0, 0);
      expect(Z).toEqual([]);
    });
  });

  describe('matrixDiagonal', () => {
    it('should extract diagonal from square matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      expect(matrixDiagonal(A)).toEqual([1, 5, 9]);
    });

    it('should extract diagonal from 2x2 matrix', () => {
      const A = [[2, 3], [4, 5]];
      expect(matrixDiagonal(A)).toEqual([2, 5]);
    });

    it('should throw error for non-square matrix', () => {
      const A = [[1, 2, 3], [4, 5, 6]];
      expect(() => matrixDiagonal(A)).toThrow('Matrix must be square');
    });
  });

  describe('matrixFrobeniusNorm', () => {
    it('should calculate Frobenius norm', () => {
      const A = [[1, 2], [3, 4]];
      expect(matrixFrobeniusNorm(A)).toBeCloseTo(Math.sqrt(30)); // √(1²+2²+3²+4²)
    });

    it('should handle zero matrix', () => {
      const A = [[0, 0], [0, 0]];
      expect(matrixFrobeniusNorm(A)).toBe(0);
    });

    it('should handle single element matrix', () => {
      const A = [[5]];
      expect(matrixFrobeniusNorm(A)).toBe(5);
    });

    it('should handle negative elements', () => {
      const A = [[-1, 2], [-3, 4]];
      expect(matrixFrobeniusNorm(A)).toBeCloseTo(Math.sqrt(30));
    });
  });
});
