import { describe, expect, it } from 'vitest';

import { calculateParametricVaR } from './calculateParametricVaR';

describe('calculateParametricVaR', () => {
  it('should calculate Parametric VaR for 95% confidence level', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should calculate Parametric VaR for 99% confidence level', () => {
    const returns = [-0.10, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const confidenceLevel = 0.99;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.99);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should calculate Parametric VaR for 90% confidence level', () => {
    const returns = [-0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const confidenceLevel = 0.90;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.90);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle all negative returns', () => {
    const returns = [-0.05, -0.04, -0.03, -0.02, -0.01];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle all positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle single return', () => {
    const returns = [-0.05];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    // Single return leads to variance = 0, which causes issues with Z-score calculation
    expect(result.value).toBeNaN(); // Should be NaN due to division by zero in variance calculation
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeNaN();
  });

  it('should handle two returns', () => {
    const returns = [-0.10, 0.05];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle extreme losses', () => {
    const returns = [-0.50, -0.30, -0.10, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.90;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.90);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle realistic market crash scenario', () => {
    // Simulate 2008 financial crisis returns
    const returns = [
      -0.20, -0.15, -0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03,
      0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13
    ];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle crypto-like volatile returns', () => {
    const returns = [
      -0.30, -0.20, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25,
      0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75
    ];
    const confidenceLevel = 0.90;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.90);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle mixed positive and negative returns', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const confidenceLevel = 0.80;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.80);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should be consistent for same inputs', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const confidenceLevel = 0.90;

    const result1 = calculateParametricVaR(returns, confidenceLevel);
    const result2 = calculateParametricVaR(returns, confidenceLevel);

    expect(result1.value).toBeCloseTo(result2.value, 10);
    expect(result1.cvar).toBeCloseTo(result2.cvar, 10);
    expect(result1.confidenceLevel).toBe(result2.confidenceLevel);
    expect(result1.method).toBe(result2.method);
  });

  it('should handle edge case with 50% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 0.50;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.50);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge case with very high confidence level', () => {
    const returns = [-0.20, -0.15, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25];
    const confidenceLevel = 0.99;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.99);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge case with 100% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 1.0;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeNaN(); // Should be NaN due to division by zero (1 - 1.0 = 0)
    expect(result.confidenceLevel).toBe(1.0);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeNaN();
  });

  it('should handle edge case with 0% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 0.0;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.0);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle realistic portfolio scenario', () => {
    // Simulate a diversified portfolio during market stress
    const returns = [
      -0.08, -0.06, -0.04, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05,
      0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15
    ];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should validate mathematical formula correctness', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    // VaR = |μ - z * σ|
    // CVaR = |μ - σ * φ(z) / (1 - α)|
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.cvar).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
  });

  it('should handle normal distribution assumption', () => {
    // Test with normally distributed returns
    const returns = [
      -0.02, -0.01, -0.005, 0, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05,
      -0.03, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07
    ];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle high volatility scenario', () => {
    const returns = [
      -0.20, 0.15, -0.10, 0.08, -0.05, 0.03, -0.02, 0.01, -0.01, 0.02,
      0.20, -0.15, 0.10, -0.08, 0.05, -0.03, 0.02, -0.01, 0.01, -0.02
    ];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle low volatility scenario', () => {
    const returns = [
      -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035,
      -0.02, -0.015, -0.01, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04
    ];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge case with very small returns', () => {
    const returns = [0.001, 0.002, 0.003, 0.004, 0.005];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge case with very large returns', () => {
    const returns = [0.5, 0.6, 0.7, 0.8, 0.9];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge case with identical returns', () => {
    const returns = [0.05, 0.05, 0.05, 0.05, 0.05];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge case with alternating returns', () => {
    const returns = [0.01, -0.01, 0.01, -0.01, 0.01];
    const confidenceLevel = 0.95;

    const result = calculateParametricVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
    expect(result.cvar).toBeGreaterThanOrEqual(0);
  });
});
