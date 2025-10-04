import { describe, expect, it } from 'vitest';

import { calculateKurtosis } from './calculateKurtosis';

describe('calculateKurtosis', () => {
  it('should calculate kurtosis for normal distribution', () => {
    // Generate data that approximates normal distribution better
    const normalData = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, -1.8, -1.2, -0.8, 0.2, 0.8, 1.2, 1.8];
    const kurtosis = calculateKurtosis(normalData);
    expect(Math.abs(kurtosis)).toBeLessThan(2); // Should be close to 0 for normal distribution
  });

  it('should calculate positive excess kurtosis (fat tails)', () => {
    // Data with fat tails (more extreme values)
    const fatTailData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, -10, 15, -15, 0, 0];
    const kurtosis = calculateKurtosis(fatTailData);
    expect(kurtosis).toBeGreaterThan(0);
  });

  it('should calculate negative excess kurtosis (thin tails)', () => {
    // Data with thin tails (uniform-like distribution)
    const thinTailData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const kurtosis = calculateKurtosis(thinTailData);
    expect(kurtosis).toBeLessThan(0);
  });

  it('should handle financial returns data', () => {
    const returns = [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01, 0.04, -0.03, -0.01, 0.02];
    const kurtosis = calculateKurtosis(returns);
    expect(typeof kurtosis).toBe('number');
    expect(!isNaN(kurtosis)).toBe(true);
  });

  it('should return -3 for constant values', () => {
    const constantData = [5, 5, 5, 5, 5];
    const kurtosis = calculateKurtosis(constantData);
    expect(kurtosis).toBe(-3);
  });

  it('should throw error for empty array', () => {
    expect(() => calculateKurtosis([])).toThrow('Data array cannot be empty');
  });

  it('should throw error for insufficient data points', () => {
    expect(() => calculateKurtosis([1, 2, 3])).toThrow('At least 4 data points are required to calculate kurtosis');
  });

  it('should handle edge case with extreme values', () => {
    const data = [1, 1, 1, 1, 100]; // One extreme outlier
    const kurtosis = calculateKurtosis(data);
    expect(kurtosis).toBeGreaterThan(0); // Should show fat tail behavior
  });

  it('should calculate correct kurtosis for uniform distribution', () => {
    // Uniform distribution has negative excess kurtosis
    const uniformData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const kurtosis = calculateKurtosis(uniformData);
    expect(kurtosis).toBeLessThan(0);
  });

  it('should handle large datasets', () => {
    // Generate large dataset with normal distribution
    const largeData = Array.from({ length: 1000 }, () => {
      // Box-Muller transformation for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    });
    const kurtosis = calculateKurtosis(largeData);
    expect(Math.abs(kurtosis)).toBeLessThan(1); // Should be close to 0 for normal distribution
  });

  it('should handle negative values', () => {
    const negativeData = [-10, -5, -2, -1, 0, 1, 2, 5, 10, 15, -15];
    const kurtosis = calculateKurtosis(negativeData);
    expect(typeof kurtosis).toBe('number');
    expect(!isNaN(kurtosis)).toBe(true);
  });

  it('should handle mixed positive and negative extreme values', () => {
    const extremeData = [0, 0, 0, 0, 0, 10, -10, 0, 0, 0];
    const kurtosis = calculateKurtosis(extremeData);
    expect(kurtosis).toBeGreaterThan(0); // Should show fat tail behavior
  });

  it('should be consistent with theoretical expectations', () => {
    // Test with a dataset that has known kurtosis properties
    const symmetricData = [-3, -2, -1, 0, 1, 2, 3, -1.5, -0.5, 0.5, 1.5];
    const kurtosis = calculateKurtosis(symmetricData);
    
    // For symmetric, roughly normal data, kurtosis should be close to 0
    expect(Math.abs(kurtosis)).toBeLessThan(2);
  });
});
