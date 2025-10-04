import { describe, expect, it } from 'vitest';

import { calculateSkewness } from './calculateSkewness';

describe('calculateSkewness', () => {
  it('should calculate skewness for normal distribution', () => {
    // Normal distribution should have skewness close to 0
    const normalData = [-1, -0.5, 0, 0.5, 1];
    const skewness = calculateSkewness(normalData);
    expect(skewness).toBeCloseTo(0, 1);
  });

  it('should calculate positive skewness (right-skewed)', () => {
    // Data with positive skewness (long right tail)
    const rightSkewedData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20];
    const skewness = calculateSkewness(rightSkewedData);
    expect(skewness).toBeGreaterThan(0);
  });

  it('should calculate negative skewness (left-skewed)', () => {
    // Data with negative skewness (long left tail)
    const leftSkewedData = [-20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const skewness = calculateSkewness(leftSkewedData);
    expect(skewness).toBeLessThan(0);
  });

  it('should handle financial returns data', () => {
    const returns = [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01, 0.04, -0.03];
    const skewness = calculateSkewness(returns);
    expect(typeof skewness).toBe('number');
    expect(!isNaN(skewness)).toBe(true);
  });

  it('should return 0 for constant values', () => {
    const constantData = [5, 5, 5, 5, 5];
    const skewness = calculateSkewness(constantData);
    expect(skewness).toBe(0);
  });

  it('should throw error for empty array', () => {
    expect(() => calculateSkewness([])).toThrow('Data array cannot be empty');
  });

  it('should throw error for insufficient data points', () => {
    expect(() => calculateSkewness([1, 2])).toThrow('At least 3 data points are required to calculate skewness');
  });

  it('should handle edge case with two equal values and one different', () => {
    const data = [1, 1, 2];
    const skewness = calculateSkewness(data);
    expect(typeof skewness).toBe('number');
    expect(!isNaN(skewness)).toBe(true);
  });

  it('should calculate correct skewness for known dataset', () => {
    // Test with known values where we can verify the calculation
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const skewness = calculateSkewness(data);
    
    // For this symmetric dataset, skewness should be close to 0
    expect(Math.abs(skewness)).toBeLessThan(0.1);
  });

  it('should handle large datasets', () => {
    // Generate large dataset
    const largeData = Array.from({ length: 1000 }, (_, _i) => Math.random() * 10);
    const skewness = calculateSkewness(largeData);
    expect(typeof skewness).toBe('number');
    expect(!isNaN(skewness)).toBe(true);
  });

  it('should handle negative values', () => {
    const negativeData = [-10, -5, -2, -1, 0, 1, 2, 5, 10];
    const skewness = calculateSkewness(negativeData);
    expect(typeof skewness).toBe('number');
    expect(!isNaN(skewness)).toBe(true);
  });
});
