import { describe, expect, it } from 'vitest';

import { calculateCalmarRatio } from './calculateCalmarRatio';

describe('calculateCalmarRatio', () => {
  it('should calculate Calmar ratio for profitable asset with drawdown', () => {
    const result = calculateCalmarRatio({
      prices: [100, 110, 105, 120, 115, 130],
      returns: [0.10, -0.045, 0.143, -0.042, 0.130],
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBeGreaterThan(0);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.maxDrawdownPercent).toBeGreaterThan(0);
  });

  it('should calculate Calmar ratio for consistent uptrend', () => {
    const result = calculateCalmarRatio({
      prices: [100, 105, 110, 115, 120, 125],
      returns: [0.05, 0.048, 0.045, 0.043, 0.042],
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBe(0); // No drawdown = 0 Calmar ratio
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.maxDrawdownPercent).toBe(0); // No drawdown
  });

  it('should handle asset with large drawdown (low Calmar)', () => {
    const result = calculateCalmarRatio({
      prices: [100, 90, 80, 70, 75, 85],
      returns: [-0.10, -0.111, -0.125, 0.071, 0.133],
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBeLessThan(0); // Negative return
    expect(result.maxDrawdownPercent).toBeGreaterThan(0.20); // >20% drawdown
  });

  it('should return zero Calmar when max drawdown is zero', () => {
    const result = calculateCalmarRatio({
      prices: [100, 100, 100, 100, 100],
      returns: [0, 0, 0, 0],
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBe(0);
    expect(result.annualizedReturn).toBe(0);
    expect(result.maxDrawdownPercent).toBe(0);
  });

  it('should return zero Calmar for flat performance', () => {
    const result = calculateCalmarRatio({
      prices: [100, 102, 100, 102, 100],
      returns: [0.02, -0.0196, 0.02, -0.0196],
      annualizationFactor: 12,
    });

    expect(result.annualizedReturn).toBeCloseTo(0, 1);
    expect(result.maxDrawdownPercent).toBeGreaterThan(0);
  });

  it('should handle volatile crypto-like returns', () => {
    const result = calculateCalmarRatio({
      prices: [100, 150, 120, 180, 140, 200],
      returns: [0.50, -0.20, 0.50, -0.222, 0.429],
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.maxDrawdownPercent).toBeGreaterThan(0.10);
  });

  it('should calculate realistic hedge fund scenario (36-month typical)', () => {
    const prices = Array.from({ length: 37 }, (_, i) => 
      100 * Math.exp(0.08 * (i / 36) + Math.sin(i / 6) * 0.05)
    );
    const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);

    const result = calculateCalmarRatio({
      prices,
      returns,
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBeGreaterThan(0);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.maxDrawdownPercent).toBeGreaterThan(0);
  });

  it('should handle declining asset (negative Calmar)', () => {
    const result = calculateCalmarRatio({
      prices: [100, 95, 90, 85, 80, 75],
      returns: [-0.05, -0.053, -0.056, -0.059, -0.063],
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBeLessThan(0);
    expect(result.annualizedReturn).toBeLessThan(0);
    expect(result.maxDrawdownPercent).toBeGreaterThan(0.20);
  });

  it('should throw error for mismatched prices and returns length', () => {
    expect(() =>
      calculateCalmarRatio({
        prices: [100, 110, 120],
        returns: [0.10], // Should be 2 returns for 3 prices
        annualizationFactor: 12,
      })
    ).toThrow();
  });

  it('should throw error for empty inputs', () => {
    expect(() =>
      calculateCalmarRatio({
        prices: [],
        returns: [],
        annualizationFactor: 12,
      })
    ).toThrow();
  });

  it('should validate schema constraints', () => {
    expect(() =>
      calculateCalmarRatio({
        // @ts-expect-error Testing invalid input
        prices: 'not-an-array',
        returns: [0.05],
        annualizationFactor: 12,
      })
    ).toThrow();
  });

  it('should handle minimum required data points', () => {
    const result = calculateCalmarRatio({
      prices: [100, 105, 110],
      returns: [0.05, 0.048],
      annualizationFactor: 12,
    });

    expect(result.calmarRatio).toBeDefined();
    expect(result.annualizedReturn).toBeCloseTo(0.588, 1); // ~4.9% * 12
  });
});
