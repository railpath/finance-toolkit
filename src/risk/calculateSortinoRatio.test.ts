import { describe, expect, it } from 'vitest';

import { calculateSortinoRatio } from './calculateSortinoRatio';

describe('calculateSortinoRatio', () => {
  it('should calculate Sortino ratio for positive returns', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999); // All returns above target
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should calculate Sortino ratio for negative returns', () => {
    const options = {
      returns: [-0.01, -0.02, -0.03, -0.04, -0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeLessThan(0);
    expect(result.annualizedReturn).toBeLessThan(0);
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeLessThan(0);
  });

  it('should calculate Sortino ratio for mixed returns', () => {
    const options = {
      returns: [-0.01, 0.02, -0.03, 0.04, 0.01],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle no downside returns (all returns above target)', () => {
    const options = {
      returns: [0.02, 0.03, 0.04, 0.05, 0.06],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle zero target return', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle negative target return', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: -0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle zero risk-free rate', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeGreaterThan(0);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle high risk-free rate', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.10,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999); // All returns above target
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0); // Should be positive due to annualization
  });

  it('should handle different annualization factors', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 12 // Monthly data
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle two returns', () => {
    const options = {
      returns: [0.01, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const options = {
      returns,
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should be consistent for same inputs', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result1 = calculateSortinoRatio(options);
    const result2 = calculateSortinoRatio(options);

    expect(result1.sortinoRatio).toBeCloseTo(result2.sortinoRatio, 10);
    expect(result1.annualizedReturn).toBeCloseTo(result2.annualizedReturn, 10);
    expect(result1.downsideDeviation).toBeCloseTo(result2.downsideDeviation, 10);
    expect(result1.annualizedDownsideDeviation).toBeCloseTo(result2.annualizedDownsideDeviation, 10);
    expect(result1.excessReturn).toBeCloseTo(result2.excessReturn, 10);
  });

  it('should handle realistic portfolio scenario', () => {
    const options = {
      returns: [
        0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03,
        0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03
      ],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle edge case with zero returns', () => {
    const options = {
      returns: [0, 0, 0, 0, 0],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeLessThan(0);
    expect(result.annualizedReturn).toBe(0);
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeLessThan(0);
  });

  it('should handle edge case with very small returns', () => {
    const options = {
      returns: [0.001, 0.002, 0.003, 0.004, 0.005],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    // These returns are below target (0.01), so there will be downside deviation
    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with very large returns', () => {
    const options = {
      returns: [0.1, 0.2, 0.3, 0.4, 0.5],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should validate mathematical formula correctness', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    // Manual calculation verification
    const meanReturn = (0.01 + 0.02 + 0.03 + 0.04 + 0.05) / 5;
    const annualizedReturn = meanReturn * 252;
    const excessReturn = annualizedReturn - 0.02;
    
    // All returns are above target (0.01), so downside deviation should be 0
    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeCloseTo(annualizedReturn, 5);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeCloseTo(excessReturn, 5);
  });

  it('should handle edge case with negative risk-free rate', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: -0.01,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with very high annualization factor', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 1000
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with very low annualization factor', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 1
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with alternating returns', () => {
    const options = {
      returns: [0.01, -0.01, 0.01, -0.01, 0.01],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle edge case with monotonically increasing returns', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBe(999999);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.downsideDeviation).toBe(0);
    expect(result.annualizedDownsideDeviation).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with monotonically decreasing returns', () => {
    const options = {
      returns: [0.06, 0.05, 0.04, 0.03, 0.02, 0.01],
      riskFreeRate: 0.02,
      targetReturn: 0.01,
      annualizationFactor: 252
    };

    const result = calculateSortinoRatio(options);

    expect(result.sortinoRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.downsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.annualizedDownsideDeviation).toBeGreaterThanOrEqual(0);
    expect(result.excessReturn).toBeDefined();
  });
});
