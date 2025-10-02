import { describe, expect, it } from 'vitest';

import { calculateHistoricalVaR } from './calculateHistoricalVaR';

describe('calculateHistoricalVaR', () => {
  it('should calculate VaR for 95% confidence level', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the 5th percentile (worst 5% = 0.5 observations, rounded down to 0)
    expect(result.value).toBe(0.05); // Math.abs(-0.05)
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should calculate VaR for 99% confidence level', () => {
    const returns = [-0.10, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const confidenceLevel = 0.99;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the 1st percentile (worst 1% = 0.1 observations, rounded down to 0)
    expect(result.value).toBe(0.10); // Math.abs(-0.10)
    expect(result.confidenceLevel).toBe(0.99);
    expect(result.method).toBe('historical');
  });

  it('should calculate VaR for 90% confidence level', () => {
    const returns = [-0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const confidenceLevel = 0.90;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the 10th percentile (worst 10% = 1 observation)
    expect(result.value).toBe(0.08); // Math.abs(-0.08)
    expect(result.confidenceLevel).toBe(0.90);
  });

  it('should handle all negative returns', () => {
    const returns = [-0.05, -0.04, -0.03, -0.02, -0.01];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the worst return
    expect(result.value).toBe(0.05); // Math.abs(-0.05)
    expect(result.cvar).toBeDefined();
  });

  it('should handle all positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the smallest return (least positive)
    expect(result.value).toBe(0.01);
    expect(result.cvar).toBeDefined();
  });

  it('should handle single return', () => {
    const returns = [-0.05];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    expect(result.value).toBe(0.05);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
  });

  it('should handle two returns', () => {
    const returns = [-0.10, 0.05];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the worst return
    expect(result.value).toBe(0.10);
    expect(result.cvar).toBeDefined();
  });

  it('should handle extreme losses', () => {
    const returns = [-0.50, -0.30, -0.10, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const confidenceLevel = 0.90;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the 10th percentile
    expect(result.value).toBe(0.50); // Math.abs(-0.50)
    expect(result.cvar).toBeDefined();
  });

  it('should handle realistic market crash scenario', () => {
    // Simulate 2008 financial crisis returns
    const returns = [
      -0.20, -0.15, -0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03,
      0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13
    ];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Index = floor(0.05 * 20) = 1, so sorted[1] = -0.15
    expect(result.value).toBe(0.15); // Math.abs(-0.15)
    expect(result.confidenceLevel).toBe(0.95);
  });

  it('should handle crypto-like volatile returns', () => {
    const returns = [
      -0.30, -0.20, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25,
      0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75
    ];
    const confidenceLevel = 0.90;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Index = floor(0.10 * 20) = 2, so sorted[2] = -0.20
    expect(result.value).toBe(0.20); // Math.abs(-0.20)
    expect(result.cvar).toBeDefined();
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    expect(result.value).toBe(0);
    expect(result.cvar).toBe(0);
  });

  it('should handle mixed positive and negative returns', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const confidenceLevel = 0.80;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Index = floor(0.20 * 10) = 2, so sorted[2] = -0.03
    expect(result.value).toBe(0.03); // Math.abs(-0.03)
    expect(result.cvar).toBeDefined();
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should be consistent for same inputs', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const confidenceLevel = 0.90;

    const result1 = calculateHistoricalVaR(returns, confidenceLevel);
    const result2 = calculateHistoricalVaR(returns, confidenceLevel);

    expect(result1.value).toBeCloseTo(result2.value, 10);
    expect(result1.cvar).toBeCloseTo(result2.cvar, 10);
  });

  it('should handle edge case with 50% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 0.50;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Index = floor(0.50 * 4) = 2, so sorted[2] = 0.01
    expect(result.value).toBe(0.01); // Math.abs(0.01)
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with very high confidence level', () => {
    const returns = [-0.20, -0.15, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25];
    const confidenceLevel = 0.99;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the 1st percentile
    expect(result.value).toBe(0.20); // Math.abs(-0.20)
    expect(result.cvar).toBeDefined();
  });

  it('should calculate CVaR correctly', () => {
    const returns = [-0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05];
    const confidenceLevel = 0.80;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // CVaR should be the average of losses beyond VaR
    expect(result.cvar).toBeGreaterThanOrEqual(0);
    expect(result.cvar).toBeDefined();
  });

  it('should handle realistic portfolio scenario', () => {
    // Simulate a diversified portfolio during market stress
    const returns = [
      -0.08, -0.06, -0.04, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05,
      0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15
    ];
    const confidenceLevel = 0.95;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Index = floor(0.05 * 20) = 1, so sorted[1] = -0.06
    expect(result.value).toBe(0.06); // Math.abs(-0.06)
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with 100% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 1.0;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Should be the worst return
    expect(result.value).toBe(0.10); // Math.abs(-0.10)
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with 0% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const confidenceLevel = 0.0;

    const result = calculateHistoricalVaR(returns, confidenceLevel);

    // Index = floor(1.0 * 4) = 4, so sorted[4] = undefined, should return NaN
    expect(result.value).toBeNaN();
    expect(result.cvar).toBeDefined();
  });
});
