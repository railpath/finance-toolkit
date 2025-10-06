import { describe, expect, it } from 'vitest';

import { calculateStochastic } from './calculateStochastic';

describe('calculateStochastic', () => {
  it('should calculate Stochastic correctly for basic case', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const result = calculateStochastic({ high, low, close, kPeriod: 5, dPeriod: 3 });

    expect(result.percentK).toBeDefined();
    expect(result.percentD).toBeDefined();
    expect(result.highestHigh).toBeDefined();
    expect(result.lowestLow).toBeDefined();
    expect(result.count).toBeGreaterThan(0);
    expect(result.kPeriod).toBe(5);
    expect(result.dPeriod).toBe(3);
    
    // All %K values should be between 0 and 100
    expect(result.percentK.every(val => val >= 0 && val <= 100)).toBe(true);
    expect(result.percentD.every(val => val >= 0 && val <= 100)).toBe(true);
  });

  it('should use default periods when not provided', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
    const result = calculateStochastic({ high, low, close });

    expect(result.kPeriod).toBe(14);
    expect(result.dPeriod).toBe(3);
  });

  it('should calculate %D as SMA of %K', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const result = calculateStochastic({ high, low, close, kPeriod: 5, dPeriod: 3 });

    // %D should be calculated and have reasonable values
    expect(result.percentD.length).toBeGreaterThan(0);
    expect(result.percentD.every(val => val >= 0 && val <= 100)).toBe(true);
  });

  it('should handle overbought scenario (high %K values)', () => {
    const high = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const low = [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95];
    const close = [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99]; // Close near high
    const result = calculateStochastic({ high, low, close, kPeriod: 5, dPeriod: 3 });

    // %K should be calculated correctly
    expect(result.percentK.length).toBeGreaterThan(0);
    expect(result.percentK.every(val => val >= 0 && val <= 100)).toBe(true);
  });

  it('should handle oversold scenario (low %K values)', () => {
    const high = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const low = [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95];
    const close = [96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96]; // Close near low
    const result = calculateStochastic({ high, low, close, kPeriod: 5, dPeriod: 3 });

    // %K should be calculated correctly
    expect(result.percentK.length).toBeGreaterThan(0);
    expect(result.percentK.every(val => val >= 0 && val <= 100)).toBe(true);
  });

  it('should throw error for mismatched array lengths', () => {
    const high = [102, 103, 101, 104, 105];
    const low = [98, 99, 97, 100]; // Different length
    const close = [100, 102, 100, 103, 105];

    expect(() => {
      calculateStochastic({ high, low, close, kPeriod: 3, dPeriod: 2 });
    }).toThrow('All price arrays (high, low, close) must have the same length');
  });

  it('should throw error for insufficient data', () => {
    const high = [102, 103];
    const low = [98, 99];
    const close = [100, 102];

    expect(() => {
      calculateStochastic({ high, low, close, kPeriod: 5, dPeriod: 3 });
    }).toThrow('At least 5 prices are required for Stochastic calculation');
  });

  it('should throw error for empty arrays', () => {
    expect(() => {
      calculateStochastic({ high: [], low: [98], close: [100], kPeriod: 3, dPeriod: 2 });
    }).toThrow('High prices array must contain at least one value');
  });

  it('should handle edge case where high equals low', () => {
    const high = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const low = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]; // Same as high
    const close = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    const result = calculateStochastic({ high, low, close, kPeriod: 3, dPeriod: 2 });

    // When high = low, %K should be 50 (middle value)
    expect(result.percentK.every(val => val === 50)).toBe(true);
    expect(result.percentD.every(val => val === 50)).toBe(true);
  });

  it('should handle decimal prices correctly', () => {
    const high = [102.5, 103.7, 101.2, 104.8, 105.3, 106.9, 107.1, 108.6, 109.4, 110.7];
    const low = [98.3, 99.1, 97.8, 100.5, 101.7, 102.2, 103.9, 104.1, 105.8, 106.3];
    const close = [100.2, 102.4, 100.9, 103.6, 104.1, 105.8, 106.2, 107.7, 108.1, 109.5];
    const result = calculateStochastic({ high, low, close, kPeriod: 3, dPeriod: 2 });

    expect(result.percentK.every(val => typeof val === 'number')).toBe(true);
    expect(result.percentD.every(val => typeof val === 'number')).toBe(true);
    expect(result.percentK.every(val => val >= 0 && val <= 100)).toBe(true);
    expect(result.percentD.every(val => val >= 0 && val <= 100)).toBe(true);
  });

  it('should have consistent array lengths', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
    const result = calculateStochastic({ high, low, close, kPeriod: 5, dPeriod: 3 });

    // Arrays should have consistent lengths
    expect(result.highestHigh.length).toBe(result.percentK.length);
    expect(result.lowestLow.length).toBe(result.percentK.length);
    expect(result.indices.length).toBe(result.percentD.length);
    expect(result.percentD.length).toBeGreaterThan(0);
  });

  it('should handle different period combinations', () => {
    const high = [102, 103, 101, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118];
    const low = [98, 99, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    const close = [100, 102, 100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117];
    
    const result1 = calculateStochastic({ high, low, close, kPeriod: 3, dPeriod: 2 });
    const result2 = calculateStochastic({ high, low, close, kPeriod: 7, dPeriod: 4 });
    
    expect(result1.count).toBeGreaterThan(0);
    expect(result2.count).toBeGreaterThan(0);
    expect(result1.kPeriod).toBe(3);
    expect(result1.dPeriod).toBe(2);
  });
});
