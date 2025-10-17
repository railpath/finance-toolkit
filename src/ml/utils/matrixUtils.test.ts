import { addNoise, logSumExp, normalizeArray, normalizeRows } from './matrixUtils';
import { describe, expect, it } from 'vitest';

describe('matrixUtils', () => {
  describe('logSumExp', () => {
    it('should compute log-sum-exp correctly', () => {
      const result = logSumExp([0, 0, 0]);
      expect(result).toBeCloseTo(Math.log(3), 5);
    });

    it('should handle large negative values', () => {
      const result = logSumExp([-1000, -999, -1001]);
      expect(result).toBeCloseTo(-998.59, 1);
    });

    it('should return -Infinity for empty array', () => {
      const result = logSumExp([]);
      expect(result).toBe(-Infinity);
    });
  });

  describe('normalizeRows', () => {
    it('should normalize matrix rows to sum to 1', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const normalized = normalizeRows(matrix);
      
      expect(normalized[0].reduce((sum, val) => sum + val, 0)).toBeCloseTo(1, 10);
      expect(normalized[1].reduce((sum, val) => sum + val, 0)).toBeCloseTo(1, 10);
    });

    it('should handle zero rows with uniform distribution', () => {
      const matrix = [[0, 0, 0]];
      const normalized = normalizeRows(matrix);
      
      expect(normalized[0]).toEqual([1/3, 1/3, 1/3]);
    });
  });

  describe('normalizeArray', () => {
    it('should normalize array to sum to 1', () => {
      const arr = [1, 2, 3, 4];
      const normalized = normalizeArray(arr);
      
      expect(normalized.reduce((sum, val) => sum + val, 0)).toBeCloseTo(1, 10);
      expect(normalized).toEqual([0.1, 0.2, 0.3, 0.4]);
    });

    it('should handle zero sum with uniform distribution', () => {
      const arr = [0, 0, 0];
      const normalized = normalizeArray(arr);
      
      expect(normalized).toEqual([1/3, 1/3, 1/3]);
    });
  });

  describe('addNoise', () => {
    it('should add noise to matrix', () => {
      const matrix = [[1, 1], [1, 1]];
      const noisy = addNoise(matrix, 0.1);
      
      // Values should be different but close
      expect(noisy[0][0]).not.toBe(1);
      expect(noisy[0][0]).toBeGreaterThan(0.95);
      expect(noisy[0][0]).toBeLessThan(1.05);
    });
  });
});

