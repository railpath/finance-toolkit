import { describe, expect, it } from 'vitest';

import { calculateSharpeRatio } from './calculateSharpeRatio';

describe('calculateSharpeRatio', () => {
  it('should calculate Sharpe ratio for positive returns', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeGreaterThan(0);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should calculate Sharpe ratio for negative returns', () => {
    const options = {
      returns: [-0.01, -0.02, -0.03, -0.04, -0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeLessThan(0);
    expect(result.annualizedReturn).toBeLessThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeLessThan(0);
  });

  it('should calculate Sharpe ratio for mixed returns', () => {
    const options = {
      returns: [-0.01, 0.02, -0.03, 0.04, 0.01],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle zero volatility (identical returns)', () => {
    const options = {
      returns: [0.01, 0.01, 0.01, 0.01, 0.01],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBe(0); // Should be 0 when volatility is 0
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBe(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle zero risk-free rate', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeGreaterThan(0);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle high risk-free rate', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.10,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    // With high returns and high risk-free rate, Sharpe ratio can still be positive
    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle different annualization factors', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 12 // Monthly data
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle single return', () => {
    const options = {
      returns: [0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    expect(() => calculateSharpeRatio(options))
      .toThrow('Need at least 2 returns');
  });

  it('should handle two returns', () => {
    const options = {
      returns: [0.01, 0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle large dataset', () => {
    const returns = Array.from({ length: 1000 }, (_, i) => 
      (Math.random() - 0.5) * 0.1 + Math.sin(i / 100) * 0.05
    );
    const options = {
      returns,
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should be consistent for same inputs', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result1 = calculateSharpeRatio(options);
    const result2 = calculateSharpeRatio(options);

    expect(result1.sharpeRatio).toBeCloseTo(result2.sharpeRatio, 10);
    expect(result1.annualizedReturn).toBeCloseTo(result2.annualizedReturn, 10);
    expect(result1.annualizedVolatility).toBeCloseTo(result2.annualizedVolatility, 10);
    expect(result1.excessReturn).toBeCloseTo(result2.excessReturn, 10);
  });

  it('should handle realistic portfolio scenario', () => {
    const options = {
      returns: [
        0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03,
        0.01, 0.02, -0.01, 0.03, 0.01, -0.02, 0.04, 0.02, -0.01, 0.03
      ],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle edge case with zero returns', () => {
    const options = {
      returns: [0, 0, 0, 0, 0],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBe(0);
    expect(result.annualizedReturn).toBe(0);
    expect(result.annualizedVolatility).toBe(0);
    expect(result.excessReturn).toBeLessThan(0);
  });

  it('should handle edge case with very small returns', () => {
    const options = {
      returns: [0.001, 0.002, 0.003, 0.004, 0.005],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle edge case with very large returns', () => {
    const options = {
      returns: [0.1, 0.2, 0.3, 0.4, 0.5],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should validate mathematical formula correctness', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    // Manual calculation verification
    const meanReturn = (0.01 + 0.02 + 0.03 + 0.04 + 0.05) / 5;
    const annualizedReturn = meanReturn * 252;
    const excessReturn = annualizedReturn - 0.02;
    
    // Standard deviation calculation
    const variance = ((0.01 - meanReturn) ** 2 + (0.02 - meanReturn) ** 2 + 
                     (0.03 - meanReturn) ** 2 + (0.04 - meanReturn) ** 2 + 
                     (0.05 - meanReturn) ** 2) / 4;
    const stdDev = Math.sqrt(variance);
    const annualizedVolatility = stdDev * Math.sqrt(252);
    const expectedSharpeRatio = excessReturn / annualizedVolatility;

    expect(result.sharpeRatio).toBeCloseTo(expectedSharpeRatio, 5);
    expect(result.annualizedReturn).toBeCloseTo(annualizedReturn, 5);
    expect(result.annualizedVolatility).toBeCloseTo(annualizedVolatility, 5);
    expect(result.excessReturn).toBeCloseTo(excessReturn, 5);
  });

  it('should handle edge case with negative risk-free rate', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: -0.01,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeGreaterThan(0);
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with very high annualization factor', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 1000
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with very low annualization factor', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05],
      riskFreeRate: 0.02,
      annualizationFactor: 1
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with alternating returns', () => {
    const options = {
      returns: [0.01, -0.01, 0.01, -0.01, 0.01],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeDefined();
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeDefined();
  });

  it('should handle edge case with monotonically increasing returns', () => {
    const options = {
      returns: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });

  it('should handle edge case with monotonically decreasing returns', () => {
    const options = {
      returns: [0.06, 0.05, 0.04, 0.03, 0.02, 0.01],
      riskFreeRate: 0.02,
      annualizationFactor: 252
    };

    const result = calculateSharpeRatio(options);

    expect(result.sharpeRatio).toBeDefined();
    expect(result.annualizedReturn).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(0);
    expect(result.excessReturn).toBeGreaterThan(0);
  });
});
