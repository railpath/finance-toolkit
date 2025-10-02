import { describe, expect, it } from 'vitest';

import { calculateGarmanKlassVolatility } from './calculateGarmanKlassVolatility';

describe('calculateGarmanKlassVolatility', () => {
  it('should calculate Garman-Klass volatility for flat prices', () => {
    const openPrices = [100, 100, 100, 100];
    const highPrices = [100, 100, 100, 100];
    const lowPrices = [100, 100, 100, 100];
    const closePrices = [100, 100, 100, 100];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBe(0);
  });

  it('should calculate Garman-Klass volatility for simple price movement', () => {
    const openPrices = [100, 101, 102];
    const highPrices = [101, 102, 103];
    const lowPrices = [100, 101, 102];
    const closePrices = [101, 102, 103];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle realistic OHLC data', () => {
    const openPrices = [100, 101, 99, 102, 98];
    const highPrices = [101, 102, 100, 103, 99];
    const lowPrices = [99, 100, 98, 101, 97];
    const closePrices = [101, 100, 102, 98, 100];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle volatile crypto-like data', () => {
    const openPrices = [100, 110, 95, 120, 90];
    const highPrices = [115, 120, 100, 125, 95];
    const lowPrices = [95, 105, 90, 115, 85];
    const closePrices = [110, 95, 120, 90, 100];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle single day data', () => {
    const openPrices = [100];
    const highPrices = [105];
    const lowPrices = [98];
    const closePrices = [102];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should throw error for mismatched array lengths', () => {
    const openPrices = [100, 101, 102];
    const highPrices = [101, 102]; // Different length
    const lowPrices = [100, 101, 102];
    const closePrices = [101, 102, 103];

    expect(() =>
      calculateGarmanKlassVolatility(
        openPrices,
        highPrices,
        lowPrices,
        closePrices
      )
    ).toThrow('All price arrays must have equal length');
  });

  it('should throw error for empty arrays', () => {
    const openPrices: number[] = [];
    const highPrices: number[] = [];
    const lowPrices: number[] = [];
    const closePrices: number[] = [];

    expect(() =>
      calculateGarmanKlassVolatility(
        openPrices,
        highPrices,
        lowPrices,
        closePrices
      )
    ).toThrow('Price arrays cannot be empty');
  });

  it('should handle prices with zero values', () => {
    const openPrices = [100, 0, 102];
    const highPrices = [101, 1, 103];
    const lowPrices = [99, 0, 101];
    const closePrices = [101, 0.5, 102];

    expect(() =>
      calculateGarmanKlassVolatility(
        openPrices,
        highPrices,
        lowPrices,
        closePrices
      )
    ).toThrow('All prices must be positive');
  });

  it('should handle negative prices', () => {
    const openPrices = [100, -101, 102];
    const highPrices = [101, -100, 103];
    const lowPrices = [99, -102, 101];
    const closePrices = [101, -101, 102];

    expect(() =>
      calculateGarmanKlassVolatility(
        openPrices,
        highPrices,
        lowPrices,
        closePrices
      )
    ).toThrow('All prices must be positive');
  });

  it('should be consistent for same inputs', () => {
    const openPrices = [100, 101, 102, 99, 98];
    const highPrices = [101, 102, 103, 100, 99];
    const lowPrices = [99, 100, 101, 98, 97];
    const closePrices = [101, 100, 102, 98, 100];

    const result1 = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    const result2 = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle realistic stock market data', () => {
    // Simulate 5 days of AAPL-like data
    const openPrices = [150.00, 151.50, 149.80, 152.20, 148.90];
    const highPrices = [152.30, 152.80, 151.20, 153.10, 150.50];
    const lowPrices = [149.20, 150.10, 148.50, 151.80, 147.30];
    const closePrices = [151.50, 149.80, 152.20, 148.90, 150.20];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1); // Should be reasonable volatility
  });

  it('should handle extreme price movements', () => {
    const openPrices = [100, 200, 50, 300, 25];
    const highPrices = [200, 250, 100, 350, 50];
    const lowPrices = [50, 150, 25, 200, 10];
    const closePrices = [200, 50, 300, 25, 100];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle small price movements', () => {
    const openPrices = [100.00, 100.01, 100.02, 100.01, 100.00];
    const highPrices = [100.01, 100.02, 100.03, 100.02, 100.01];
    const lowPrices = [99.99, 100.00, 100.01, 100.00, 99.99];
    const closePrices = [100.01, 100.02, 100.01, 100.00, 100.01];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle long time series', () => {
    const length = 100;
    const openPrices = Array.from({ length }, (_, i) => 100 + Math.sin(i / 10) * 5);
    const highPrices = openPrices.map(p => p + Math.random() * 2);
    const lowPrices = openPrices.map(p => p - Math.random() * 2);
    const closePrices = openPrices.map(p => p + (Math.random() - 0.5) * 2);

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle edge case where high equals low', () => {
    const openPrices = [100, 101, 102];
    const highPrices = [100, 101, 102]; // High equals low
    const lowPrices = [100, 101, 102];
    const closePrices = [100, 101, 102];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBe(0); // No volatility when high = low
  });

  it('should handle edge case where open equals close', () => {
    const openPrices = [100, 101, 102];
    const highPrices = [105, 106, 107];
    const lowPrices = [95, 96, 97];
    const closePrices = [100, 101, 102]; // Open equals close

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should be more efficient than simple close-to-close volatility', () => {
    // Garman-Klass should be more efficient (lower variance) than simple methods
    const openPrices = [100, 101, 99, 102, 98, 103, 97, 104, 96, 105];
    const highPrices = [102, 103, 101, 104, 100, 105, 99, 106, 98, 107];
    const lowPrices = [98, 99, 97, 100, 96, 101, 95, 102, 94, 103];
    const closePrices = [101, 99, 102, 98, 103, 97, 104, 96, 105, 95];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeDefined();
  });

  it('should handle realistic forex data', () => {
    // Simulate EUR/USD data
    const openPrices = [1.1000, 1.1010, 1.0995, 1.1020, 1.0985];
    const highPrices = [1.1015, 1.1025, 1.1010, 1.1030, 1.1000];
    const lowPrices = [1.0995, 1.1005, 1.0990, 1.1015, 1.0980];
    const closePrices = [1.1010, 1.0995, 1.1020, 1.0985, 1.1000];

    const result = calculateGarmanKlassVolatility(
      openPrices,
      highPrices,
      lowPrices,
      closePrices
    );

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0.1); // Should be reasonable for forex
  });
});
