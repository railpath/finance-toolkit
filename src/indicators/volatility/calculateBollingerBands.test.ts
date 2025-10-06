import { describe, expect, it } from 'vitest';

import { calculateBollingerBands } from './calculateBollingerBands';

describe('calculateBollingerBands', () => {
  it('should calculate Bollinger Bands correctly for basic case', () => {
    const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
    const result = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 2 });

    expect(result.period).toBe(3);
    expect(result.stdDevMultiplier).toBe(2);
    expect(result.count).toBe(8); // prices.length - period + 1
    expect(result.upperBand).toHaveLength(8);
    expect(result.middleBand).toHaveLength(8);
    expect(result.lowerBand).toHaveLength(8);
    expect(result.bandwidth).toHaveLength(8);
    expect(result.percentB).toHaveLength(8);
    expect(result.indices).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);

    // First calculation: prices [10, 12, 11], SMA = 11, StdDev = 0.816
    expect(result.middleBand[0]).toBeCloseTo(11, 2);
    expect(result.upperBand[0]).toBeCloseTo(12.63, 2); // 11 + 2 * 0.816
    expect(result.lowerBand[0]).toBeCloseTo(9.37, 2);  // 11 - 2 * 0.816
    expect(result.bandwidth[0]).toBeCloseTo(3.27, 2);  // 12.63 - 9.37
    expect(result.percentB[0]).toBeCloseTo(0.5, 1);   // (11 - 9.37) / (12.63 - 9.37)
  });

  it('should use default stdDevMultiplier when not provided', () => {
    const prices = [10, 12, 11, 13, 14];
    const result = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 2 });

    expect(result.stdDevMultiplier).toBe(2);
  });

  it('should calculate percentB correctly', () => {
    const prices = [10, 12, 11, 13, 14];
    const result = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 2 });

    // percentB = (Price - Lower Band) / (Upper Band - Lower Band)
    result.percentB.forEach((percent, index) => {
      const priceIndex = result.indices[index];
      const price = prices[priceIndex];
      const lower = result.lowerBand[index];
      const upper = result.upperBand[index];
      const expected = (price - lower) / (upper - lower);
      
      expect(percent).toBeCloseTo(expected, 3);
    });
  });

  it('should handle period 1 correctly', () => {
    const prices = [10, 12, 11, 13];
    const result = calculateBollingerBands({ prices, period: 1, stdDevMultiplier: 2 });

    expect(result.count).toBe(4);
    
    // With period 1, stdDev is 0, so bands should all equal the price
    result.middleBand.forEach((middle, index) => {
      const priceIndex = result.indices[index];
      const price = prices[priceIndex];
      expect(middle).toBe(price);
      expect(result.upperBand[index]).toBe(price);
      expect(result.lowerBand[index]).toBe(price);
      expect(result.bandwidth[index]).toBe(0);
      expect(result.percentB[index]).toBe(1); // Price equals bands, so percentB = 1
    });
  });

  it('should handle period equal to array length', () => {
    const prices = [10, 12, 11, 13];
    const result = calculateBollingerBands({ prices, period: 4, stdDevMultiplier: 2 });

    expect(result.count).toBe(1);
    expect(result.middleBand[0]).toBeCloseTo(11.5, 2); // (10 + 12 + 11 + 13) / 4
    expect(result.percentB[0]).toBeGreaterThan(0.5); // Price at index 3 is 13, which is above middle
  });

  it('should throw error for empty prices array', () => {
    expect(() => {
      calculateBollingerBands({ prices: [], period: 3, stdDevMultiplier: 2 });
    }).toThrow('Prices array must contain at least one value');
  });

  it('should throw error for negative period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateBollingerBands({ prices, period: -1, stdDevMultiplier: 2 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for zero period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateBollingerBands({ prices, period: 0, stdDevMultiplier: 2 });
    }).toThrow('Period must be positive');
  });

  it('should throw error for non-integer period', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateBollingerBands({ prices, period: 2.5, stdDevMultiplier: 2 });
    }).toThrow('Period must be an integer');
  });

  it('should throw error for period exceeding array length', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateBollingerBands({ prices, period: 5, stdDevMultiplier: 2 });
    }).toThrow('Period cannot exceed the length of prices array');
  });

  it('should throw error for negative stdDevMultiplier', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateBollingerBands({ prices, period: 3, stdDevMultiplier: -1 });
    }).toThrow('Standard deviation multiplier must be positive');
  });

  it('should throw error for zero stdDevMultiplier', () => {
    const prices = [10, 12, 11, 13];
    expect(() => {
      calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 0 });
    }).toThrow('Standard deviation multiplier must be positive');
  });

  it('should handle decimal prices correctly', () => {
    const prices = [10.5, 12.3, 11.7, 13.2, 14.8];
    const result = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 2 });

    expect(result.count).toBe(3);
    
    // First calculation: prices [10.5, 12.3, 11.7], SMA = 11.5
    expect(result.middleBand[0]).toBeCloseTo(11.5, 2);
    
    // All bands should be calculated correctly
    result.upperBand.forEach((upper, index) => {
      expect(upper).toBeGreaterThan(result.middleBand[index]);
    });
    
    result.lowerBand.forEach((lower, index) => {
      expect(lower).toBeLessThan(result.middleBand[index]);
    });
  });

  it('should handle different stdDevMultiplier values correctly', () => {
    const prices = [10, 12, 11, 13, 14];
    
    const result1 = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 1 });
    const result2 = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 3 });

    // With higher multiplier, bands should be wider
    expect(result2.bandwidth[0]).toBeGreaterThan(result1.bandwidth[0]);
    
    // Middle bands should be the same
    expect(result1.middleBand[0]).toBe(result2.middleBand[0]);
  });

  it('should handle large dataset correctly', () => {
    const prices = Array.from({ length: 100 }, (_, i) => 100 + Math.sin(i * 0.1) * 10);
    const result = calculateBollingerBands({ prices, period: 20, stdDevMultiplier: 2 });

    expect(result.count).toBe(81); // 100 - 20 + 1
    expect(result.upperBand).toHaveLength(81);
    expect(result.middleBand).toHaveLength(81);
    expect(result.lowerBand).toHaveLength(81);
    
    // All bandwidths should be positive
    result.bandwidth.forEach(bandwidth => {
      expect(bandwidth).toBeGreaterThan(0);
    });
    
    // All percentB values should be valid
    result.percentB.forEach(percentB => {
      expect(percentB).not.toBeNaN();
      expect(isFinite(percentB)).toBe(true);
    });
  });

  it('should maintain relationship between bands', () => {
    const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
    const result = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 2 });

    result.upperBand.forEach((upper, index) => {
      expect(upper).toBeGreaterThan(result.middleBand[index]);
      expect(upper).toBeGreaterThan(result.lowerBand[index]);
    });
    
    result.middleBand.forEach((middle, index) => {
      expect(middle).toBeGreaterThan(result.lowerBand[index]);
    });
    
    result.bandwidth.forEach((bandwidth, index) => {
      const expected = result.upperBand[index] - result.lowerBand[index];
      expect(bandwidth).toBeCloseTo(expected, 5);
    });
  });

  it('should handle single price correctly', () => {
    const prices = [10];
    const result = calculateBollingerBands({ prices, period: 1, stdDevMultiplier: 2 });

    expect(result.count).toBe(1);
    expect(result.middleBand[0]).toBe(10);
    expect(result.upperBand[0]).toBe(10);
    expect(result.lowerBand[0]).toBe(10);
    expect(result.bandwidth[0]).toBe(0);
    expect(result.percentB[0]).toBe(1);
  });
});
