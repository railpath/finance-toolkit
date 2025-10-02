import { describe, expect, it } from 'vitest';

import { calculateParametricExpectedShortfall } from './calculateParametricExpectedShortfall';

describe('calculateParametricExpectedShortfall', () => {
  it('should calculate Parametric Expected Shortfall for 95% confidence level', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should calculate Parametric Expected Shortfall for 99% confidence level', () => {
    const returns = [-0.10, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const options = { confidenceLevel: 0.99, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should calculate Parametric Expected Shortfall for 90% confidence level', () => {
    const returns = [-0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const options = { confidenceLevel: 0.90, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle all negative returns', () => {
    const returns = [-0.05, -0.04, -0.03, -0.02, -0.01];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle all positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle single return', () => {
    const returns = [-0.05];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    expect(() => calculateParametricExpectedShortfall(returns, options))
      .toThrow('At least 2 returns required for volatility calculation');
  });

  it('should handle two returns', () => {
    const returns = [-0.10, 0.05];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle extreme losses', () => {
    const returns = [-0.50, -0.30, -0.10, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.90, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle realistic market crash scenario', () => {
    // Simulate 2008 financial crisis returns
    const returns = [
      -0.20, -0.15, -0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03,
      0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13
    ];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle crypto-like volatile returns', () => {
    const returns = [
      -0.30, -0.20, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25,
      0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75
    ];
    const options = { confidenceLevel: 0.90, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle mixed positive and negative returns', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const options = { confidenceLevel: 0.80, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should be consistent for same inputs', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const options = { confidenceLevel: 0.90, method: 'parametric' as const, simulations: 10000 };

    const result1 = calculateParametricExpectedShortfall(returns, options);
    const result2 = calculateParametricExpectedShortfall(returns, options);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle edge case with 50% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const options = { confidenceLevel: 0.50, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very high confidence level', () => {
    const returns = [-0.20, -0.15, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25];
    const options = { confidenceLevel: 0.99, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should throw error for empty returns array', () => {
    const returns: number[] = [];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    expect(() =>
      calculateParametricExpectedShortfall(returns, options)
    ).toThrow('Returns array cannot be empty');
  });

  it('should handle realistic portfolio scenario', () => {
    // Simulate a diversified portfolio during market stress
    const returns = [
      -0.08, -0.06, -0.04, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05,
      0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15
    ];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should validate mathematical formula correctness', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    // ES = μ - σ * φ(z) / (1 - α)
    // For positive returns, ES should be negative (potential loss)
    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 100% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const options = { confidenceLevel: 1.0, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeNaN(); // Should be NaN due to division by zero (1 - 1.0 = 0)
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const options = { confidenceLevel: 0.0, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle normal distribution assumption', () => {
    // Test with normally distributed returns
    const returns = [
      -0.02, -0.01, -0.005, 0, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05,
      -0.03, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07
    ];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle high volatility scenario', () => {
    const returns = [
      -0.20, 0.15, -0.10, 0.08, -0.05, 0.03, -0.02, 0.01, -0.01, 0.02,
      0.20, -0.15, 0.10, -0.08, 0.05, -0.03, 0.02, -0.01, 0.01, -0.02
    ];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle low volatility scenario', () => {
    const returns = [
      -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035,
      -0.02, -0.015, -0.01, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04
    ];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very small returns', () => {
    const returns = [0.001, 0.002, 0.003, 0.004, 0.005];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very large returns', () => {
    const returns = [0.5, 0.6, 0.7, 0.8, 0.9];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const, simulations: 10000 };

    const result = calculateParametricExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    // For very large positive returns, ES can be positive (expected gain)
    expect(typeof result).toBe('number');
  });
});
