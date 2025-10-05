import { describe, expect, it } from 'vitest';

import { calculateVaR } from './calculateVaR';

describe('calculateVaR', () => {
  it('should calculate VaR using historical method', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should calculate VaR using parametric method', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.95, method: 'parametric' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('parametric');
    expect(result.cvar).toBeDefined();
  });

  it('should calculate VaR using Monte Carlo method', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.95, method: 'monteCarlo' as const, simulations: 10000 };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical'); // Monte Carlo returns historical method
    expect(result.cvar).toBeDefined();
  });

  it('should handle different confidence levels', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.99, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.99);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle 90% confidence level', () => {
    const returns = [-0.05, -0.03, -0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07];
    const options = { confidenceLevel: 0.90, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.90);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle all negative returns', () => {
    const returns = [-0.05, -0.04, -0.03, -0.02, -0.01];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle all positive returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle mixed returns', () => {
    const returns = [-0.01, 0.02, -0.03, 0.04, 0.01];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should be consistent for same inputs', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result1 = calculateVaR(returns, options);
    const result2 = calculateVaR(returns, options);

    expect(result1.value).toBeCloseTo(result2.value, 10);
    expect(result1.confidenceLevel).toBe(result2.confidenceLevel);
    expect(result1.method).toBe(result2.method);
    expect(result1.cvar).toBeCloseTo(result2.cvar!, 10);
  });

  it('should handle realistic portfolio scenario', () => {
    const returns = [
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03,
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03
    ];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with very small returns', () => {
    const returns = [0.001, 0.002, 0.003, 0.004, 0.005];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with very large returns', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should throw error for empty returns array', () => {
    const returns: number[] = [];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    expect(() => calculateVaR(returns, options))
      .toThrow('Returns array cannot be empty');
  });

  it('should throw error for confidence level <= 0', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0, method: 'historical' as const };

    expect(() => calculateVaR(returns, options))
      .toThrow('Confidence level must be between 0 and 1');
  });

  it('should throw error for confidence level >= 1', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 1.0, method: 'historical' as const };

    expect(() => calculateVaR(returns, options))
      .toThrow('Confidence level must be between 0 and 1');
  });

  it('should throw error for unknown method', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { confidenceLevel: 0.95, method: 'unknown' as never };

    expect(() => calculateVaR(returns, options))
      .toThrow();
  });

  it('should handle edge case with 50% confidence level', () => {
    const returns = [-0.10, -0.05, 0.01, 0.05];
    const options = { confidenceLevel: 0.50, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.50);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with very high confidence level', () => {
    const returns = [-0.20, -0.15, -0.10, -0.05, 0.01, 0.05, 0.10, 0.15, 0.20, 0.25];
    const options = { confidenceLevel: 0.99, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.99);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with alternating returns', () => {
    const returns = [0.01, -0.01, 0.01, -0.01, 0.01];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with monotonically increasing returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with monotonically decreasing returns', () => {
    const returns = [0.06, 0.05, 0.04, 0.03, 0.02, 0.01];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with extreme values', () => {
    const returns = [-0.5, 0.5, -0.3, 0.3, 0.1];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with very close values', () => {
    const returns = [0.0101, 0.0102, 0.0103, 0.0104, 0.0105];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with mixed positive and negative values', () => {
    const returns = [0.1, -0.1, 0.2, -0.2, 0.05];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with symmetric returns', () => {
    const returns = [-0.05, -0.03, 0, 0.03, 0.05];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with all negative values', () => {
    const returns = [-0.1, -0.2, -0.3, -0.4, -0.5];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with all positive values', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });

  it('should handle edge case with decimal precision', () => {
    const returns = [0.123456, 0.234567, 0.345678, 0.456789, 0.567890];
    const options = { confidenceLevel: 0.95, method: 'historical' as const };

    const result = calculateVaR(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.confidenceLevel).toBe(0.95);
    expect(result.method).toBe('historical');
    expect(result.cvar).toBeDefined();
  });
});
