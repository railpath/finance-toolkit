import { describe, it, expect } from 'vitest';
import { calculateSMA } from './calculateSMA';

describe('calculateSMA', () => {
  it('should calculate SMA correctly for basic case', () => {
    const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
    const result = calculateSMA({ prices, period: 3 });

    expect(result.period).toBe(3);
    expect(result.count).toBe(8); // prices.length - period + 1
    expect(result.sma).toHaveLength(8);
    expect(result.indices).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);

    // First SMA: (10 + 12 + 11) / 3 = 11
    expect(result.sma[0]).toBeCloseTo(11, 2);
    
    // Second SMA: (12 + 11 + 13) / 3 = 12
    expect(result.sma[1]).toBeCloseTo(12, 2);
    
    // Third SMA: (11 + 13 + 14) / 3 = 12.67
    expect(result.sma[2]).toBeCloseTo(12.67, 2);
  });

  it('should calculate SMA correctly for period 1', () => {
    const prices = [10, 12, 11, 13];
    const result = calculateSMA({ prices, period: 1 });

    expect(result.period).toBe(1);
    expect(result.count).toBe(4);
    expect(result.sma).toEqual(prices); // SMA with period 1 should equal original prices
    expect(result.indices).toEqual([0, 1, 2, 3]);
  });

  it('should calculate SMA correctly for period equal to array length', () => {
    const prices = [10, 12, 11, 13];
    const result = calculateSMA({ prices, period: 4 });

    expect(result.period).toBe(4);
    expect(result.count).toBe(1);
    expect(result.sma[0]).toBeCloseTo(11.5, 2); // (10 + 12 + 11 + 13) / 4
    expect(result.indices).toEqual([3]);
  });

  it('should handle single price correctly', () => {
    const prices = [10];
    const result = calculateSMA({ prices, period: 1 });

    expect(result.period).toBe(1);
    expect(result.count).toBe(1);
    expect(result.sma[0]).toBe(10);
    expect(result.indices).toEqual([0]);
  });

  it('should throw error for empty prices array', () => {
    expect(() => {
      calculateSMA({ prices: [], period: 3 });
    }).toThrow('Prices array must contain at least one value');
  });

  it('should throw error for negative period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateSMA({ prices, period: -1 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for zero period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateSMA({ prices, period: 0 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for non-integer period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateSMA({ prices, period: 2.5 });
    }).toThrow('Period must be an integer');
  });

  it('should throw error for period exceeding array length', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateSMA({ prices, period: 5 });
    }).toThrow('Period cannot exceed the length of prices array');
  });

  it('should handle decimal prices correctly', () => {
    const prices = [10.5, 12.3, 11.7, 13.2, 14.8];
    const result = calculateSMA({ prices, period: 3 });

    expect(result.sma[0]).toBeCloseTo(11.5, 2); // (10.5 + 12.3 + 11.7) / 3
    expect(result.sma[1]).toBeCloseTo(12.4, 2); // (12.3 + 11.7 + 13.2) / 3
    expect(result.sma[2]).toBeCloseTo(13.23, 2); // (11.7 + 13.2 + 14.8) / 3
  });

  it('should handle large dataset correctly', () => {
    const prices = Array.from({ length: 100 }, (_, i) => i + 1);
    const result = calculateSMA({ prices, period: 10 });

    expect(result.count).toBe(91); // 100 - 10 + 1
    expect(result.indices).toHaveLength(91);
    
    // First SMA should be average of first 10 numbers: (1+2+...+10)/10 = 5.5
    expect(result.sma[0]).toBeCloseTo(5.5, 2);
    
    // Last SMA should be average of last 10 numbers: (91+92+...+100)/10 = 95.5
    expect(result.sma[90]).toBeCloseTo(95.5, 2);
  });
});
