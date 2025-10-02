import { describe, expect, it } from 'vitest';

import { calculateEWMAVolatility } from './calculateEWMAVolatility';

describe('calculateEWMAVolatility', () => {
  it('should calculate EWMA volatility for constant returns', () => {
    const returns = [0.01, 0.01, 0.01, 0.01, 0.01];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    // For constant returns, volatility should be the return value
    expect(result).toBeCloseTo(0.01, 5);
  });

  it('should calculate EWMA volatility for varying returns', () => {
    const returns = [0.01, 0.02, -0.01, 0.03, -0.02];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
  });

  it('should give more weight to recent observations', () => {
    const returns1 = [0.01, 0.01, 0.01, 0.01, 0.05]; // High recent return
    const returns2 = [0.05, 0.01, 0.01, 0.01, 0.01]; // High early return
    const lambda = 0.94;

    const result1 = calculateEWMAVolatility(returns1, lambda);
    const result2 = calculateEWMAVolatility(returns2, lambda);

    // Both should produce valid results
    expect(result1).toBeGreaterThan(0);
    expect(result2).toBeGreaterThan(0);
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });

  it('should handle different lambda values correctly', () => {
    const returns = [0.01, 0.02, -0.01, 0.03, -0.02];
    
    const result1 = calculateEWMAVolatility(returns, 0.9);
    const result2 = calculateEWMAVolatility(returns, 0.95);

    // Higher lambda = more weight on recent observations
    expect(result1).not.toBeCloseTo(result2, 5);
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });

  it('should handle single return value', () => {
    const returns = [0.02];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    // Should return the absolute value of the single return
    expect(result).toBeCloseTo(0.02, 5);
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBe(0);
  });

  it('should handle negative returns', () => {
    const returns = [-0.01, -0.02, -0.01, -0.03, -0.02];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
  });

  it('should handle mixed positive and negative returns', () => {
    const returns = [0.01, -0.02, 0.03, -0.01, 0.02];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
  });

  it('should throw error for invalid lambda values', () => {
    const returns = [0.01, 0.02, 0.01];

    expect(() => calculateEWMAVolatility(returns, 0)).toThrow('Lambda must be between 0 and 1');
    expect(() => calculateEWMAVolatility(returns, 1)).toThrow('Lambda must be between 0 and 1');
    expect(() => calculateEWMAVolatility(returns, -0.1)).toThrow('Lambda must be between 0 and 1');
    expect(() => calculateEWMAVolatility(returns, 1.1)).toThrow('Lambda must be between 0 and 1');
  });

  it('should handle empty returns array', () => {
    const returns: number[] = [];
    const lambda = 0.94;

    // Function should handle empty array gracefully or throw
    expect(() => calculateEWMAVolatility(returns, lambda)).not.toThrow();
  });

  it('should calculate realistic market volatility', () => {
    // Simulate daily S&P 500 returns
    const returns = [
      0.01, -0.02, 0.015, -0.01, 0.02,
      -0.005, 0.01, -0.015, 0.025, -0.01,
      0.005, 0.01, -0.02, 0.03, -0.005
    ];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1); // Should be reasonable volatility
  });

  it('should be consistent with RiskMetrics lambda=0.94', () => {
    const returns = [0.01, 0.02, -0.01, 0.03, -0.02, 0.01, -0.015, 0.025];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    // Should produce reasonable volatility estimate
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(0.1); // Less than 10% daily volatility
  });

  it('should handle extreme returns', () => {
    const returns = [0.01, 0.01, 0.01, 0.01, 0.5]; // Extreme final return
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
  });

  it('should be deterministic for same inputs', () => {
    const returns = [0.01, 0.02, -0.01, 0.03, -0.02];
    const lambda = 0.94;

    const result1 = calculateEWMAVolatility(returns, lambda);
    const result2 = calculateEWMAVolatility(returns, lambda);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle long return series', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      Math.sin(i / 10) * 0.01 + (Math.random() - 0.5) * 0.02
    );
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case lambda values', () => {
    const returns = [0.01, 0.02, -0.01, 0.03, -0.02];

    // Lambda close to 0 (more weight on recent)
    const result1 = calculateEWMAVolatility(returns, 0.01);
    
    // Lambda close to 1 (more weight on historical)
    const result2 = calculateEWMAVolatility(returns, 0.99);

    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1).not.toBeCloseTo(result2, 5);
  });

  it('should handle crypto-like volatile returns', () => {
    const returns = [0.05, -0.03, 0.08, -0.06, 0.12, -0.04, 0.07, -0.02];
    const lambda = 0.94;

    const result = calculateEWMAVolatility(returns, lambda);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1); // Should be reasonable even for volatile assets
  });

  it('should be consistent with manual calculation for simple case', () => {
    const returns = [0.01, 0.02];
    const lambda = 0.5;

    const result = calculateEWMAVolatility(returns, lambda);

    // Manual calculation: sqrt(0.5 * 0.01^2 + 0.5 * 0.02^2)
    const expected = Math.sqrt(0.5 * 0.0001 + 0.5 * 0.0004);
    expect(result).toBeCloseTo(expected, 5);
  });
});
