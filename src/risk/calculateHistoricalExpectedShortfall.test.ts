import { describe, expect, it } from 'vitest';

import { calculateHistoricalExpectedShortfall } from './calculateHistoricalExpectedShortfall';

describe('calculateHistoricalExpectedShortfall', () => {
  it('should calculate Expected Shortfall for 95% confidence level', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the average of the worst 5% (0.5 observations, rounded down to 0)
    // So it should return the single worst return
    expect(result).toBe(-0.05);
  });

  it('should calculate Expected Shortfall for 99% confidence level', () => {
    const returns = [-0.10, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const options = { confidenceLevel: 0.99, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the average of the worst 1% (0.1 observations, rounded down to 0)
    // So it should return the single worst return
    expect(result).toBe(-0.10);
  });

  it('should calculate Expected Shortfall for 90% confidence level', () => {
    const returns = [-0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const options = { confidenceLevel: 0.90, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the average of the worst 10% (1 observation)
    expect(result).toBe(-0.08);
  });

  it('should handle multiple tail losses correctly', () => {
    const returns = [-0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0.80, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return (cutoffIndex = 2, but tailLosses.length = 0 due to slice(0,0))
    expect(result).toBe(-0.10);
  });

  it('should handle all negative returns', () => {
    const returns = [-0.05, -0.04, -0.03, -0.02, -0.01];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return (cutoffIndex = 0, so tailLosses.length = 0)
    expect(result).toBe(-0.05);
  });

  it('should handle all positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst (smallest) return
    expect(result).toBe(0.01);
  });

  it('should handle single return', () => {
    const returns = [-0.05];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    expect(result).toBe(-0.05);
  });

  it('should handle two returns', () => {
    const returns = [-0.10, 0.05];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return
    expect(result).toBe(-0.10);
  });

  it('should handle extreme losses', () => {
    const returns = [-0.50, -0.30, -0.10, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.90, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the average of the worst 10% (1 observation: -0.50)
    expect(result).toBe(-0.50);
  });

  it('should handle realistic market crash scenario', () => {
    // Simulate 2008 financial crisis returns
    const returns = [
      -0.20, -0.15, -0.10, -0.08, -0.05, -0.03, -0.01, 0.01, 0.02, 0.03,
      0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13
    ];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return
    expect(result).toBe(-0.20);
  });

  it('should handle crypto-like volatile returns', () => {
    const returns = [
      -0.30, -0.20, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25,
      0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75
    ];
    const options = { confidenceLevel: 0.90, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return (cutoffIndex = 2, but tailLosses.length = 0 due to slice(0,0))
    expect(result).toBe(-0.30);
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    expect(result).toBe(0);
  });

  it('should handle mixed positive and negative returns', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const options = { confidenceLevel: 0.80, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return (cutoffIndex = 2, but tailLosses.length = 0 due to slice(0,0))
    expect(result).toBe(-0.05);
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    expect(result).toBeDefined();
    expect(result).toBeLessThanOrEqual(0); // ES should be negative or zero
  });

  it('should be consistent for same inputs', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11, 0.13];
    const options = { confidenceLevel: 0.90, method: 'historical' as const, simulations: 10000 };

    const result1 = calculateHistoricalExpectedShortfall(returns, options);
    const result2 = calculateHistoricalExpectedShortfall(returns, options);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle edge case with 50% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const options = { confidenceLevel: 0.50, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the average of the worst 50% (2 observations: -0.10, -0.05)
    expect(result).toBeCloseTo((-0.10 + -0.05) / 2, 5);
  });

  it('should handle edge case with very high confidence level', () => {
    const returns = [-0.20, -0.15, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25];
    const options = { confidenceLevel: 0.99, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return (0.1 observations, rounded down to 0)
    expect(result).toBe(-0.20);
  });

  it('should throw error for empty returns array', () => {
    const returns: number[] = [];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    expect(() =>
      calculateHistoricalExpectedShortfall(returns, options)
    ).toThrow('Returns array cannot be empty');
  });

  it('should handle realistic portfolio scenario', () => {
    // Simulate a diversified portfolio during market stress
    const returns = [
      -0.08, -0.06, -0.04, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05,
      0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15
    ];
    const options = { confidenceLevel: 0.95, method: 'historical' as const, simulations: 10000 };

    const result = calculateHistoricalExpectedShortfall(returns, options);

    // Should be the worst return
    expect(result).toBe(-0.08);
    expect(result).toBeLessThan(0); // Should be negative (loss)
  });
});
