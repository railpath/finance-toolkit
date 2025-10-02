import { describe, expect, it } from 'vitest';

import { calculateMaxDrawdown } from './calculateMaxDrawdown';

describe('calculateMaxDrawdown', () => {
  it('should calculate max drawdown for simple declining prices', () => {
    const prices = [100, 90, 80, 70, 60];
    const result = calculateMaxDrawdown({ prices });

    // Peak: 100, Trough: 60, MDD = (100-60)/100 = 0.40
    expect(result.maxDrawdown).toBe(40);
    expect(result.maxDrawdownPercent).toBe(0.40);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(4);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(60);
    expect(result.drawdownDuration).toBe(4);
    expect(result.recoveryIndex).toBeNull();
    expect(result.recoveryDuration).toBeNull();
  });

  it('should calculate max drawdown for prices with recovery', () => {
    const prices = [100, 90, 80, 70, 80, 90, 100];
    const result = calculateMaxDrawdown({ prices });

    // Peak: 100, Trough: 70, MDD = (100-70)/100 = 0.30
    expect(result.maxDrawdown).toBe(30);
    expect(result.maxDrawdownPercent).toBe(0.30);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(3);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(70);
    expect(result.drawdownDuration).toBe(3);
    expect(result.recoveryIndex).toBe(6); // Price reaches 100 again
    expect(result.recoveryDuration).toBe(3); // 6 - 3 = 3
  });

  it('should handle no drawdown (monotonically increasing)', () => {
    const prices = [100, 110, 120, 130, 140];
    const result = calculateMaxDrawdown({ prices });

    expect(result.maxDrawdown).toBe(0);
    expect(result.maxDrawdownPercent).toBe(0);
    expect(result.peakIndex).toBe(4);
    expect(result.troughIndex).toBe(0);
    expect(result.peakValue).toBe(100); // Initial peak
    expect(result.troughValue).toBe(100);
    expect(result.drawdownDuration).toBe(-4);
    expect(result.recoveryIndex).toBe(1); // Price reaches peak again
    expect(result.recoveryDuration).toBe(1);
  });

  it('should handle flat prices (no drawdown)', () => {
    const prices = [100, 100, 100, 100, 100];
    const result = calculateMaxDrawdown({ prices });

    expect(result.maxDrawdown).toBe(0);
    expect(result.maxDrawdownPercent).toBe(0);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(0);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(100);
    expect(result.drawdownDuration).toBe(0);
    expect(result.recoveryIndex).toBe(1); // Price reaches peak again
    expect(result.recoveryDuration).toBe(1);
  });

  it('should handle single price', () => {
    const prices = [100];
    
    expect(() => calculateMaxDrawdown({ prices })).toThrow('Need at least 2 prices');
  });

  it('should handle two prices', () => {
    const prices = [100, 80];
    const result = calculateMaxDrawdown({ prices });

    // Peak: 100, Trough: 80, MDD = (100-80)/100 = 0.20
    expect(result.maxDrawdown).toBe(20);
    expect(result.maxDrawdownPercent).toBe(0.20);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(1);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(80);
    expect(result.drawdownDuration).toBe(1);
    expect(result.recoveryIndex).toBeNull();
    expect(result.recoveryDuration).toBeNull();
  });

  it('should find the maximum drawdown across multiple peaks', () => {
    const prices = [100, 80, 90, 70, 60, 80, 100, 50, 40, 60];
    const result = calculateMaxDrawdown({ prices });

    // The maximum drawdown should be from peak 100 to trough 40 = 60%
    expect(result.maxDrawdown).toBe(60);
    expect(result.maxDrawdownPercent).toBe(0.60);
    expect(result.peakIndex).toBe(0); // Peak at index 0 (100)
    expect(result.troughIndex).toBe(8); // Trough at index 8 (40)
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(40);
    expect(result.drawdownDuration).toBe(8); // 8 - 0 = 8
  });

  it('should handle realistic stock market scenario', () => {
    // Simulate a stock that goes up, crashes, and recovers
    const prices = [100, 110, 120, 115, 105, 95, 85, 90, 100, 110, 120];
    const result = calculateMaxDrawdown({ prices });

    // Peak: 120, Trough: 85, MDD = (120-85)/120 = 0.2917
    expect(result.maxDrawdown).toBeCloseTo(35, 0);
    expect(result.maxDrawdownPercent).toBeCloseTo(0.2917, 3);
    expect(result.peakIndex).toBe(2);
    expect(result.troughIndex).toBe(6);
    expect(result.peakValue).toBe(120);
    expect(result.troughValue).toBe(85);
    expect(result.drawdownDuration).toBe(4);
    expect(result.recoveryIndex).toBe(10); // Price reaches 120 again
    expect(result.recoveryDuration).toBe(4); // 10 - 6 = 4
  });

  it('should handle crypto-like volatile prices', () => {
    const prices = [100, 150, 120, 180, 140, 200, 160, 100, 80, 120, 150];
    const result = calculateMaxDrawdown({ prices });

    // Peak: 200, Trough: 80, MDD = (200-80)/200 = 0.60
    expect(result.maxDrawdown).toBe(120);
    expect(result.maxDrawdownPercent).toBe(0.60);
    expect(result.peakIndex).toBe(5);
    expect(result.troughIndex).toBe(8);
    expect(result.peakValue).toBe(200);
    expect(result.troughValue).toBe(80);
    expect(result.drawdownDuration).toBe(3);
    expect(result.recoveryIndex).toBeNull(); // Price doesn't reach 200 again
    expect(result.recoveryDuration).toBeNull();
  });

  it('should handle edge case with zero prices', () => {
    const prices = [100, 0, 50, 75];
    const result = calculateMaxDrawdown({ prices });

    // Peak: 100, Trough: 0, MDD = (100-0)/100 = 1.00
    expect(result.maxDrawdown).toBe(100);
    expect(result.maxDrawdownPercent).toBe(1.00);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(1);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(0);
    expect(result.drawdownDuration).toBe(1);
    expect(result.recoveryIndex).toBeNull();
    expect(result.recoveryDuration).toBeNull();
  });

  it('should handle negative prices', () => {
    const prices = [100, 50, -10, 20, 80];
    const result = calculateMaxDrawdown({ prices });

    // Peak: 100, Trough: -10, MDD = (100-(-10))/100 = 1.10
    expect(result.maxDrawdown).toBe(110);
    expect(result.maxDrawdownPercent).toBe(1.10);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(2);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(-10);
    expect(result.drawdownDuration).toBe(2);
    expect(result.recoveryIndex).toBeNull();
    expect(result.recoveryDuration).toBeNull();
  });

  it('should handle large dataset', () => {
    const prices = Array.from({ length: 1000 }, (_, i) => 
      100 + Math.sin(i / 100) * 50 + (Math.random() - 0.5) * 20
    );
    const result = calculateMaxDrawdown({ prices });

    expect(result.maxDrawdown).toBeGreaterThanOrEqual(0);
    expect(result.maxDrawdownPercent).toBeGreaterThanOrEqual(0);
    expect(result.peakIndex).toBeGreaterThanOrEqual(0);
    expect(result.troughIndex).toBeGreaterThanOrEqual(0);
    expect(result.peakValue).toBeGreaterThan(0);
    expect(result.troughValue).toBeGreaterThan(0);
    // Drawdown duration can be negative if trough comes before peak
    expect(result.drawdownDuration).toBeDefined();
  });

  it('should be consistent for same inputs', () => {
    const prices = [100, 90, 80, 70, 80, 90, 100];
    const result1 = calculateMaxDrawdown({ prices });
    const result2 = calculateMaxDrawdown({ prices });

    expect(result1.maxDrawdown).toBe(result2.maxDrawdown);
    expect(result1.maxDrawdownPercent).toBe(result2.maxDrawdownPercent);
    expect(result1.peakIndex).toBe(result2.peakIndex);
    expect(result1.troughIndex).toBe(result2.troughIndex);
    expect(result1.peakValue).toBe(result2.peakValue);
    expect(result1.troughValue).toBe(result2.troughValue);
    expect(result1.recoveryIndex).toBe(result2.recoveryIndex);
    expect(result1.drawdownDuration).toBe(result2.drawdownDuration);
    expect(result1.recoveryDuration).toBe(result2.recoveryDuration);
  });

  it('should handle edge case with identical peaks', () => {
    const prices = [100, 100, 90, 100, 80, 100];
    const result = calculateMaxDrawdown({ prices });

    // Should find the maximum drawdown from any peak
    expect(result.maxDrawdown).toBe(20);
    expect(result.maxDrawdownPercent).toBe(0.20);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(80);
  });

  it('should handle edge case with identical troughs', () => {
    const prices = [100, 80, 90, 80, 70, 80];
    const result = calculateMaxDrawdown({ prices });

    // Should find the maximum drawdown to any trough
    expect(result.maxDrawdown).toBe(30);
    expect(result.maxDrawdownPercent).toBe(0.30);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(70);
  });

  it('should handle edge case with no recovery', () => {
    const prices = [100, 90, 80, 70, 60, 50];
    const result = calculateMaxDrawdown({ prices });

    expect(result.maxDrawdown).toBe(50);
    expect(result.maxDrawdownPercent).toBe(0.50);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(5);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(50);
    expect(result.recoveryIndex).toBeNull();
    expect(result.recoveryDuration).toBeNull();
  });

  it('should handle edge case with immediate recovery', () => {
    const prices = [100, 80, 100];
    const result = calculateMaxDrawdown({ prices });

    expect(result.maxDrawdown).toBe(20);
    expect(result.maxDrawdownPercent).toBe(0.20);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(1);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(80);
    expect(result.recoveryIndex).toBe(2);
    expect(result.recoveryDuration).toBe(1);
  });

  it('should handle edge case with multiple recoveries', () => {
    const prices = [100, 80, 90, 70, 80, 100, 60, 80, 100];
    const result = calculateMaxDrawdown({ prices });

    // The maximum drawdown should be from peak 100 to trough 60 = 40%
    expect(result.maxDrawdown).toBe(40);
    expect(result.maxDrawdownPercent).toBe(0.40);
    expect(result.peakIndex).toBe(0); // Peak at index 0 (100)
    expect(result.troughIndex).toBe(6);
    expect(result.peakValue).toBe(100);
    expect(result.troughValue).toBe(60);
    expect(result.drawdownDuration).toBe(6);
    expect(result.recoveryIndex).toBe(8);
    expect(result.recoveryDuration).toBe(2);
  });

  it('should validate mathematical formula correctness', () => {
    const prices = [100, 90, 80, 70, 80, 90, 100];
    const result = calculateMaxDrawdown({ prices });

    // Manual calculation verification
    const peak = 100;
    const trough = 70;
    const expectedDrawdown = peak - trough;
    const expectedDrawdownPercent = expectedDrawdown / peak;

    expect(result.maxDrawdown).toBe(expectedDrawdown);
    expect(result.maxDrawdownPercent).toBeCloseTo(expectedDrawdownPercent, 5);
  });

  it('should handle edge case with very small price differences', () => {
    const prices = [100.00, 99.99, 99.98, 99.97, 99.98, 99.99, 100.00];
    const result = calculateMaxDrawdown({ prices });

    expect(result.maxDrawdown).toBeCloseTo(0.03, 2);
    expect(result.maxDrawdownPercent).toBeCloseTo(0.0003, 5);
    expect(result.peakIndex).toBe(0);
    expect(result.troughIndex).toBe(3);
    expect(result.peakValue).toBe(100.00);
    expect(result.troughValue).toBe(99.97);
    expect(result.drawdownDuration).toBe(3);
    expect(result.recoveryIndex).toBe(6);
    expect(result.recoveryDuration).toBe(3);
  });
});
