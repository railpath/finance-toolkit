import { describe, expect, it } from 'vitest';

import { calculateVolatility } from './calculateVolatility';

describe('calculateVolatility', () => {
  it('should calculate standard volatility', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
    expect(result.annualized).toBeUndefined();
  });

  it('should calculate exponential volatility with default lambda', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'exponential' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('exponential');
    expect(result.annualized).toBeUndefined();
  });

  it('should calculate exponential volatility with custom lambda', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'exponential' as const, lambda: 0.96 };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('exponential');
    expect(result.annualized).toBeUndefined();
  });

  it('should calculate Parkinson volatility', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const highPrices = [102, 103, 104, 105, 106];
    const lowPrices = [98, 99, 100, 101, 102];
    const options = { method: 'parkinson' as const, highPrices, lowPrices };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('parkinson');
    expect(result.annualized).toBeUndefined();
  });

  it('should calculate Garman-Klass volatility', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const openPrices = [100, 101, 102, 103, 104];
    const highPrices = [102, 103, 104, 105, 106];
    const lowPrices = [98, 99, 100, 101, 102];
    const closePrices = [101, 102, 103, 104, 105];
    const options = { 
      method: 'garman-klass' as const, 
      openPrices, 
      highPrices, 
      lowPrices, 
      closePrices 
    };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('garman-klass');
    expect(result.annualized).toBeUndefined();
  });

  it('should calculate annualized volatility', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'standard' as const, annualizationFactor: 252 };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
    expect(result.annualized).toBeGreaterThanOrEqual(0);
    expect(result.annualized).toBeCloseTo(result.value * Math.sqrt(252), 5);
  });

  it('should handle negative returns', () => {
    const returns = [-0.01, -0.02, -0.03, -0.04, -0.05];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle mixed returns', () => {
    const returns = [-0.01, 0.02, -0.03, 0.04, 0.01];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle zero returns', () => {
    const returns = [0, 0, 0, 0, 0];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBe(0);
    expect(result.method).toBe('standard');
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should be consistent for same inputs', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'standard' as const };

    const result1 = calculateVolatility(returns, options);
    const result2 = calculateVolatility(returns, options);

    expect(result1.value).toBeCloseTo(result2.value, 10);
    expect(result1.method).toBe(result2.method);
  });

  it('should handle realistic portfolio scenario', () => {
    const returns = [
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03,
      0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03
    ];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with very small returns', () => {
    const returns = [0.001, 0.002, 0.003, 0.004, 0.005];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with very large returns', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should throw error for single return', () => {
    const returns = [0.05];
    const options = { method: 'standard' as const };

    expect(() => calculateVolatility(returns, options))
      .toThrow('At least 2 returns required for volatility calculation');
  });

  it('should throw error for empty returns array', () => {
    const returns: number[] = [];
    const options = { method: 'standard' as const };

    expect(() => calculateVolatility(returns, options))
      .toThrow('At least 2 returns required for volatility calculation');
  });

  it('should throw error for Parkinson method without high/low prices', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'parkinson' as const };

    expect(() => calculateVolatility(returns, options))
      .toThrow('High and low prices required for Parkinson method');
  });

  it('should throw error for Garman-Klass method without OHLC prices', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'garman-klass' as const };

    expect(() => calculateVolatility(returns, options))
      .toThrow('OHLC prices required for Garman-Klass method');
  });

  it('should throw error for unknown method', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'unknown' as any };

    expect(() => calculateVolatility(returns, options))
      .toThrow('Unknown volatility method: unknown');
  });

  it('should handle edge case with alternating returns', () => {
    const returns = [0.01, -0.01, 0.01, -0.01, 0.01];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with monotonically increasing returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with monotonically decreasing returns', () => {
    const returns = [0.06, 0.05, 0.04, 0.03, 0.02, 0.01];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with extreme values', () => {
    const returns = [-0.5, 0.5, -0.3, 0.3, 0.1];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with very close values', () => {
    const returns = [0.0101, 0.0102, 0.0103, 0.0104, 0.0105];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with mixed positive and negative values', () => {
    const returns = [0.1, -0.1, 0.2, -0.2, 0.05];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with symmetric returns', () => {
    const returns = [-0.05, -0.03, 0, 0.03, 0.05];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with all negative values', () => {
    const returns = [-0.1, -0.2, -0.3, -0.4, -0.5];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with all positive values', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with decimal precision', () => {
    const returns = [0.123456, 0.234567, 0.345678, 0.456789, 0.567890];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle different annualization factors', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const options = { method: 'standard' as const, annualizationFactor: 12 };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
    expect(result.annualized).toBeGreaterThanOrEqual(0);
    expect(result.annualized).toBeCloseTo(result.value * Math.sqrt(12), 5);
  });

  it('should handle edge case with identical returns', () => {
    const returns = [0.01, 0.01, 0.01, 0.01, 0.01];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBe(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with very small differences', () => {
    const returns = [0.0101, 0.0102, 0.0103, 0.0104, 0.0105];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });

  it('should handle edge case with very large differences', () => {
    const returns = [0.1, 0.2, 0.3, 0.4, 0.5];
    const options = { method: 'standard' as const };

    const result = calculateVolatility(returns, options);

    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.method).toBe('standard');
  });
});
