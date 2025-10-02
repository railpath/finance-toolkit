import { describe, expect, it } from 'vitest';

import { calculateCorrelationMatrix } from './calculateCorrelationMatrix';

describe('calculateCorrelationMatrix', () => {
  it('should calculate correlation matrix for perfectly correlated assets', () => {
    const returns = [
      [0.01, 0.02, 0.03, 0.04], // Asset 1
      [0.01, 0.02, 0.03, 0.04], // Asset 2 (identical)
    ];

    const result = calculateCorrelationMatrix({ returns });

    expect(result.matrix).toEqual([
      [1, 1], // Perfect correlation
      [1, 1],
    ]);
    expect(result.averageCorrelation).toBe(1);
    expect(result.maxCorrelation).toBe(1);
    expect(result.minCorrelation).toBe(1);
    expect(result.labels).toEqual(['Asset 1', 'Asset 2']);
  });

  it('should calculate correlation matrix for perfectly negatively correlated assets', () => {
    const returns = [
      [0.01, 0.02, 0.03, 0.04], // Asset 1
      [-0.01, -0.02, -0.03, -0.04], // Asset 2 (opposite)
    ];

    const result = calculateCorrelationMatrix({ returns });

    expect(result.matrix[0][1]).toBeCloseTo(-1, 5);
    expect(result.matrix[1][0]).toBeCloseTo(-1, 5);
    expect(result.averageCorrelation).toBeCloseTo(-1, 5);
    expect(result.maxCorrelation).toBeCloseTo(-1, 5);
    expect(result.minCorrelation).toBeCloseTo(-1, 5);
  });

  it('should calculate correlation matrix for uncorrelated assets', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02], // Asset 1
      [0.01, 0.01, 0.01, 0.01], // Asset 2 (constant)
    ];

    const result = calculateCorrelationMatrix({ returns });

    // Asset 2 has zero variance, so correlation should be 0
    expect(result.matrix[0][1]).toBe(0);
    expect(result.matrix[1][0]).toBe(0);
    expect(result.averageCorrelation).toBe(0);
  });

  it('should calculate correlation matrix for realistic market data', () => {
    // Simulate SPY vs BTC returns
    const returns = [
      [0.01, 0.02, -0.01, 0.03, 0.01], // SPY (equity)
      [0.05, 0.08, -0.03, 0.12, 0.02], // BTC (crypto)
    ];

    const result = calculateCorrelationMatrix({ returns });

    // Should have positive correlation but not perfect
    expect(result.matrix[0][1]).toBeGreaterThan(0);
    expect(result.matrix[0][1]).toBeLessThan(1);
    expect(result.matrix[1][0]).toBeCloseTo(result.matrix[0][1], 5);
    expect(result.averageCorrelation).toBeGreaterThan(0);
    expect(result.averageCorrelation).toBeLessThan(1);
  });

  it('should handle three assets with mixed correlations', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02], // Asset 1
      [0.01, 0.02, 0.01, 0.02], // Asset 2 (correlated with 1)
      [0.01, 0.01, 0.01, 0.01], // Asset 3 (uncorrelated)
    ];

    const result = calculateCorrelationMatrix({ returns });

    expect(result.matrix).toHaveLength(3);
    expect(result.matrix[0]).toHaveLength(3);
    
    // Asset 1 and 2 should be perfectly correlated
    expect(result.matrix[0][1]).toBeCloseTo(1, 5);
    expect(result.matrix[1][0]).toBeCloseTo(1, 5);
    
    // Asset 3 should be uncorrelated with others
    expect(result.matrix[0][2]).toBe(0);
    expect(result.matrix[2][0]).toBe(0);
    expect(result.matrix[1][2]).toBe(0);
    expect(result.matrix[2][1]).toBe(0);
  });

  it('should use custom labels when provided', () => {
    const returns = [
      [0.01, 0.02, 0.01],
      [0.02, 0.01, 0.02],
    ];

    const result = calculateCorrelationMatrix({
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

    const result = calculateCorrelationMatrix({ returns });

    expect(result.labels).toEqual(['Asset 1', 'Asset 2', 'Asset 3']);
  });

  it('should throw error for mismatched series lengths', () => {
    const returns = [
      [0.01, 0.02, 0.01],
      [0.02, 0.01], // Different length
    ];

    expect(() =>
      calculateCorrelationMatrix({ returns })
    ).toThrow('All return series must have the same length');
  });

  it('should throw error for insufficient data points', () => {
    const returns = [
      [0.01], // Only 1 data point
      [0.02],
    ];

    expect(() =>
      calculateCorrelationMatrix({ returns })
    ).toThrow('Each return series must have at least 2 data points');
  });

  it('should throw error for empty returns array', () => {
    expect(() =>
      calculateCorrelationMatrix({ returns: [] })
    ).toThrow();
  });

  it('should validate schema constraints', () => {
    expect(() =>
      calculateCorrelationMatrix({
        // @ts-expect-error Testing invalid input
        returns: 'not-an-array',
      })
    ).toThrow();
  });

  it('should handle edge case with minimum required assets', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02],
      [0.02, 0.01, 0.02, 0.01],
    ];

    const result = calculateCorrelationMatrix({ returns });

    expect(result.matrix).toHaveLength(2);
    expect(result.matrix[0]).toHaveLength(2);
    expect(result.matrix[0][0]).toBe(1); // Diagonal
    expect(result.matrix[1][1]).toBe(1); // Diagonal
    expect(result.matrix[0][1]).toBeCloseTo(result.matrix[1][0], 5); // Symmetry
  });

  it('should calculate correct correlation for known mathematical example', () => {
    // Known example: X = [1, 2, 3, 4], Y = [2, 4, 6, 8]
    // Y = 2X, so correlation should be 1
    const returns = [
      [1, 2, 3, 4],
      [2, 4, 6, 8],
    ];

    const result = calculateCorrelationMatrix({ returns });

    expect(result.matrix[0][1]).toBeCloseTo(1, 5);
    expect(result.matrix[1][0]).toBeCloseTo(1, 5);
  });

  it('should handle negative returns correctly', () => {
    const returns = [
      [-0.01, -0.02, -0.01, -0.02],
      [-0.02, -0.01, -0.02, -0.01],
    ];

    const result = calculateCorrelationMatrix({ returns });

    expect(result.matrix[0][1]).toBeDefined();
    expect(result.matrix[1][0]).toBeCloseTo(result.matrix[0][1], 5);
    expect(result.averageCorrelation).toBeDefined();
  });

  it('should maintain matrix symmetry', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02, 0.01],
      [0.02, 0.01, 0.02, 0.01, 0.02],
      [0.01, 0.02, 0.01, 0.02, 0.01],
    ];

    const result = calculateCorrelationMatrix({ returns });

    // Check symmetry: matrix[i][j] = matrix[j][i]
    for (let i = 0; i < result.matrix.length; i++) {
      for (let j = 0; j < result.matrix[i].length; j++) {
        expect(result.matrix[i][j]).toBeCloseTo(result.matrix[j][i], 5);
      }
    }
  });

  it('should have diagonal elements equal to 1', () => {
    const returns = [
      [0.01, 0.02, 0.01, 0.02],
      [0.02, 0.01, 0.02, 0.01],
      [0.01, 0.02, 0.01, 0.02],
    ];

    const result = calculateCorrelationMatrix({ returns });

    for (let i = 0; i < result.matrix.length; i++) {
      expect(result.matrix[i][i]).toBe(1);
    }
  });

  it('should handle realistic portfolio scenario', () => {
    // Simulate a 3-asset portfolio: SPY, QQQ, TLT
    const returns = [
      [0.01, 0.02, -0.01, 0.03, 0.01], // SPY (equity)
      [0.015, 0.025, -0.005, 0.035, 0.015], // QQQ (tech equity)
      [-0.005, -0.01, 0.02, -0.015, -0.005], // TLT (bonds)
    ];

    const result = calculateCorrelationMatrix({ returns });

    expect(result.matrix).toHaveLength(3);
    expect(result.labels).toHaveLength(3);
    
    // SPY and QQQ should be highly correlated
    expect(result.matrix[0][1]).toBeGreaterThan(0.8);
    
    // Bonds should be negatively correlated with equities
    expect(result.matrix[0][2]).toBeLessThan(0);
    expect(result.matrix[1][2]).toBeLessThan(0);
    
    // All correlations should be in valid range [-1, 1]
    for (let i = 0; i < result.matrix.length; i++) {
      for (let j = 0; j < result.matrix[i].length; j++) {
        expect(result.matrix[i][j]).toBeGreaterThanOrEqual(-1);
        expect(result.matrix[i][j]).toBeLessThanOrEqual(1);
      }
    }
  });
});
