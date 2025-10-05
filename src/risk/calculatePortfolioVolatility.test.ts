import { describe, expect, it } from 'vitest';

import { calculatePortfolioVolatility } from './calculatePortfolioVolatility';

describe('calculatePortfolioVolatility', () => {
  it('should calculate portfolio volatility correctly', () => {
    const options = {
      weights: [0.4, 0.6],
      returns: [
        [0.01, 0.02, -0.01, 0.03],
        [0.015, 0.025, -0.005, 0.035]
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
    expect(result.covarianceMatrix).toHaveLength(2);
    expect(result.covarianceMatrix[0]).toHaveLength(2);
    expect(result.covarianceMatrix[1]).toHaveLength(2);
  });

  it('should handle equal weights', () => {
    const options = {
      weights: [0.5, 0.5],
      returns: [
        [0.01, 0.02, -0.01],
        [0.015, 0.025, -0.005]
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
  });

  it('should handle three assets', () => {
    const options = {
      weights: [0.3, 0.4, 0.3],
      returns: [
        [0.01, 0.02, -0.01, 0.03],
        [0.015, 0.025, -0.005, 0.035],
        [0.008, 0.018, -0.008, 0.028]
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
    expect(result.covarianceMatrix).toHaveLength(3);
    expect(result.covarianceMatrix[0]).toHaveLength(3);
    expect(result.covarianceMatrix[1]).toHaveLength(3);
    expect(result.covarianceMatrix[2]).toHaveLength(3);
  });

  it('should handle single asset (minimum 2 required)', () => {
    const options = {
      weights: [1.0, 0.0], // Need at least 2 assets
      returns: [
        [0.01, 0.02, -0.01, 0.03, 0.015],
        [0.0, 0.0, 0.0, 0.0, 0.0] // Zero weight asset
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
    expect(result.covarianceMatrix).toHaveLength(2);
    expect(result.covarianceMatrix[0]).toHaveLength(2);
  });

  it('should handle zero weights', () => {
    const options = {
      weights: [1.0, 0.0],
      returns: [
        [0.01, 0.02, -0.01, 0.03],
        [0.015, 0.025, -0.005, 0.035]
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
  });

  it('should handle different annualization factors', () => {
    const options = {
      weights: [0.4, 0.6],
      returns: [
        [0.01, 0.02, -0.01, 0.03],
        [0.015, 0.025, -0.005, 0.035]
      ],
      annualizationFactor: 12 // Monthly
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
  });

  it('should handle correlated assets', () => {
    const options = {
      weights: [0.5, 0.5],
      returns: [
        [0.01, 0.02, -0.01, 0.03],
        [0.011, 0.021, -0.009, 0.031] // Highly correlated
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
  });

  it('should handle negatively correlated assets', () => {
    const options = {
      weights: [0.5, 0.5],
      returns: [
        [0.01, 0.02, -0.01, 0.03],
        [-0.005, -0.015, 0.005, -0.025] // Negatively correlated (less extreme)
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThanOrEqual(0);
    expect(result.annualizedVolatility).toBeGreaterThanOrEqual(result.volatility);
    expect(result.variance).toBeGreaterThanOrEqual(0);
  });

  it('should throw error for mismatched array lengths', () => {
    const options = {
      weights: [0.4, 0.6],
      returns: [
        [0.01, 0.02, -0.01, 0.03],
        [0.015, 0.025, -0.005, 0.035],
        [0.008, 0.018, -0.008, 0.028] // Extra asset
      ],
      annualizationFactor: 252
    };

    expect(() => calculatePortfolioVolatility(options))
      .toThrow('Weights and returns arrays must have same length');
  });

  it('should throw error for empty weights', () => {
    const options = {
      weights: [],
      returns: [],
      annualizationFactor: 252
    };

    expect(() => calculatePortfolioVolatility(options))
      .toThrow();
  });

  it('should handle large dataset', () => {
    const weights = new Array(10).fill(0.1);
    const returns = Array.from({ length: 10 }, () => 
      Array.from({ length: 100 }, () => (Math.random() - 0.5) * 0.1)
    );

    const options = {
      weights,
      returns,
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
    expect(result.covarianceMatrix).toHaveLength(10);
  });

  it('should handle extreme volatility', () => {
    const options = {
      weights: [0.5, 0.5],
      returns: [
        [0.5, -0.5, 0.3, -0.3], // High volatility
        [0.6, -0.6, 0.4, -0.4]  // High volatility
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
  });

  it('should handle constant returns', () => {
    const options = {
      weights: [0.4, 0.6],
      returns: [
        [0.01, 0.01, 0.01, 0.01], // Constant returns
        [0.02, 0.02, 0.02, 0.02]  // Constant returns
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBe(0);
    expect(result.annualizedVolatility).toBe(0);
    expect(result.variance).toBe(0);
    expect(result.covarianceMatrix).toHaveLength(2);
  });

  it('should handle mixed positive and negative returns', () => {
    const options = {
      weights: [0.3, 0.7],
      returns: [
        [-0.05, 0.10, -0.02, 0.08],
        [0.03, -0.07, 0.12, -0.01]
      ],
      annualizationFactor: 252
    };

    const result = calculatePortfolioVolatility(options);

    expect(result.volatility).toBeGreaterThan(0);
    expect(result.annualizedVolatility).toBeGreaterThan(result.volatility);
    expect(result.variance).toBeGreaterThan(0);
  });
});
