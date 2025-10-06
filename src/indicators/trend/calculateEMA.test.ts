import { describe, expect, it } from 'vitest';

import { calculateEMA } from './calculateEMA';

describe('calculateEMA', () => {
  it('should calculate EMA correctly for basic case', () => {
    const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
    const result = calculateEMA({ prices, period: 3 });

    expect(result.period).toBe(3);
    expect(result.smoothingFactor).toBeCloseTo(0.5, 3); // 2 / (3 + 1) = 0.5
    expect(result.count).toBe(10);
    expect(result.ema).toHaveLength(10);

    // First EMA should equal first price
    expect(result.ema[0]).toBe(10);
    
    // Second EMA: (12 - 10) * 0.5 + 10 = 11
    expect(result.ema[1]).toBe(11);
    
    // Third EMA: (11 - 11) * 0.5 + 11 = 11
    expect(result.ema[2]).toBe(11);
    
    // Fourth EMA: (13 - 11) * 0.5 + 11 = 12
    expect(result.ema[3]).toBe(12);
  });

  it('should calculate EMA correctly for period 1', () => {
    const prices = [10, 12, 11, 13];
    const result = calculateEMA({ prices, period: 1 });

    expect(result.period).toBe(1);
    expect(result.smoothingFactor).toBe(1); // 2 / (1 + 1) = 1
    expect(result.count).toBe(4);
    expect(result.ema).toEqual(prices); // EMA with period 1 should equal original prices
  });

  it('should handle single price correctly', () => {
    const prices = [10];
    const result = calculateEMA({ prices, period: 1 });

    expect(result.period).toBe(1);
    expect(result.count).toBe(1);
    expect(result.ema[0]).toBe(10);
    expect(result.smoothingFactor).toBe(1);
  });

  it('should throw error for empty prices array', () => {
    expect(() => {
      calculateEMA({ prices: [], period: 3 });
    }).toThrow('Prices array must contain at least one value');
  });

  it('should throw error for negative period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateEMA({ prices, period: -1 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for zero period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateEMA({ prices, period: 0 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for non-integer period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateEMA({ prices, period: 2.5 });
    }).toThrow('Period must be an integer');
  });

  it('should throw error for period exceeding array length', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateEMA({ prices, period: 5 });
    }).toThrow('Period cannot exceed the length of prices array');
  });

  it('should handle decimal prices correctly', () => {
    const prices = [10.5, 12.3, 11.7, 13.2, 14.8];
    const result = calculateEMA({ prices, period: 3 });

    expect(result.ema[0]).toBe(10.5);
    expect(result.ema[1]).toBeCloseTo(11.4, 2); // (12.3 - 10.5) * 0.5 + 10.5
    expect(result.ema[2]).toBeCloseTo(11.55, 2); // (11.7 - 11.4) * 0.5 + 11.4
  });

  it('should calculate smoothing factor correctly for different periods', () => {
    const prices = [10, 12, 11, 13];
    
    const result3 = calculateEMA({ prices, period: 3 });
    expect(result3.smoothingFactor).toBeCloseTo(0.5, 3); // 2 / (3 + 1)
    
  });

  it('should handle increasing prices correctly', () => {
    const prices = [10, 11, 12, 13, 14, 15];
    const result = calculateEMA({ prices, period: 3 });

    // EMA should follow the trend but be smoothed
    expect(result.ema[0]).toBe(10);
    expect(result.ema[1]).toBeCloseTo(10.5, 2);
    expect(result.ema[2]).toBeCloseTo(11.25, 2);
    expect(result.ema[3]).toBeCloseTo(12.125, 2);
    expect(result.ema[4]).toBeCloseTo(13.0625, 4);
    expect(result.ema[5]).toBeCloseTo(14.03125, 5);
  });

  it('should handle decreasing prices correctly', () => {
    const prices = [15, 14, 13, 12, 11, 10];
    const result = calculateEMA({ prices, period: 3 });

    // EMA should follow the downward trend but be smoothed
    expect(result.ema[0]).toBe(15);
    expect(result.ema[1]).toBeCloseTo(14.5, 2);
    expect(result.ema[2]).toBeCloseTo(13.75, 2);
    expect(result.ema[3]).toBeCloseTo(12.875, 2);
    expect(result.ema[4]).toBeCloseTo(11.9375, 4);
    expect(result.ema[5]).toBeCloseTo(10.96875, 5);
  });

  it('should be more responsive than SMA for recent price changes', () => {
    const prices = [10, 10, 10, 10, 20]; // Sudden jump at the end
    const emaResult = calculateEMA({ prices, period: 3 });
    
    // EMA should respond more to the recent price change
    expect(emaResult.ema[4]).toBeGreaterThanOrEqual(15); // Should be closer to 20 than SMA would be
  });
});
