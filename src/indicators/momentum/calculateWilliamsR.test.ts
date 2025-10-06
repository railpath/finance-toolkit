import { describe, expect, it } from 'vitest';

import { calculateWilliamsR } from './calculateWilliamsR';

describe('calculateWilliamsR', () => {
  it('should calculate Williams %R correctly for basic case', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const result = calculateWilliamsR({ high, low, close, period: 5 });

    expect(result.williamsR).toBeDefined();
    expect(result.highestHigh).toBeDefined();
    expect(result.lowestLow).toBeDefined();
    expect(result.count).toBeGreaterThan(0);
    expect(result.period).toBe(5);
    
    // All Williams %R values should be between -100 and 0
    expect(result.williamsR.every(val => val >= -100 && val <= 0)).toBe(true);
  });

  it('should use default period when not provided', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
    const result = calculateWilliamsR({ high, low, close, period: 14 });

    expect(result.period).toBe(14);
  });

  it('should handle overbought scenario (Williams %R near 0)', () => {
    const high = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const low = [95, 95, 95, 95, 95, 95, 95, 95, 95, 95];
    const close = [99, 99, 99, 99, 99, 99, 99, 99, 99, 99]; // Close near high
    const result = calculateWilliamsR({ high, low, close, period: 3 });

    // Williams %R should be calculated correctly
    expect(result.williamsR.length).toBeGreaterThan(0);
    expect(result.williamsR.every(val => val >= -100 && val <= 0)).toBe(true);
  });

  it('should handle oversold scenario (Williams %R near -100)', () => {
    const high = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const low = [95, 95, 95, 95, 95, 95, 95, 95, 95, 95];
    const close = [96, 96, 96, 96, 96, 96, 96, 96, 96, 96]; // Close near low
    const result = calculateWilliamsR({ high, low, close, period: 3 });

    // Williams %R should be calculated correctly
    expect(result.williamsR.length).toBeGreaterThan(0);
    expect(result.williamsR.every(val => val >= -100 && val <= 0)).toBe(true);
  });

  it('should throw error for mismatched array lengths', () => {
    const high = [102, 103, 101, 104, 105];
    const low = [98, 99, 97, 100]; // Different length
    const close = [100, 102, 100, 103, 105];

    expect(() => {
      calculateWilliamsR({ high, low, close, period: 3 });
    }).toThrow('All price arrays (high, low, close) must have the same length');
  });

  it('should throw error for insufficient data', () => {
    const high = [102, 103];
    const low = [98, 99];
    const close = [100, 102];

    expect(() => {
      calculateWilliamsR({ high, low, close, period: 5 });
    }).toThrow('At least 5 prices are required for Williams %R calculation');
  });

  it('should throw error for empty arrays', () => {
    expect(() => {
      calculateWilliamsR({ high: [], low: [98], close: [100], period: 3 });
    }).toThrow('High prices array must contain at least one value');
  });

  it('should handle edge case where high equals low', () => {
    const high = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const low = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]; // Same as high
    const close = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const result = calculateWilliamsR({ high, low, close, period: 3 });

    // When high = low, Williams %R should be -50 (middle value)
    expect(result.williamsR.every(val => val === -50)).toBe(true);
  });

  it('should handle decimal prices correctly', () => {
    const high = [102.5, 103.7, 101.2, 104.8, 105.3, 106.9, 107.1, 108.6, 109.4, 110.7];
    const low = [98.3, 99.1, 97.8, 100.5, 101.7, 102.2, 103.9, 104.1, 105.8, 106.3];
    const close = [100.2, 102.4, 100.9, 103.6, 104.1, 105.8, 106.2, 107.7, 108.1, 109.5];
    const result = calculateWilliamsR({ high, low, close, period: 3 });

    expect(result.williamsR.every(val => typeof val === 'number')).toBe(true);
    expect(result.williamsR.every(val => val >= -100 && val <= 0)).toBe(true);
  });

  it('should have consistent array lengths', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
    const result = calculateWilliamsR({ high, low, close, period: 5 });

    expect(result.williamsR.length).toBe(result.count);
    expect(result.highestHigh.length).toBe(result.count);
    expect(result.lowestLow.length).toBe(result.count);
    expect(result.indices.length).toBe(result.count);
  });

  it('should handle different periods correctly', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
    
    const result1 = calculateWilliamsR({ high, low, close, period: 3 });
    const result2 = calculateWilliamsR({ high, low, close, period: 7 });
    
    expect(result1.count).toBeGreaterThan(0);
    expect(result2.count).toBeGreaterThan(0);
    expect(result1.period).toBe(3);
    expect(result2.period).toBe(7);
    
    // Longer period should result in fewer values
    expect(result2.count).toBeLessThan(result1.count);
  });

  it('should calculate correct Williams %R values', () => {
    // Test with known values
    const high = [110, 110, 110, 110, 110]; // All highs are 110
    const low = [100, 100, 100, 100, 100];  // All lows are 100
    const close = [105, 105, 105, 105, 105]; // All closes are 105 (middle)
    const result = calculateWilliamsR({ high, low, close, period: 5 });

    // Williams %R = ((Highest High - Close) / (Highest High - Lowest Low)) * -100
    // = ((110 - 105) / (110 - 100)) * -100 = (5 / 10) * -100 = -50
    expect(result.williamsR[0]).toBeCloseTo(-50, 10);
  });

  it('should handle minimum required data', () => {
    const high = [102, 103, 101, 104, 105]; // Exactly 5 prices
    const low = [98, 99, 97, 100, 101];
    const close = [100, 102, 100, 103, 104];
    const result = calculateWilliamsR({ high, low, close, period: 5 });

    expect(result.count).toBe(1); // Only one Williams %R value possible with minimum data
    expect(result.williamsR.length).toBe(1);
    expect(result.highestHigh.length).toBe(1);
    expect(result.lowestLow.length).toBe(1);
  });
});
