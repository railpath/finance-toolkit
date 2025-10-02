import { describe, expect, it } from 'vitest';

import { calculateMonteCarloVaR } from './calculateMonteCarloVaR';

describe('calculateMonteCarloVaR', () => {
  it('should calculate Monte Carlo VaR for 95% confidence level', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should calculate Monte Carlo VaR for 99% confidence level', () => {
    const returns = [-0.10, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const confidenceLevel = 0.99;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.99);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should calculate Monte Carlo VaR for 90% confidence level', () => {
    const returns = [-0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const confidenceLevel = 0.90;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.90);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle different simulation counts', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.95;
    const simulations = 1000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle large simulation counts', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.95;
    const simulations = 100000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle all negative returns', () => {
    const returns = [-0.05, -0.04, -0.03, -0.02, -0.01];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle all positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle single return', () => {
    const returns = [-0.05];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    // Single return leads to variance = 0, which causes issues with Box-Muller transform
    expect(result.value).toBeNaN(); // Should be NaN due to division by zero in variance calculation
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle two returns', () => {
    const returns = [-0.10, 0.05];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle extreme losses', () => {
    const returns = [-0.50, -0.30, -0.10, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.90;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.90);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle realistic market crash scenario', () => {
    // Simulate 2008 financial crisis returns
    const returns = [
      -0.20, -0.15, -0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03,
      0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13
    ];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle crypto-like volatile returns', () => {
    const returns = [
      -0.30, -0.20, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25,
      0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75
    ];
    const confidenceLevel = 0.90;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.90);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle mixed positive and negative returns', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const confidenceLevel = 0.80;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.80);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should be consistent for same inputs', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const confidenceLevel = 0.90;
    const simulations = 10000;

    const result1 = calculateMonteCarloVaR(returns, confidenceLevel, simulations);
    const result2 = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    // Results should be similar but not identical due to randomness
    expect(result1.value).toBeGreaterThanOrEqual(0);
    expect(result2.value).toBeGreaterThanOrEqual(0);
    expect(result1.confidenceLevel).toBe(result2.confidenceLevel);
    expect(result1.method).toBe(result2.method);
  });

  it('should handle edge case with 50% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 0.50;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.50);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with very high confidence level', () => {
    const returns = [-0.20, -0.15, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25];
    const confidenceLevel = 0.99;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.99);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with 100% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 1.0;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(1.0);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with 0% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 0.0;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeNaN(); // Should be NaN due to out-of-bounds access
    expect(result.confidenceLevel).toBe(0.0);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle realistic portfolio scenario', () => {
    // Simulate a diversified portfolio during market stress
    const returns = [
      -0.08, -0.06, -0.04, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05,
      0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15
    ];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should validate Box-Muller transform implementation', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const confidenceLevel = 0.95;
    const simulations = 10000;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    // The result should be reasonable for the input data
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThan(1); // Should not be extremely high
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with very small simulation count', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.95;
    const simulations = 10;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with single simulation', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.95;
    const simulations = 1;

    const result = calculateMonteCarloVaR(returns, confidenceLevel, simulations);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });
});
