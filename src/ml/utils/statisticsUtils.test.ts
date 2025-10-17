import {
  calculateMean,
  calculateVariance,
  gaussianPDF,
  logGaussianPDF,
  logMultivariateGaussianPDF,
  multivariateGaussianPDF,
  standardize,
} from './statisticsUtils';
import { describe, expect, it } from 'vitest';

describe('statisticsUtils', () => {
  describe('gaussianPDF', () => {
    it('should compute Gaussian PDF correctly', () => {
      // Standard normal at x=0 should be 1/sqrt(2π) ≈ 0.3989
      const result = gaussianPDF(0, 0, 1);
      expect(result).toBeCloseTo(0.3989, 4);
    });

    it('should throw error for non-positive variance', () => {
      expect(() => gaussianPDF(0, 0, 0)).toThrow('Variance must be positive');
      expect(() => gaussianPDF(0, 0, -1)).toThrow('Variance must be positive');
    });
  });

  describe('logGaussianPDF', () => {
    it('should compute log Gaussian PDF correctly', () => {
      const result = logGaussianPDF(0, 0, 1);
      // Should be -0.5 * log(2π) ≈ -0.9189
      const expected = -0.5 * Math.log(2 * Math.PI);
      expect(result).toBeCloseTo(expected, 10);
    });
  });

  describe('calculateMean', () => {
    it('should calculate mean correctly', () => {
      const mean = calculateMean([1, 2, 3, 4, 5]);
      expect(mean).toBe(3);
    });

    it('should throw error for empty array', () => {
      expect(() => calculateMean([])).toThrow('Cannot calculate mean of empty array');
    });
  });

  describe('calculateVariance', () => {
    it('should calculate variance correctly', () => {
      const variance = calculateVariance([1, 2, 3, 4, 5]);
      expect(variance).toBe(2);
    });

    it('should accept pre-computed mean', () => {
      const variance = calculateVariance([1, 2, 3, 4, 5], 3);
      expect(variance).toBe(2);
    });

    it('should throw error for empty array', () => {
      expect(() => calculateVariance([])).toThrow('Cannot calculate variance of empty array');
    });
  });

  describe('standardize', () => {
    it('should standardize values to mean=0, std=1', () => {
      const values = [1, 2, 3, 4, 5];
      const standardized = standardize(values);
      
      const mean = standardized.reduce((sum, val) => sum + val, 0) / standardized.length;
      expect(mean).toBeCloseTo(0, 10);
      
      const variance = standardized.reduce((sum, val) => sum + val * val, 0) / standardized.length;
      expect(variance).toBeCloseTo(1, 10);
    });

    it('should return zeros for constant values', () => {
      const standardized = standardize([5, 5, 5, 5]);
      expect(standardized).toEqual([0, 0, 0, 0]);
    });

    it('should return empty array for empty input', () => {
      const standardized = standardize([]);
      expect(standardized).toEqual([]);
    });
  });

  describe('multivariateGaussianPDF', () => {
    it('should compute multivariate Gaussian PDF', () => {
      const x = [0, 0];
      const means = [0, 0];
      const variances = [1, 1];
      
      const result = multivariateGaussianPDF(x, means, variances);
      expect(result).toBeCloseTo(0.3989 * 0.3989, 4);
    });

    it('should throw error for dimension mismatch', () => {
      expect(() => multivariateGaussianPDF([0], [0, 0], [1, 1])).toThrow('Dimension mismatch');
    });
  });

  describe('logMultivariateGaussianPDF', () => {
    it('should compute log multivariate Gaussian PDF', () => {
      const x = [0, 0];
      const means = [0, 0];
      const variances = [1, 1];
      
      const result = logMultivariateGaussianPDF(x, means, variances);
      // Should be 2 * (-0.5 * log(2π)) = -log(2π)
      const expected = -Math.log(2 * Math.PI);
      expect(result).toBeCloseTo(expected, 10);
    });
  });
});

