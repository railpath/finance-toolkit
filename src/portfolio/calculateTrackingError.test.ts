import { calculateTrackingError } from './calculateTrackingError';

describe('calculateTrackingError', () => {
  const portfolioReturns = [0.05, 0.03, 0.07, 0.02, 0.04];
  const benchmarkReturns = [0.04, 0.03, 0.06, 0.02, 0.03];

  describe('Basic Calculations', () => {
    it('should calculate tracking error correctly', () => {
      const result = calculateTrackingError({
        portfolioReturns,
        benchmarkReturns,
        annualizationFactor: 252,
      });

      expect(result.trackingError).toBeGreaterThan(0);
      expect(result.trackingErrorPeriod).toBeGreaterThan(0);
      expect(result.excessReturns).toHaveLength(5);
      expect(result.periods).toBe(5);
      expect(result.annualizationFactor).toBe(252);
      expect(result.method).toBe('sample');
    });

    it('should calculate excess returns correctly', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.05, 0.03, 0.07],
        benchmarkReturns: [0.04, 0.03, 0.06],
      });

      const expectedExcessReturns = [0.01, 0.00, 0.01];
      expect(result.excessReturns[0]).toBeCloseTo(expectedExcessReturns[0], 10);
      expect(result.excessReturns[1]).toBeCloseTo(expectedExcessReturns[1], 10);
      expect(result.excessReturns[2]).toBeCloseTo(expectedExcessReturns[2], 10);
      expect(result.meanExcessReturn).toBeCloseTo(0.00667, 5);
    });

    it('should handle zero excess returns', () => {
      const portfolioReturns = [0.05, 0.03, 0.07];
      const benchmarkReturns = [0.05, 0.03, 0.07];

      const result = calculateTrackingError({
        portfolioReturns,
        benchmarkReturns,
      });

      expect(result.trackingError).toBeCloseTo(0, 10);
      expect(result.trackingErrorPeriod).toBeCloseTo(0, 10);
      expect(result.meanExcessReturn).toBeCloseTo(0, 10);
    });
  });

  describe('Annualization', () => {
    it('should annualize tracking error correctly for daily data', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.001, 0.002, -0.001, 0.003],
        benchmarkReturns: [0.001, 0.001, 0.000, 0.002],
        annualizationFactor: 252,
      });

      expect(result.trackingError).toBeGreaterThan(result.trackingErrorPeriod);
      expect(result.trackingError).toBeCloseTo(result.trackingErrorPeriod * Math.sqrt(252), 6);
    });

    it('should annualize tracking error correctly for monthly data', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.05, 0.03, 0.07, 0.02],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
        annualizationFactor: 12,
      });

      expect(result.trackingError).toBeCloseTo(result.trackingErrorPeriod * Math.sqrt(12), 6);
    });

    it('should handle annual data (no annualization)', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.10, 0.08, 0.12],
        benchmarkReturns: [0.09, 0.08, 0.11],
        annualizationFactor: 1,
      });

      expect(result.trackingError).toBeCloseTo(result.trackingErrorPeriod, 10);
    });
  });

  describe('Standard Deviation Methods', () => {
    const testReturns = [0.05, 0.03, 0.07, 0.02];
    const testBenchmark = [0.04, 0.03, 0.06, 0.02];

    it('should use sample standard deviation by default', () => {
      const result = calculateTrackingError({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
      });

      expect(result.method).toBe('sample');
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should use population standard deviation when specified', () => {
      const result = calculateTrackingError({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
        method: 'population',
      });

      expect(result.method).toBe('population');
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should give different results for sample vs population methods', () => {
      const sampleResult = calculateTrackingError({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
        method: 'sample',
      });

      const populationResult = calculateTrackingError({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
        method: 'population',
      });

      // Sample method should give slightly higher tracking error
      expect(sampleResult.trackingError).toBeGreaterThan(populationResult.trackingError);
    });
  });

  describe('Mathematical Properties', () => {
    it('should satisfy mathematical relationship for tracking error', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.05, 0.03, 0.07, 0.02, 0.04],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02, 0.03],
        annualizationFactor: 252,
      });

      // Manual calculation of tracking error
      const excessReturns = result.excessReturns;
      const meanExcess = result.meanExcessReturn;
      
      let variance = 0;
      for (const excess of excessReturns) {
        variance += Math.pow(excess - meanExcess, 2);
      }
      variance /= (excessReturns.length - 1); // sample method
      
      const expectedTrackingErrorPeriod = Math.sqrt(variance);
      const expectedTrackingError = expectedTrackingErrorPeriod * Math.sqrt(252);

      expect(result.trackingErrorPeriod).toBeCloseTo(expectedTrackingErrorPeriod, 10);
      expect(result.trackingError).toBeCloseTo(expectedTrackingError, 10);
    });

    it('should have zero tracking error when portfolio matches benchmark exactly', () => {
      const identicalReturns = [0.05, 0.03, 0.07, 0.02];

      const result = calculateTrackingError({
        portfolioReturns: identicalReturns,
        benchmarkReturns: identicalReturns,
      });

      expect(result.trackingError).toBeCloseTo(0, 10);
      expect(result.trackingErrorPeriod).toBeCloseTo(0, 10);
      expect(result.meanExcessReturn).toBeCloseTo(0, 10);
      expect(result.excessReturns.every(excess => excess === 0)).toBe(true);
    });

    it('should increase tracking error with higher volatility differences', () => {
      const lowVolResult = calculateTrackingError({
        portfolioReturns: [0.05, 0.04, 0.06, 0.05],
        benchmarkReturns: [0.04, 0.04, 0.05, 0.04],
      });

      const highVolResult = calculateTrackingError({
        portfolioReturns: [0.10, -0.05, 0.15, -0.02],
        benchmarkReturns: [0.04, 0.04, 0.05, 0.04],
      });

      expect(highVolResult.trackingError).toBeGreaterThan(lowVolResult.trackingError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum required periods', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.05, 0.03],
        benchmarkReturns: [0.04, 0.03],
      });

      expect(result.periods).toBe(2);
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should handle negative excess returns', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.03, 0.02, 0.04],
        benchmarkReturns: [0.05, 0.04, 0.06], // Higher benchmark returns
      });

      expect(result.excessReturns.every(excess => excess <= 0)).toBe(true);
      expect(result.meanExcessReturn).toBeLessThan(0);
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should handle mixed positive and negative excess returns', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.10, 0.02, 0.08, 0.04],
        benchmarkReturns: [0.05, 0.04, 0.06, 0.03],
      });

      const expectedExcessReturns = [0.05, -0.02, 0.02, 0.01];
      for (let i = 0; i < expectedExcessReturns.length; i++) {
        expect(result.excessReturns[i]).toBeCloseTo(expectedExcessReturns[i], 10);
      }
      expect(result.meanExcessReturn).toBeCloseTo(0.015, 3);
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should handle very small returns', () => {
      const result = calculateTrackingError({
        portfolioReturns: [0.0001, 0.0002, -0.0001, 0.0003],
        benchmarkReturns: [0.0001, 0.0001, 0.0000, 0.0002],
        annualizationFactor: 252,
      });

      expect(result.trackingError).toBeGreaterThan(0);
      expect(result.trackingErrorPeriod).toBeGreaterThan(0);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for mismatched array lengths', () => {
      expect(() => {
        calculateTrackingError({
          portfolioReturns: [0.05, 0.03, 0.07],
          benchmarkReturns: [0.04, 0.03], // Different length
        });
      }).toThrow('Portfolio and benchmark returns must have same length');
    });

    it('should throw error for insufficient periods', () => {
      expect(() => {
        calculateTrackingError({
          portfolioReturns: [0.05], // Only 1 period
          benchmarkReturns: [0.04],
        });
      }).toThrow(); // Zod validation error
    });

    it('should throw error for zero annualization factor', () => {
      expect(() => {
        calculateTrackingError({
          portfolioReturns: [0.05, 0.03],
          benchmarkReturns: [0.04, 0.03],
          annualizationFactor: 0,
        });
      }).toThrow();
    });

    it('should throw error for negative annualization factor', () => {
      expect(() => {
        calculateTrackingError({
          portfolioReturns: [0.05, 0.03],
          benchmarkReturns: [0.04, 0.03],
          annualizationFactor: -1,
        });
      }).toThrow();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical equity portfolio vs benchmark', () => {
      const portfolioReturns = [0.02, -0.01, 0.03, 0.01, 0.02, -0.02, 0.04, 0.01];
      const benchmarkReturns = [0.015, -0.008, 0.025, 0.012, 0.018, -0.015, 0.035, 0.008];

      const result = calculateTrackingError({
        portfolioReturns,
        benchmarkReturns,
        annualizationFactor: 252,
      });

      expect(result.trackingError).toBeGreaterThan(0);
      expect(result.trackingError).toBeLessThan(0.5); // Reasonable range for equity tracking error
      expect(result.meanExcessReturn).toBeCloseTo(0.003, 2);
    });

    it('should handle bond portfolio with low tracking error', () => {
      const portfolioReturns = [0.005, 0.006, 0.004, 0.007, 0.005];
      const benchmarkReturns = [0.005, 0.006, 0.005, 0.006, 0.005];

      const result = calculateTrackingError({
        portfolioReturns,
        benchmarkReturns,
        annualizationFactor: 252,
      });

      expect(result.trackingError).toBeLessThan(0.1); // Low tracking error for bonds
      expect(result.meanExcessReturn).toBeCloseTo(0.0002, 3);
    });
  });
});
