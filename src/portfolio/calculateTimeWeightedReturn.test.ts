import { calculateTimeWeightedReturn } from './calculateTimeWeightedReturn';

describe('calculateTimeWeightedReturn', () => {
  it('should calculate TWR for simple case', () => {
    const result = calculateTimeWeightedReturn({
      portfolioValues: [1000, 1100, 1200],
      cashFlows: [0, 0, 0],
      annualizationFactor: 252,
    });

    // Period 1: (1100 - 1000 - 0) / (1000 + 0) = 0.10
    // Period 2: (1200 - 1100 - 0) / (1100 + 0) = 0.0909
    // TWR: (1.10 * 1.0909) - 1 = 0.20
    expect(result.twr).toBeCloseTo(0.20, 4);
    expect(result.periods).toBe(2);
    expect(result.periodReturns).toHaveLength(2);
  });

  it('should handle cash flows correctly', () => {
    const result = calculateTimeWeightedReturn({
      portfolioValues: [1000, 1100, 1200],
      cashFlows: [0, 100, -50],
      annualizationFactor: 252,
    });

    // Period 1: (1100 - 1000 - 100) / (1000 + 100) = 0
    // Period 2: (1200 - 1100 - (-50)) / (1100 + (-50)) = 0.1429
    // TWR: (1.0 * 1.1429) - 1 = 0.1429
    expect(result.twr).toBeCloseTo(0.1429, 4);
  });

  it('should throw error for mismatched array lengths', () => {
    expect(() => {
      calculateTimeWeightedReturn({
        portfolioValues: [1000, 1100],
        cashFlows: [0, 0, 0],
        annualizationFactor: 252,
      });
    }).toThrow('Portfolio values and cash flows must have same length');
  });

  it('should throw error for insufficient periods', () => {
    expect(() => {
      calculateTimeWeightedReturn({
        portfolioValues: [1000],
        cashFlows: [0],
        annualizationFactor: 252,
      });
    }).toThrow();
  });

  it('should calculate annualized TWR correctly', () => {
    const result = calculateTimeWeightedReturn({
      portfolioValues: [1000, 1100],
      cashFlows: [0, 0],
      annualizationFactor: 12, // Monthly
    });

    // Period return: 10%
    // Annualized: (1.10)^12 - 1
    expect(result.annualizedTWR).toBeCloseTo(2.1384, 4);
  });
});
