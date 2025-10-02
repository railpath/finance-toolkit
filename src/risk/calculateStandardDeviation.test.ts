import { describe, expect, it } from 'vitest';

import { calculateStandardDeviation } from './calculateStandardDeviation';

describe('calculateStandardDeviation', () => {
  it('should calculate standard deviation for positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate standard deviation for negative returns', () => {
    const returns = [-0.01, -0.02, -0.03, -0.04, -0.05];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate standard deviation for mixed returns', () => {
    const returns = [-0.01, 0.02, -0.03, 0.04, 0.01];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should return zero for identical returns', () => {
    const returns = [0.01, 0.01, 0.01, 0.01, 0.01];
    const result = calculateStandardDeviation(returns);

    expect(result).toBe(0);
    expect(result).toBeDefined();
  });

  it('should handle two returns', () => {
    const returns = [0.01, 0.05];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should be consistent for same inputs', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const result1 = calculateStandardDeviation(returns);
    const result2 = calculateStandardDeviation(returns);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle realistic portfolio scenario', () => {
    const returns = [
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03,
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03
    ];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const result = calculateStandardDeviation(returns);

    expect(result).toBe(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case with very small returns', () => {
    const returns = [0.001, 0.002, 0.003, 0.004, 0.005];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very large returns', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should validate mathematical formula correctness', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const result = calculateStandardDeviation(returns);

    // Manual calculation verification
    const n = returns.length;
    const mean = returns.reduce((sum, r) => sum + r, 0) / n;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (n - 1);
    const expectedStdDev = Math.sqrt(variance);

    expect(result).toBeCloseTo(expectedStdDev, 10);
  });

  it('should handle edge case with alternating returns', () => {
    const returns = [0.01, -0.01, 0.01, -0.01, 0.01];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with monotonically increasing returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with monotonically decreasing returns', () => {
    const returns = [0.06, 0.05, 0.04, 0.03, 0.02, 0.01];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with single return', () => {
    const returns = [0.05];
    const result = calculateStandardDeviation(returns);

    // Single return should result in NaN due to division by (n-1) = 0
    expect(result).toBeNaN();
  });

  it('should handle edge case with empty array', () => {
    const returns: number[] = [];
    const result = calculateStandardDeviation(returns);

    // Empty array should result in 0 (or -0) due to reduce returning 0
    expect(result).toBeCloseTo(0, 10);
  });

  it('should handle edge case with extreme values', () => {
    const returns = [-0.5, 0.5, -0.3, 0.3, 0.1];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very close values', () => {
    const returns = [0.0101, 0.0102, 0.0103, 0.0104, 0.0105];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with mixed positive and negative values', () => {
    const returns = [0.1, -0.1, 0.2, -0.2, 0.05];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with symmetric returns', () => {
    const returns = [-0.05, -0.03, 0, 0.03, 0.05];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with all negative values', () => {
    const returns = [-0.1, -0.2, -0.3, -0.4, -0.5];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with all positive values', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with decimal precision', () => {
    const returns = [0.123456, 0.234567, 0.345678, 0.456789, 0.567890];
    const result = calculateStandardDeviation(returns);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });
});
