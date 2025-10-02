import { describe, expect, it } from 'vitest';

import { calculateCovarianceMatrix } from './calculateCovarianceMatrix';

describe('calculateCovarianceMatrix', () => {
  it('should calculate covariance matrix for identical assets', () => {
    const returns = [
      [0.01, 0.02, 0.03, 0.04], // Asset 1
      [0.01, 0.02, 0.03, 0.04], // Asset 2 (identical)
    ];

    const result = calculateCovarianceMatrix({ returns });

    // Diagonal should be equal (same variance)
    expect(result.matrix[0][0]).toBeCloseTo(result.matrix[1][1], 5);
    // Off-diagonal should equal diagonal (perfect correlation)
    expect(result.matrix[0][1]).toBeCloseTo(result.matrix[0][0], 5);
    expect(result.matrix[1][0]).toBeCloseTo(result.matrix[0][0], 5);
    // Matrix should be symmetric
    expect(result.matrix[0][1]).toBeCloseTo(result.matrix[1][0], 5);
  });

  it('should calculate covariance matrix for uncorrelated assets', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02], // Asset 1
      [0.01, 0.01, 0.01, 0.01], // Asset 2 (constant)
    ];

    const result = calculateCovarianceMatrix({ returns });

    // Asset 2 has zero variance, so covariance should be 0
    expect(result.matrix[0][1]).toBeCloseTo(0, 5);
    expect(result.matrix[1][0]).toBeCloseTo(0, 5);
    expect(result.matrix[1][1]).toBeCloseTo(0, 5); // Zero variance
    expect(result.averageCovariance).toBeCloseTo(0, 5);
  });

  it('should calculate covariance matrix for negatively correlated assets', () => {
    const returns = [
      [0.01, 0.02, 0.03, 0.04], // Asset 1
      [-0.01, -0.02, -0.03, -0.04], // Asset 2 (opposite)
    ];

    const result = calculateCovarianceMatrix({ returns });

    // Should have negative covariance
    expect(result.matrix[0][1]).toBeLessThan(0);
    expect(result.matrix[1][0]).toBeLessThan(0);
    expect(result.matrix[0][1]).toBeCloseTo(result.matrix[1][0], 5); // Symmetry
  });

  it('should calculate covariance matrix for realistic market data', () => {
    // Simulate SPY vs BTC returns
    const returns = [
      [0.01, 0.02, -0.01, 0.03, 0.01], // SPY (equity)
      [0.05, 0.08, -0.03, 0.12, 0.02], // BTC (crypto)
    ];

    const result = calculateCovarianceMatrix({ returns });

    // Should have positive covariance (both generally move together)
    expect(result.matrix[0][1]).toBeGreaterThan(0);
    expect(result.matrix[1][0]).toBeCloseTo(result.matrix[0][1], 5);
    
    // Diagonal should be positive (variances)
    expect(result.matrix[0][0]).toBeGreaterThan(0);
    expect(result.matrix[1][1]).toBeGreaterThan(0);
    
    // Variances should match diagonal
    expect(result.variances[0]).toBeCloseTo(result.matrix[0][0], 5);
    expect(result.variances[1]).toBeCloseTo(result.matrix[1][1], 5);
  });

  it('should handle three assets with mixed covariances', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02], // Asset 1
      [0.01, 0.02, 0.01, 0.02], // Asset 2 (correlated with 1)
      [0.01, 0.01, 0.01, 0.01], // Asset 3 (uncorrelated)
    ];

    const result = calculateCovarianceMatrix({ returns });

    expect(result.matrix).toHaveLength(3);
    expect(result.matrix[0]).toHaveLength(3);
    
    // Asset 1 and 2 should have positive covariance
    expect(result.matrix[0][1]).toBeGreaterThan(0);
    expect(result.matrix[1][0]).toBeCloseTo(result.matrix[0][1], 5);
    
    // Asset 3 should have zero covariance with others
    expect(result.matrix[0][2]).toBeCloseTo(0, 5);
    expect(result.matrix[2][0]).toBeCloseTo(0, 5);
    expect(result.matrix[1][2]).toBeCloseTo(0, 5);
    expect(result.matrix[2][1]).toBeCloseTo(0, 5);
  });

  it('should use custom labels when provided', () => {
    const returns = [
      [0.01, 0.02, 0.01],
      [0.02, 0.01, 0.02],
    ];

    const result = calculateCovarianceMatrix({
      returns,
      labels: ['SPY', 'QQQ'],
    });

    expect(result.labels).toEqual(['SPY', 'QQQ']);
  });

  it('should generate default labels when not provided', () => {
    const returns = [
      [0.01, 0.02, 0.01],
      [0.02, 0.01, 0.02],
      [0.01, 0.01, 0.02],
    ];

    const result = calculateCovarianceMatrix({ returns });

    expect(result.labels).toEqual(['Asset 1', 'Asset 2', 'Asset 3']);
  });

  it('should throw error for mismatched series lengths', () => {
    const returns = [
      [0.01, 0.02, 0.01],
      [0.02, 0.01], // Different length
    ];

    expect(() =>
      calculateCovarianceMatrix({ returns })
    ).toThrow('All return series must have the same length');
  });

  it('should throw error for insufficient data points', () => {
    const returns = [
      [0.01], // Only 1 data point
      [0.02],
    ];

    expect(() =>
      calculateCovarianceMatrix({ returns })
    ).toThrow('Each return series must have at least 2 data points');
  });

  it('should throw error for empty returns array', () => {
    expect(() =>
      calculateCovarianceMatrix({ returns: [] })
    ).toThrow();
  });

  it('should validate schema constraints', () => {
    expect(() =>
      calculateCovarianceMatrix({
        // @ts-expect-error Testing invalid input
        returns: 'not-an-array',
      })
    ).toThrow();
  });

  it('should handle minimum required assets', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02],
      [0.02, 0.01, 0.02, 0.01],
    ];

    const result = calculateCovarianceMatrix({ returns });

    expect(result.matrix).toHaveLength(2);
    expect(result.matrix[0]).toHaveLength(2);
    expect(result.variances).toHaveLength(2);
    expect(result.variances[0]).toBeCloseTo(result.matrix[0][0], 5);
    expect(result.variances[1]).toBeCloseTo(result.matrix[1][1], 5);
  });

  it('should calculate correct covariance for known mathematical example', () => {
    // Known example: X = [1, 2, 3, 4], Y = [2, 4, 6, 8]
    // Y = 2X, so covariance should be 2 * Var(X)
    const returns = [
      [1, 2, 3, 4],
      [2, 4, 6, 8],
    ];

    const result = calculateCovarianceMatrix({ returns });

    // Calculate expected variance of X
    const xMean = (1 + 2 + 3 + 4) / 4;
    const xVariance = ((1-xMean)**2 + (2-xMean)**2 + (3-xMean)**2 + (4-xMean)**2) / 3;
    
    // Covariance should be 2 * Var(X)
    expect(result.matrix[0][1]).toBeCloseTo(2 * xVariance, 5);
    expect(result.matrix[1][0]).toBeCloseTo(2 * xVariance, 5);
  });

  it('should handle negative returns correctly', () => {
    const returns = [
      [-0.01, -0.02, -0.01, -0.02],
      [-0.02, -0.01, -0.02, -0.01],
    ];

    const result = calculateCovarianceMatrix({ returns });

    expect(result.matrix[0][1]).toBeDefined();
    expect(result.matrix[1][0]).toBeCloseTo(result.matrix[0][1], 5);
    expect(result.averageCovariance).toBeDefined();
  });

  it('should maintain matrix symmetry', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02, 0.01],
      [0.02, 0.01, 0.02, 0.01, 0.02],
      [0.01, 0.02, 0.01, 0.02, 0.01],
    ];

    const result = calculateCovarianceMatrix({ returns });

    // Check symmetry: matrix[i][j] = matrix[j][i]
    for (let i = 0; i < result.matrix.length; i++) {
      for (let j = 0; j < result.matrix[i].length; j++) {
        expect(result.matrix[i][j]).toBeCloseTo(result.matrix[j][i], 5);
      }
    }
  });

  it('should have variances on diagonal', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02],
      [0.02, 0.01, 0.02, 0.01],
      [0.01, 0.02, 0.01, 0.02],
    ];

    const result = calculateCovarianceMatrix({ returns });

    for (let i = 0; i < result.matrix.length; i++) {
      expect(result.matrix[i][i]).toBeCloseTo(result.variances[i], 5);
    }
  });

  it('should handle realistic portfolio scenario', () => {
    // Simulate a 3-asset portfolio: SPY, QQQ, TLT
    const returns = [
      [0.01, 0.02, -0.01, 0.03, 0.01], // SPY (equity)
      [0.015, 0.025, -0.005, 0.035, 0.015], // QQQ (tech equity)
      [-0.005, -0.01, 0.02, -0.015, -0.005], // TLT (bonds)
    ];

    const result = calculateCovarianceMatrix({ returns });

    expect(result.matrix).toHaveLength(3);
    expect(result.labels).toHaveLength(3);
    expect(result.variances).toHaveLength(3);
    
    // SPY and QQQ should have positive covariance
    expect(result.matrix[0][1]).toBeGreaterThan(0);
    
    // Bonds should have negative covariance with equities
    expect(result.matrix[0][2]).toBeLessThan(0);
    expect(result.matrix[1][2]).toBeLessThan(0);
    
    // All diagonal elements should be positive (variances)
    for (let i = 0; i < result.matrix.length; i++) {
      expect(result.matrix[i][i]).toBeGreaterThan(0);
    }
  });

  it('should calculate average covariance correctly', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02],
      [0.02, 0.01, 0.02, 0.01],
      [0.01, 0.01, 0.02, 0.01],
    ];

    const result = calculateCovarianceMatrix({ returns });

    // Calculate expected average covariance manually
    const expectedOffDiagonal = [
      result.matrix[0][1],
      result.matrix[0][2],
      result.matrix[1][2],
    ];
    const expectedAverage = expectedOffDiagonal.reduce((sum, c) => sum + c, 0) / expectedOffDiagonal.length;

    expect(result.averageCovariance).toBeCloseTo(expectedAverage, 5);
  });
});
