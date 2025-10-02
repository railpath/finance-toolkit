import { calculateInformationRatio } from './calculateInformationRatio';

describe('calculateInformationRatio', () => {
  const portfolioReturns = [0.05, 0.03, 0.07, 0.02, 0.04];
  const benchmarkReturns = [0.04, 0.03, 0.06, 0.02, 0.03];

  describe('Basic Calculations', () => {
    it('should calculate information ratio correctly', () => {
      const result = calculateInformationRatio({
        portfolioReturns,
        benchmarkReturns,
        annualizationFactor: 252,
      });

      expect(result.informationRatio).toBeDefined();
      expect(result.informationRatioPeriod).toBeDefined();
      expect(result.meanExcessReturn).toBeDefined();
      expect(result.trackingError).toBeGreaterThan(0);
      expect(result.periods).toBe(5);
      expect(result.annualizationFactor).toBe(252);
      expect(result.method).toBe('sample');
    });

    it('should calculate excess returns correctly', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.05, 0.03, 0.07],
        benchmarkReturns: [0.04, 0.03, 0.06],
      });

      const expectedExcessReturns = [0.01, 0.00, 0.01];
      expect(result.excessReturns[0]).toBeCloseTo(expectedExcessReturns[0], 10);
      expect(result.excessReturns[1]).toBeCloseTo(expectedExcessReturns[1], 10);
      expect(result.excessReturns[2]).toBeCloseTo(expectedExcessReturns[2], 10);
      expect(result.meanExcessReturnPeriod).toBeCloseTo(0.00667, 5);
    });

    it('should handle zero excess returns', () => {
      const portfolioReturns = [0.05, 0.03, 0.07];
      const benchmarkReturns = [0.05, 0.03, 0.07];

      const result = calculateInformationRatio({
        portfolioReturns,
        benchmarkReturns,
      });

      expect(result.informationRatio).toBeCloseTo(0, 10);
      expect(result.informationRatioPeriod).toBeCloseTo(0, 10);
      expect(result.meanExcessReturn).toBeCloseTo(0, 10);
      expect(result.trackingError).toBeCloseTo(0, 10);
    });
  });

  describe('Information Ratio Formula', () => {
    it('should satisfy IR = mean excess return / tracking error', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.05, 0.03, 0.07, 0.02],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
        annualizationFactor: 252,
      });

      // Manual calculation
      const expectedIRPeriod = result.meanExcessReturnPeriod / result.trackingErrorPeriod;
      const expectedIR = result.meanExcessReturn / result.trackingError;

      expect(result.informationRatioPeriod).toBeCloseTo(expectedIRPeriod, 10);
      expect(result.informationRatio).toBeCloseTo(expectedIR, 10);
    });

    it('should handle positive information ratio (outperforming)', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.10, 0.08, 0.12, 0.06],
        benchmarkReturns: [0.05, 0.04, 0.06, 0.03], // Lower benchmark returns
      });

      expect(result.informationRatio).toBeGreaterThan(0);
      expect(result.meanExcessReturn).toBeGreaterThan(0);
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should handle negative information ratio (underperforming)', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.03, 0.02, 0.04, 0.01],
        benchmarkReturns: [0.05, 0.04, 0.06, 0.03], // Higher benchmark returns
      });

      expect(result.informationRatio).toBeLessThan(0);
      expect(result.meanExcessReturn).toBeLessThan(0);
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should handle infinite information ratio (zero tracking error)', () => {
      const portfolioReturns = [0.05, 0.05, 0.05, 0.05];
      const benchmarkReturns = [0.04, 0.04, 0.04, 0.04]; // Constant excess return

      const result = calculateInformationRatio({
        portfolioReturns,
        benchmarkReturns,
      });

      expect(result.trackingError).toBeCloseTo(0, 10);
      expect(result.informationRatio).toBeGreaterThan(1000); // Very large number instead of Infinity
      expect(result.informationRatioPeriod).toBeGreaterThan(1000);
    });

    it('should handle negative infinite information ratio', () => {
      const portfolioReturns = [0.03, 0.03, 0.03, 0.03];
      const benchmarkReturns = [0.05, 0.05, 0.05, 0.05]; // Constant negative excess return

      const result = calculateInformationRatio({
        portfolioReturns,
        benchmarkReturns,
      });

      expect(result.trackingError).toBeCloseTo(0, 10);
      expect(result.informationRatio).toBeLessThan(-1000); // Very large negative number
      expect(result.informationRatioPeriod).toBeLessThan(-1000);
    });
  });

  describe('Annualization', () => {
    it('should annualize correctly for daily data', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.001, 0.002, -0.001, 0.003],
        benchmarkReturns: [0.001, 0.001, 0.000, 0.002],
        annualizationFactor: 252,
      });

      expect(result.meanExcessReturn).toBeCloseTo(result.meanExcessReturnPeriod * 252, 6);
      expect(result.trackingError).toBeCloseTo(result.trackingErrorPeriod * Math.sqrt(252), 6);
      expect(result.informationRatio).toBeCloseTo(
        result.meanExcessReturn / result.trackingError, 6
      );
    });

    it('should annualize correctly for monthly data', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.05, 0.03, 0.07, 0.02],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
        annualizationFactor: 12,
      });

      expect(result.meanExcessReturn).toBeCloseTo(result.meanExcessReturnPeriod * 12, 6);
      expect(result.trackingError).toBeCloseTo(result.trackingErrorPeriod * Math.sqrt(12), 6);
    });

    it('should handle annual data (no annualization)', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.10, 0.08, 0.12],
        benchmarkReturns: [0.09, 0.08, 0.11],
        annualizationFactor: 1,
      });

      expect(result.meanExcessReturn).toBeCloseTo(result.meanExcessReturnPeriod, 10);
      expect(result.trackingError).toBeCloseTo(result.trackingErrorPeriod, 10);
      expect(result.informationRatio).toBeCloseTo(result.informationRatioPeriod, 10);
    });
  });

  describe('Standard Deviation Methods', () => {
    const testReturns = [0.05, 0.03, 0.07, 0.02];
    const testBenchmark = [0.04, 0.03, 0.06, 0.02];

    it('should use sample standard deviation by default', () => {
      const result = calculateInformationRatio({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
      });

      expect(result.method).toBe('sample');
      expect(result.informationRatio).toBeDefined();
    });

    it('should use population standard deviation when specified', () => {
      const result = calculateInformationRatio({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
        method: 'population',
      });

      expect(result.method).toBe('population');
      expect(result.informationRatio).toBeDefined();
    });

    it('should give different results for sample vs population methods', () => {
      const sampleResult = calculateInformationRatio({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
        method: 'sample',
      });

      const populationResult = calculateInformationRatio({
        portfolioReturns: testReturns,
        benchmarkReturns: testBenchmark,
        method: 'population',
      });

      // Sample method should give different tracking error and thus different IR
      expect(sampleResult.trackingError).not.toBe(populationResult.trackingError);
      expect(sampleResult.informationRatio).not.toBe(populationResult.informationRatio);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum required periods', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.05, 0.03],
        benchmarkReturns: [0.04, 0.03],
      });

      expect(result.periods).toBe(2);
      expect(result.informationRatio).toBeDefined();
    });

    it('should handle very small returns', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.0001, 0.0002, -0.0001, 0.0003],
        benchmarkReturns: [0.0001, 0.0001, 0.0000, 0.0002],
        annualizationFactor: 252,
      });

      expect(result.informationRatio).toBeDefined();
      expect(result.meanExcessReturn).toBeDefined();
      expect(result.trackingError).toBeGreaterThan(0);
    });

    it('should handle mixed performance periods', () => {
      const result = calculateInformationRatio({
        portfolioReturns: [0.10, -0.05, 0.15, -0.02, 0.08],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02, 0.05],
      });

      expect(result.informationRatio).toBeDefined();
      expect(result.meanExcessReturn).toBeDefined();
      expect(result.trackingError).toBeGreaterThan(0);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for mismatched array lengths', () => {
      expect(() => {
        calculateInformationRatio({
          portfolioReturns: [0.05, 0.03, 0.07],
          benchmarkReturns: [0.04, 0.03], // Different length
        });
      }).toThrow('Portfolio and benchmark returns must have same length');
    });

    it('should throw error for insufficient periods', () => {
      expect(() => {
        calculateInformationRatio({
          portfolioReturns: [0.05], // Only 1 period
          benchmarkReturns: [0.04],
        });
      }).toThrow(); // Zod validation error
    });

    it('should throw error for zero annualization factor', () => {
      expect(() => {
        calculateInformationRatio({
          portfolioReturns: [0.05, 0.03],
          benchmarkReturns: [0.04, 0.03],
          annualizationFactor: 0,
        });
      }).toThrow();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical equity portfolio vs benchmark', () => {
      const portfolioReturns = [0.02, -0.01, 0.03, 0.01, 0.02, -0.02, 0.04, 0.01];
      const benchmarkReturns = [0.015, -0.008, 0.025, 0.012, 0.018, -0.015, 0.035, 0.008];

      const result = calculateInformationRatio({
        portfolioReturns,
        benchmarkReturns,
        annualizationFactor: 252,
      });

      expect(result.informationRatio).toBeDefined();
      // Manual calculation of mean excess return
      const excessReturns = portfolioReturns.map((p, i) => p - benchmarkReturns[i]);
      const meanExcessPeriod = excessReturns.reduce((sum, excess) => sum + excess, 0) / excessReturns.length;
      expect(result.meanExcessReturn).toBeCloseTo(meanExcessPeriod * 252, 2);
      expect(result.trackingError).toBeGreaterThan(0);
      expect(result.trackingError).toBeLessThan(0.5); // Reasonable range
    });

    it('should handle bond portfolio with low tracking error', () => {
      const portfolioReturns = [0.005, 0.006, 0.004, 0.007, 0.005];
      const benchmarkReturns = [0.005, 0.006, 0.005, 0.006, 0.005];

      const result = calculateInformationRatio({
        portfolioReturns,
        benchmarkReturns,
        annualizationFactor: 252,
      });

      expect(result.trackingError).toBeLessThan(0.1); // Low tracking error for bonds
      // Manual calculation: excess returns are [0, 0, -0.001, 0.001, 0], mean = 0
      expect(result.meanExcessReturn).toBeCloseTo(0, 3);
    });

    it('should handle hedge fund with high information ratio', () => {
      const portfolioReturns = [0.08, 0.12, 0.06, 0.10, 0.09];
      const benchmarkReturns = [0.04, 0.05, 0.03, 0.04, 0.04];

      const result = calculateInformationRatio({
        portfolioReturns,
        benchmarkReturns,
        annualizationFactor: 12,
      });

      expect(result.informationRatio).toBeGreaterThan(1); // High IR for hedge fund
      expect(result.meanExcessReturn).toBeGreaterThan(0);
    });
  });
});
