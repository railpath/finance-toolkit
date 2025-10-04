import { calculateSemideviation } from './calculateSemideviation';

describe('calculateSemideviation', () => {
  it('should calculate semideviation with zero threshold', () => {
    const returns = [0.01, -0.02, 0.03, -0.01, -0.05, 0.02];
    const result = calculateSemideviation({
      returns,
      threshold: 0,
      annualizationFactor: 252
    });

    expect(result.semideviation).toBeGreaterThan(0);
    expect(result.annualizedSemideviation).toBeGreaterThan(result.semideviation);
    expect(result.downsideCount).toBe(3); // -0.02, -0.01, -0.05
    expect(result.totalCount).toBe(6);
    expect(result.downsidePercentage).toBeCloseTo(50, 1);
    expect(result.threshold).toBe(0);
    expect(result.meanReturn).toBeCloseTo(-0.0033, 3);
  });

  it('should calculate semideviation with mean threshold', () => {
    const returns = [0.05, -0.02, 0.07, -0.01, -0.05, 0.02];
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    
    const result = calculateSemideviation({
      returns,
      threshold: mean,
      annualizationFactor: 252
    });

    expect(result.semideviation).toBeGreaterThanOrEqual(0);
    expect(result.threshold).toBeCloseTo(mean, 5);
    expect(result.downsideCount).toBeGreaterThanOrEqual(0);
    expect(result.downsideCount).toBeLessThanOrEqual(result.totalCount);
  });

  it('should handle all positive returns (zero semideviation)', () => {
    const returns = [0.01, 0.02, 0.03, 0.04, 0.05];
    const result = calculateSemideviation({
      returns,
      threshold: 0
    });

    expect(result.semideviation).toBe(0);
    expect(result.annualizedSemideviation).toBe(0);
    expect(result.downsideCount).toBe(0);
    expect(result.downsidePercentage).toBe(0);
  });

  it('should handle all negative returns', () => {
    const returns = [-0.01, -0.02, -0.03, -0.04, -0.05];
    const result = calculateSemideviation({
      returns,
      threshold: 0
    });

    expect(result.semideviation).toBeGreaterThan(0);
    expect(result.downsideCount).toBe(5);
    expect(result.downsidePercentage).toBe(100);
  });

  it('should handle custom threshold', () => {
    const returns = [0.01, -0.02, 0.03, -0.01, -0.05, 0.02];
    const result = calculateSemideviation({
      returns,
      threshold: 0.01 // 1% threshold
    });

    expect(result.semideviation).toBeGreaterThan(0);
    expect(result.threshold).toBe(0.01);
    expect(result.downsideCount).toBe(3); // -0.02, -0.01, -0.05
  });

  it('should calculate annualization correctly', () => {
    const returns = [0.01, -0.02, 0.03, -0.01];
    const result = calculateSemideviation({
      returns,
      annualizationFactor: 252,
      annualized: true
    });

    const expectedAnnualized = result.semideviation * Math.sqrt(252);
    expect(result.annualizedSemideviation).toBeCloseTo(expectedAnnualized, 5);
  });

  it('should handle non-annualized result', () => {
    const returns = [0.01, -0.02, 0.03, -0.01];
    const result = calculateSemideviation({
      returns,
      annualized: false
    });

    expect(result.annualizedSemideviation).toBe(result.semideviation);
  });

  it('should throw error for insufficient data', () => {
    expect(() => calculateSemideviation({
      returns: [0.01],
      threshold: 0
    })).toThrow('At least 2 returns are required');
  });

  it('should handle edge case with constant returns', () => {
    const returns = [0.01, 0.01, 0.01, 0.01];
    const result = calculateSemideviation({
      returns,
      threshold: 0.01
    });

    expect(result.semideviation).toBe(0);
    expect(result.downsideCount).toBe(0);
    expect(result.meanReturn).toBe(0.01);
  });

  it('should provide comparison with standard deviation', () => {
    const returns = [0.01, -0.02, 0.03, -0.01, -0.05, 0.02];
    const result = calculateSemideviation({
      returns,
      threshold: 0
    });

    // Semideviation should be less than or equal to standard deviation
    expect(result.semideviation).toBeLessThanOrEqual(result.standardDeviation);
    expect(result.standardDeviation).toBeGreaterThan(0);
  });

  it('should handle different annualization factors', () => {
    const returns = [0.01, -0.02, 0.03, -0.01];
    
    const result252 = calculateSemideviation({
      returns,
      annualizationFactor: 252
    });
    
    const result12 = calculateSemideviation({
      returns,
      annualizationFactor: 12
    });

    expect(result252.annualizedSemideviation).toBeGreaterThan(result12.annualizedSemideviation);
    expect(result252.semideviation).toBeCloseTo(result12.semideviation, 5);
  });

  it('should handle threshold above all returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04];
    const result = calculateSemideviation({
      returns,
      threshold: 0.05 // Above all returns
    });

    expect(result.semideviation).toBeGreaterThan(0);
    expect(result.downsideCount).toBe(4);
    expect(result.downsidePercentage).toBe(100);
  });

  it('should handle threshold below all returns', () => {
    const returns = [0.01, 0.02, 0.03, 0.04];
    const result = calculateSemideviation({
      returns,
      threshold: 0 // Below all returns
    });

    expect(result.semideviation).toBe(0);
    expect(result.downsideCount).toBe(0);
    expect(result.downsidePercentage).toBe(0);
  });

  it('should handle financial returns data realistically', () => {
    // Simulate realistic financial returns with fat tails
    const returns = [
      0.015, 0.008, -0.012, 0.023, -0.005,
      -0.018, 0.011, -0.025, 0.009, 0.014,
      -0.007, 0.019, -0.031, 0.006, -0.013
    ];
    
    const result = calculateSemideviation({
      returns,
      threshold: 0,
      annualizationFactor: 252
    });

    expect(result.semideviation).toBeGreaterThan(0);
    expect(result.annualizedSemideviation).toBeGreaterThan(result.semideviation);
    expect(result.downsideCount).toBeGreaterThan(0);
    expect(result.downsidePercentage).toBeGreaterThan(0);
    expect(result.downsidePercentage).toBeLessThan(100);
    expect(result.meanReturn).toBeCloseTo(-0.0004, 2);
  });
});
