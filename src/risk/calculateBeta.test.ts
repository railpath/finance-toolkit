import { describe, expect, it } from 'vitest';

import { calculateBeta } from './calculateBeta';

describe('calculateBeta', () => {
  it('should calculate beta for market-neutral asset (β ≈ 1)', () => {
    const result = calculateBeta({
      assetReturns: [0.05, 0.03, 0.07, 0.04, 0.06],
      benchmarkReturns: [0.04, 0.02, 0.06, 0.03, 0.05],
    });

    expect(result.beta).toBeCloseTo(1, 1);
    expect(result.correlation).toBeGreaterThan(0.9);
    expect(result.covariance).toBeGreaterThan(0);
    expect(result.benchmarkVariance).toBeGreaterThan(0);
  });

  it('should calculate beta for high-volatility asset (β > 1)', () => {
    const result = calculateBeta({
      assetReturns: [0.10, 0.05, 0.15, 0.08, 0.12],
      benchmarkReturns: [0.05, 0.03, 0.07, 0.04, 0.06],
    });

    expect(result.beta).toBeGreaterThan(1);
    expect(result.correlation).toBeGreaterThan(0);
  });

  it('should calculate beta for low-volatility asset (β < 1)', () => {
    const result = calculateBeta({
      assetReturns: [0.02, 0.015, 0.025, 0.018, 0.022],
      benchmarkReturns: [0.05, 0.03, 0.07, 0.04, 0.06],
    });

    expect(result.beta).toBeLessThan(1);
    expect(result.beta).toBeGreaterThan(0);
  });

  it('should calculate negative beta for inversely correlated asset', () => {
    const result = calculateBeta({
      assetReturns: [0.02, 0.06, 0.01, 0.05, 0.03],
      benchmarkReturns: [0.08, 0.02, 0.09, 0.03, 0.07],
    });

    expect(result.beta).toBeLessThan(0);
    expect(result.correlation).toBeLessThan(0);
  });

  it('should handle zero benchmark variance (β = 0)', () => {
    const result = calculateBeta({
      assetReturns: [0.05, 0.03, 0.07, 0.04, 0.06],
      benchmarkReturns: [0.05, 0.05, 0.05, 0.05, 0.05], // Flat benchmark
    });

    expect(result.beta).toBe(0);
    expect(result.benchmarkVariance).toBe(0);
    expect(result.correlation).toBe(0);
  });

  it('should handle zero asset variance (perfect stability)', () => {
    const result = calculateBeta({
      assetReturns: [0.03, 0.03, 0.03, 0.03, 0.03], // Stablecoin-like
      benchmarkReturns: [0.05, 0.03, 0.07, 0.04, 0.06],
    });

    expect(result.beta).toBe(0);
    expect(result.covariance).toBe(0);
    expect(result.correlation).toBe(0);
  });

  it('should throw error for mismatched array lengths', () => {
    expect(() =>
      calculateBeta({
        assetReturns: [0.05, 0.03, 0.07],
        benchmarkReturns: [0.04, 0.02],
      })
    ).toThrow('same length');
  });

  it('should throw error for empty arrays', () => {
    expect(() =>
      calculateBeta({
        assetReturns: [],
        benchmarkReturns: [],
      })
    ).toThrow();
  });

  it('should validate schema constraints', () => {
    expect(() =>
      calculateBeta({
        // @ts-expect-error Testing invalid input
        assetReturns: 'not-an-array',
        benchmarkReturns: [0.04, 0.02],
      })
    ).toThrow();
  });

  it('should handle realistic SPY vs BTC scenario', () => {
    const result = calculateBeta({
      assetReturns: [0.15, -0.08, 0.22, 0.10, -0.05],  // Volatile crypto
      benchmarkReturns: [0.05, 0.02, 0.06, 0.04, 0.03], // Stable equity
    });

    expect(result.beta).toBeDefined();
    expect(result.correlation).toBeGreaterThan(-1);
    expect(result.correlation).toBeLessThan(1);
  });
});
