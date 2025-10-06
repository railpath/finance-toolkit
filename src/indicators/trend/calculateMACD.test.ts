import { describe, expect, it } from 'vitest';

import { calculateMACD } from './calculateMACD';

describe('calculateMACD', () => {
  it('should calculate MACD correctly for basic case', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115, 117, 116, 118, 120, 119, 121, 123, 122, 124, 126, 125, 127, 129, 128, 130, 132, 131, 133, 135, 134, 137, 136, 138, 140, 139, 141, 143, 142, 144, 146, 145, 147, 149, 148, 150];
    const result = calculateMACD({ prices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });

    expect(result.macdLine).toBeDefined();
    expect(result.signalLine).toBeDefined();
    expect(result.histogram).toBeDefined();
    expect(result.count).toBeGreaterThan(0);
    expect(result.fastPeriod).toBe(12);
    expect(result.slowPeriod).toBe(26);
    expect(result.signalPeriod).toBe(9);
    
    // All arrays should have the same length
    expect(result.macdLine.length).toBe(result.signalLine.length);
    expect(result.signalLine.length).toBe(result.histogram.length);
    expect(result.histogram.length).toBe(result.count);
  });

  it('should use default periods when not provided', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115, 117, 116, 118, 120, 119, 121, 123, 122, 124, 126, 125, 127, 129, 128, 130, 132, 131, 133, 135, 134];
    const result = calculateMACD({ prices });

    expect(result.fastPeriod).toBe(12);
    expect(result.slowPeriod).toBe(26);
    expect(result.signalPeriod).toBe(9);
  });

  it('should calculate histogram correctly (MACD - Signal)', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115, 117, 116, 118, 120, 119, 121, 123, 122, 124, 126, 125, 127, 129, 128, 130, 132, 131, 133, 135, 134];
    const result = calculateMACD({ prices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });

    // Verify histogram calculation
    for (let i = 0; i < result.histogram.length; i++) {
      const expectedHistogram = result.macdLine[i] - result.signalLine[i];
      expect(result.histogram[i]).toBeCloseTo(expectedHistogram, 10);
    }
  });

  it('should throw error for insufficient data', () => {
    const prices = [100, 102, 101]; // Too few prices
    
    expect(() => {
      calculateMACD({ prices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    }).toThrow('At least 34 prices are required for MACD calculation');
  });

  it('should throw error when slow period <= fast period', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115, 117, 116, 118, 120, 119, 121, 123, 122, 124, 126, 125, 127, 129, 128, 130];
    
    expect(() => {
      calculateMACD({ prices, fastPeriod: 26, slowPeriod: 12, signalPeriod: 9 });
    }).toThrow('Slow period must be greater than fast period');
  });

  it('should throw error for empty prices array', () => {
    expect(() => {
      calculateMACD({ prices: [], fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    }).toThrow('Prices array must contain at least one value');
  });

  it('should throw error for negative periods', () => {
    const prices = [100, 102, 101, 103, 105];
    
    expect(() => {
      calculateMACD({ prices, fastPeriod: -12, slowPeriod: 26, signalPeriod: 9 });
    }).toThrow('Fast period must be positive');
  });

  it('should handle minimum required data correctly', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115, 117, 116, 118, 120, 119, 121, 123, 122, 124, 126, 125, 127, 129, 128, 130, 132, 131, 133]; // Exactly 34 prices
    const result = calculateMACD({ prices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });

    expect(result.count).toBe(1); // Only one MACD value possible with minimum data
    expect(result.macdLine.length).toBe(1);
    expect(result.signalLine.length).toBe(1);
    expect(result.histogram.length).toBe(1);
  });

  it('should handle decimal prices correctly', () => {
    const prices = [100.5, 102.3, 101.7, 103.1, 105.8, 104.2, 106.9, 108.4, 107.6, 109.2, 111.5, 110.8, 112.1, 114.7, 113.3, 115.9, 117.2, 116.6, 118.8, 120.3, 119.7, 121.4, 123.6, 122.9, 124.2, 126.8, 125.1, 127.7, 129.4, 128.8, 130.5, 132.2, 131.6, 133.9, 135.1, 134.7];
    const result = calculateMACD({ prices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });

    expect(result.macdLine.every(val => typeof val === 'number')).toBe(true);
    expect(result.signalLine.every(val => typeof val === 'number')).toBe(true);
    expect(result.histogram.every(val => typeof val === 'number')).toBe(true);
  });

  it('should have consistent array lengths', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115, 117, 116, 118, 120, 119, 121, 123, 122, 124, 126, 125, 127, 129, 128, 130, 132, 131, 133, 135, 134, 137, 136, 138, 140, 139, 141, 143, 142, 144, 146, 145, 147, 149, 148, 150];
    const result = calculateMACD({ prices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });

    expect(result.macdLine.length).toBe(result.signalLine.length);
    expect(result.signalLine.length).toBe(result.histogram.length);
    expect(result.histogram.length).toBe(result.count);
    expect(result.indices.length).toBe(result.count);
  });

  it('should handle different period combinations', () => {
    const prices = [100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 111, 110, 112, 114, 113, 115, 117, 116, 118, 120, 119, 121, 123, 122, 124, 126, 125, 127, 129, 128, 130, 132, 131, 133, 135, 134, 137, 136, 138, 140, 139, 141, 143, 142, 144, 146, 145, 147, 149, 148, 150];
    
    const result1 = calculateMACD({ prices, fastPeriod: 5, slowPeriod: 10, signalPeriod: 3 });
    const result2 = calculateMACD({ prices, fastPeriod: 8, slowPeriod: 20, signalPeriod: 5 });
    
    expect(result1.count).toBeGreaterThan(0);
    expect(result2.count).toBeGreaterThan(0);
    expect(result1.fastPeriod).toBe(5);
    expect(result1.slowPeriod).toBe(10);
    expect(result1.signalPeriod).toBe(3);
  });
});
