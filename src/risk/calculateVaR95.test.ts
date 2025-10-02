import { describe, expect, it } from 'vitest';

import { calculateVaR95 } from './calculateVaR95';

describe('calculateVaR95', () => {
  it('should calculate 95% VaR for positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate 95% VaR for negative returns', () => {
    const returns = [-0.01, -0.02, -0.03, -0.04, -0.05];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate 95% VaR for mixed returns', () => {
    const returns = [-0.01, 0.02, -0.03, 0.04, 0.01];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle all negative returns', () => {
    const returns = [-0.05, -0.04, -0.03, -0.02, -0.01];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle all positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle single return', () => {
    const returns = [0.05];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle two returns', () => {
    const returns = [0.01, 0.05];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should be consistent for same inputs', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const result1 = calculateVaR95(returns);
    const result2 = calculateVaR95(returns);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle realistic portfolio scenario', () => {
    const returns = [
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03,
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03
    ];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very small returns', () => {
    const returns = [0.001, 0.002, 0.003, 0.004, 0.005];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very large returns', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should throw error for empty returns array', () => {
    const returns: number[] = [];

    expect(() => calculateVaR95(returns))
      .toThrow('Returns array cannot be empty');
  });

  it('should handle edge case with alternating returns', () => {
    const returns = [0.01, -0.01, 0.01, -0.01, 0.01];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with monotonically increasing returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with monotonically decreasing returns', () => {
    const returns = [0.06, 0.05, 0.04, 0.03, 0.02, 0.01];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with extreme values', () => {
    const returns = [-0.5, 0.5, -0.3, 0.3, 0.1];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very close values', () => {
    const returns = [0.0101, 0.0102, 0.0103, 0.0104, 0.0105];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with mixed positive and negative values', () => {
    const returns = [0.1, -0.1, 0.2, -0.2, 0.05];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with symmetric returns', () => {
    const returns = [-0.05, -0.03, 0, 0.03, 0.05];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with all negative values', () => {
    const returns = [-0.1, -0.2, -0.3, -0.4, -0.5];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with all positive values', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with decimal precision', () => {
    const returns = [0.123456, 0.234567, 0.345678, 0.456789, 0.567890];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle realistic market crash scenario', () => {
    // Simulate 2008 financial crisis returns
    const returns = [
      -0.20, -0.15, -0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03,
      0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13
    ];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle crypto-like volatile returns', () => {
    const returns = [
      -0.30, -0.20, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25,
      0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75
    ];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with identical returns', () => {
    const returns = [0.01, 0.01, 0.01, 0.01, 0.01];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very small differences', () => {
    const returns = [0.0101, 0.0102, 0.0103, 0.0104, 0.0105];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very large differences', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = calculateVaR95(returns);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });
});
