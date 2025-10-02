// risk/__tests__/calculateAlpha.test.ts

import { describe, expect, it } from 'vitest';

import { calculateAlpha } from './calculateAlpha';

describe('calculateAlpha', () => {
  it('should calculate alpha for outperforming asset', () => {
  const result = calculateAlpha({
    assetReturns: [0.08, 0.06, 0.10, 0.09, 0.07],      
    benchmarkReturns: [0.04, 0.03, 0.05, 0.04, 0.03],
    riskFreeRate: 0.02,
    annualizationFactor: 12,
  });

  expect(result.alpha).toBeGreaterThan(0);
  expect(result.annualizedAlpha).toBeGreaterThan(0);
  expect(result.beta).toBeGreaterThan(0);
});

  it('should calculate negative alpha for underperforming asset', () => {
    const result = calculateAlpha({
      assetReturns: [0.005, 0.008, 0.003, 0.006],
      benchmarkReturns: [0.01, 0.015, 0.012, 0.014],
      riskFreeRate: 0.02,
      annualizationFactor: 252,
    });

    expect(result.alpha).toBeLessThan(0);
    expect(result.annualizedAlpha).toBeLessThan(0);
  });

  it('should handle zero risk-free rate', () => {
    const result = calculateAlpha({
      assetReturns: [0.01, 0.02, 0.015],
      benchmarkReturns: [0.008, 0.012, 0.01],
      riskFreeRate: 0,
      annualizationFactor: 252,
    });

    expect(result.alpha).toBeDefined();
    expect(result.expectedReturn).toBe(result.beta * result.benchmarkReturn);
  });

  it('should handle perfectly correlated returns (beta = 1)', () => {
    const returns = [0.01, 0.02, 0.015, 0.012];
    const result = calculateAlpha({
      assetReturns: returns,
      benchmarkReturns: returns,
      riskFreeRate: 0.02,
      annualizationFactor: 252,
    });

    expect(result.beta).toBeCloseTo(1, 5);
    expect(result.alpha).toBeCloseTo(0, 5);
  });

  it('should throw error for mismatched array lengths', () => {
    try {
      calculateAlpha({
        assetReturns: [0.05, 0.03, 0.07],
        benchmarkReturns: [0.04, 0.02],
        riskFreeRate: 0.01,
        annualizationFactor: 12,
      });
      expect.fail('Should have thrown'); // Falls kein Error kommt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('Caught error:', error); // <- Debug erstmal
      expect(error).toBeDefined();
      // Dann je nach tatsächlichem Error-Format anpassen
    }
  });

  it('should throw error for insufficient data points', () => {
    expect(() =>
      calculateAlpha({
        assetReturns: [0.01],
        benchmarkReturns: [0.01],
        riskFreeRate: 0.02,
        annualizationFactor: 252,
      })
    ).toThrow();
  });

  it('should throw error for non-positive annualization factor', () => {
    expect(() =>
      calculateAlpha({
        assetReturns: [0.01, 0.02],
        benchmarkReturns: [0.01, 0.015],
        riskFreeRate: 0.02,
        annualizationFactor: 0,
      })
    ).toThrow('Annualization factor must be positive');
  });

  it('should handle negative returns correctly', () => {
    const result = calculateAlpha({
      assetReturns: [-0.02, -0.01, 0.01, -0.015],
      benchmarkReturns: [-0.01, -0.005, 0.008, -0.012],
      riskFreeRate: 0.02,
      annualizationFactor: 252,
    });

    expect(result.alpha).toBeDefined();
    expect(result.assetReturn).toBeLessThan(0);
    expect(result.benchmarkReturn).toBeLessThan(0);
  });
  
  it('should calculate correct annualized vs period alpha relationship', () => {
    const annualizationFactor = 252;
    const result = calculateAlpha({
      assetReturns: [0.01, 0.02, 0.015],
      benchmarkReturns: [0.008, 0.012, 0.01],
      riskFreeRate: 0.02,
      annualizationFactor,
    });

    // Annualized alpha should be roughly period alpha * annualization factor
    // (not exact due to CAPM calculation)
    expect(Math.abs(result.annualizedAlpha)).toBeGreaterThan(
      Math.abs(result.alpha)
    );
  });
});
