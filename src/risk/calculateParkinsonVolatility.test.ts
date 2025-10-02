import { describe, expect, it } from 'vitest';

import { calculateParkinsonVolatility } from './calculateParkinsonVolatility';

describe('calculateParkinsonVolatility', () => {
  it('should calculate Parkinson volatility for realistic OHLC data', () => {
    const highPrices = [102, 103, 104, 102, 105];
    const lowPrices = [99, 100, 101, 100, 102];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate Parkinson volatility for identical high-low prices', () => {
    const highPrices = [100, 100, 100, 100, 100];
    const lowPrices = [100, 100, 100, 100, 100];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBe(0); // No volatility when high = low
    expect(result).toBeDefined();
  });

  it('should calculate Parkinson volatility for increasing prices', () => {
    const highPrices = [100, 101, 102, 103, 104];
    const lowPrices = [99, 100, 101, 102, 103];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should calculate Parkinson volatility for decreasing prices', () => {
    const highPrices = [104, 103, 102, 101, 100];
    const lowPrices = [103, 102, 101, 100, 99];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle single price pair', () => {
    const highPrices = [102];
    const lowPrices = [98];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle two price pairs', () => {
    const highPrices = [102, 105];
    const lowPrices = [98, 101];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle large dataset', () => {
    const highPrices = Array.from({ length: 1000 }, (_, i) => 100 + Math.sin(i / 100) * 10 + Math.random() * 5);
    const lowPrices = Array.from({ length: 1000 }, (_, i) => 100 + Math.sin(i / 100) * 10 - Math.random() * 5);

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should be consistent for same inputs', () => {
    const highPrices = [102, 103, 104, 102, 105];
    const lowPrices = [99, 100, 101, 100, 102];

    const result1 = calculateParkinsonVolatility(highPrices, lowPrices);
    const result2 = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle edge case with very small price differences', () => {
    const highPrices = [100.01, 100.02, 100.03, 100.04, 100.05];
    const lowPrices = [99.99, 100.00, 100.01, 100.02, 100.03];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case with very large price differences', () => {
    const highPrices = [200, 300, 400, 500, 600];
    const lowPrices = [100, 200, 300, 400, 500];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should throw error for unequal array lengths', () => {
    const highPrices = [102, 103, 104];
    const lowPrices = [99, 100];

    expect(() => calculateParkinsonVolatility(highPrices, lowPrices))
      .toThrow('High and low price arrays must have equal length');
  });

  it('should throw error for zero prices', () => {
    const highPrices = [100, 0, 102];
    const lowPrices = [99, 1, 101];

    expect(() => calculateParkinsonVolatility(highPrices, lowPrices))
      .toThrow('Prices must be positive');
  });

  it('should throw error for negative prices', () => {
    const highPrices = [100, -101, 102];
    const lowPrices = [99, -100, 101];

    expect(() => calculateParkinsonVolatility(highPrices, lowPrices))
      .toThrow('Prices must be positive');
  });

  it('should handle edge case with high price equal to low price', () => {
    const highPrices = [100, 100, 100];
    const lowPrices = [100, 100, 100];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBe(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case with very close prices', () => {
    const highPrices = [100.0001, 100.0002, 100.0003];
    const lowPrices = [99.9999, 100.0000, 100.0001];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should validate mathematical formula correctness', () => {
    const highPrices = [102, 104, 106];
    const lowPrices = [98, 100, 102];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    // Manual calculation verification
    const sum = Math.pow(Math.log(102/98), 2) + Math.pow(Math.log(104/100), 2) + Math.pow(Math.log(106/102), 2);
    const expectedVariance = sum / (3 * 4 * Math.log(2));
    const expectedVolatility = Math.sqrt(expectedVariance);

    expect(result).toBeCloseTo(expectedVolatility, 5);
  });

  it('should handle realistic stock market scenario', () => {
    // Simulate daily OHLC data for a stock
    const highPrices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109];
    const lowPrices = [98, 100, 99, 101, 103, 102, 104, 106, 105, 107];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle crypto-like volatile prices', () => {
    const highPrices = [100, 150, 120, 180, 140, 200, 160, 100, 80, 120];
    const lowPrices = [90, 140, 110, 170, 130, 190, 150, 90, 70, 110];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case with empty arrays', () => {
    const highPrices: number[] = [];
    const lowPrices: number[] = [];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeNaN(); // Should be NaN due to division by zero
  });

  it('should handle edge case with one price pair', () => {
    const highPrices = [102];
    const lowPrices = [98];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case with alternating high-low patterns', () => {
    const highPrices = [102, 98, 104, 96, 106];
    const lowPrices = [98, 102, 96, 104, 94];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case with monotonically increasing prices', () => {
    const highPrices = [100, 101, 102, 103, 104, 105];
    const lowPrices = [99, 100, 101, 102, 103, 104];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case with monotonically decreasing prices', () => {
    const highPrices = [105, 104, 103, 102, 101, 100];
    const lowPrices = [104, 103, 102, 101, 100, 99];

    const result = calculateParkinsonVolatility(highPrices, lowPrices);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });
});
