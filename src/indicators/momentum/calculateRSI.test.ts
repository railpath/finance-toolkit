import { describe, it, expect } from 'vitest';
import { calculateRSI } from './calculateRSI';

describe('calculateRSI', () => {
  it('should calculate RSI correctly for basic case', () => {
    const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
    const result = calculateRSI({ prices, period: 3 });

    expect(result.period).toBe(3);
    expect(result.count).toBe(9); // prices.length - 1
    expect(result.rsi).toHaveLength(9);
    expect(result.priceChanges).toHaveLength(9);
    expect(result.gains).toHaveLength(9);
    expect(result.losses).toHaveLength(9);
    expect(result.indices).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // All RSI values should be between 0 and 100
    result.rsi.forEach(rsi => {
      expect(rsi).toBeGreaterThanOrEqual(0);
      expect(rsi).toBeLessThanOrEqual(100);
    });

    // First RSI calculation should start after period
    expect(result.rsi[2]).toBeDefined(); // Index 2 corresponds to price index 3
  });

  it('should calculate RSI correctly for all gains scenario', () => {
    const prices = [10, 12, 14, 16, 18, 20];
    const result = calculateRSI({ prices, period: 3 });

    // All price changes are positive (gains)
    expect(result.priceChanges.every(change => change > 0)).toBe(true);
    expect(result.gains.every(gain => gain > 0)).toBe(true);
    expect(result.losses.every(loss => loss === 0)).toBe(true);

    // RSI should be 100 for all gains scenario
    result.rsi.forEach(rsi => {
      expect(rsi).toBeCloseTo(100, 1);
    });
  });

  it('should calculate RSI correctly for all losses scenario', () => {
    const prices = [20, 18, 16, 14, 12, 10];
    const result = calculateRSI({ prices, period: 3 });

    // All price changes are negative (losses)
    expect(result.priceChanges.every(change => change < 0)).toBe(true);
    expect(result.gains.every(gain => gain === 0)).toBe(true);
    expect(result.losses.every(loss => loss > 0)).toBe(true);

    // RSI should be 0 for all losses scenario
    result.rsi.forEach(rsi => {
      expect(rsi).toBeCloseTo(0, 1);
    });
  });

  it('should calculate RSI correctly for mixed scenario', () => {
    const prices = [10, 12, 10, 14, 12, 16];
    const result = calculateRSI({ prices, period: 2 });

    expect(result.priceChanges).toEqual([2, -2, 4, -2, 4]);
    expect(result.gains).toEqual([2, 0, 4, 0, 4]);
    expect(result.losses).toEqual([0, 2, 0, 2, 0]);
  });

  it('should handle minimum required prices', () => {
    const prices = [10, 12];
    const result = calculateRSI({ prices, period: 1 });

    expect(result.count).toBe(1);
    expect(result.rsi).toHaveLength(1);
    expect(result.rsi[0]).toBeCloseTo(100, 1); // Only gain, no loss
  });

  it('should throw error for insufficient prices', () => {
    const prices = [10];
    expect(() => {
      calculateRSI({ prices, period: 1 });
    }).toThrow('At least 2 prices are required for RSI calculation');
  });

  it('should throw error for empty prices array', () => {
    expect(() => {
      calculateRSI({ prices: [], period: 3 });
    }).toThrow('Prices array must contain at least one value');
  });

  it('should throw error for negative period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateRSI({ prices, period: -1 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for zero period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateRSI({ prices, period: 0 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for non-integer period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateRSI({ prices, period: 2.5 });
    }).toThrow('Period must be an integer');
  });

  it('should throw error for period exceeding (prices.length - 1)', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateRSI({ prices, period: 4 });
    }).toThrow('Period cannot exceed (prices.length - 1)');
  });

  it('should handle decimal prices correctly', () => {
    const prices = [10.5, 12.3, 11.7, 13.2, 14.8];
    const result = calculateRSI({ prices, period: 3 });

    expect(result.priceChanges[0]).toBeCloseTo(1.8, 2); // 12.3 - 10.5
    expect(result.priceChanges[1]).toBeCloseTo(-0.6, 2); // 11.7 - 12.3
    expect(result.gains[0]).toBeCloseTo(1.8, 2);
    expect(result.losses[1]).toBeCloseTo(0.6, 2);
  });

  it('should calculate RSI values correctly for known scenario', () => {
    // Test case from RSI calculation example
    const prices = [44, 44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 47.25, 46.8, 47.5];
    const result = calculateRSI({ prices, period: 10 }); // Use period 10 instead of 14

    // RSI values should be calculated correctly
    expect(result.count).toBe(10);
    expect(result.rsi.every(rsi => rsi >= 0 && rsi <= 100)).toBe(true);
  });

  it('should handle large dataset correctly', () => {
    const prices = Array.from({ length: 100 }, (_, i) => 100 + Math.sin(i * 0.1) * 10);
    const result = calculateRSI({ prices, period: 14 });

    expect(result.count).toBe(99);
    expect(result.rsi).toHaveLength(99);
    
    // All RSI values should be valid
    result.rsi.forEach(rsi => {
      expect(rsi).toBeGreaterThanOrEqual(0);
      expect(rsi).toBeLessThanOrEqual(100);
      expect(rsi).not.toBeNaN();
    });
  });

  it('should handle period 1 correctly', () => {
    const prices = [10, 12, 11, 13];
    const result = calculateRSI({ prices, period: 1 });

    expect(result.count).toBe(3);
    expect(result.rsi).toHaveLength(3);
    
    // With period 1, each RSI is based on single price change
    expect(result.rsi[0]).toBeCloseTo(100, 1); // Gain: 2
    expect(result.rsi[1]).toBeCloseTo(0, 1);   // Loss: -1
    expect(result.rsi[2]).toBeCloseTo(100, 1); // Gain: 2
  });
});
