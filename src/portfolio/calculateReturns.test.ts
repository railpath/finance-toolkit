import { calculateReturns } from './calculateReturns';

describe('calculateReturns', () => {
  const samplePrices = [100, 105, 110, 108, 115];

  describe('Simple Returns', () => {
    it('should calculate simple returns correctly', () => {
      const result = calculateReturns({
        prices: samplePrices,
        method: 'simple',
      });

      expect(result.method).toBe('simple');
      expect(result.returns).toHaveLength(4);
      expect(result.periods).toBe(4);
      expect(result.annualized).toBe(false);
      
      // Manual calculation: [(105-100)/100, (110-105)/105, (108-110)/110, (115-108)/108]
      const expectedReturns = [0.05, 0.047619, -0.018182, 0.064815];
      for (let i = 0; i < expectedReturns.length; i++) {
        expect(result.returns[i]).toBeCloseTo(expectedReturns[i], 5);
      }
    });

    it('should calculate total return correctly for simple returns', () => {
      const result = calculateReturns({
        prices: [100, 105, 110, 108, 115],
        method: 'simple',
      });

      // Manual calculation: (1.05 * 1.047619 * 0.981818 * 1.064815) - 1
      const expectedTotalReturn = 0.15; // 15% total return
      expect(result.totalReturn).toBeCloseTo(expectedTotalReturn, 5);
    });

    it('should handle price decreases', () => {
      const result = calculateReturns({
        prices: [100, 95, 90, 85],
        method: 'simple',
      });

      expect(result.returns).toHaveLength(3);
      expect(result.returns[0]).toBeCloseTo(-0.05, 5); // -5%
      expect(result.returns[1]).toBeCloseTo(-0.052632, 5); // ~-5.26%
      expect(result.returns[2]).toBeCloseTo(-0.055556, 5); // ~-5.56%
      expect(result.totalReturn).toBeCloseTo(-0.15, 5); // -15% total
    });

    it('should handle zero price change', () => {
      const result = calculateReturns({
        prices: [100, 100, 100, 100],
        method: 'simple',
      });

      expect(result.returns.every(return_ => return_ === 0)).toBe(true);
      expect(result.totalReturn).toBeCloseTo(0, 10);
      expect(result.meanReturn).toBeCloseTo(0, 10);
    });
  });

  describe('Log Returns', () => {
    it('should calculate log returns correctly', () => {
      const result = calculateReturns({
        prices: samplePrices,
        method: 'log',
      });

      expect(result.method).toBe('log');
      expect(result.returns).toHaveLength(4);
      expect(result.periods).toBe(4);
      
      // Manual calculation: [ln(105/100), ln(110/105), ln(108/110), ln(115/108)]
      expect(result.returns[0]).toBeCloseTo(Math.log(105/100), 5);
      expect(result.returns[1]).toBeCloseTo(Math.log(110/105), 5);
      expect(result.returns[2]).toBeCloseTo(Math.log(108/110), 5);
      expect(result.returns[3]).toBeCloseTo(Math.log(115/108), 5);
    });

    it('should calculate total log return correctly', () => {
      const result = calculateReturns({
        prices: [100, 105, 110, 108, 115],
        method: 'log',
      });

      // Total log return should equal ln(115/100) = ln(1.15)
      const expectedTotalLogReturn = Math.log(115 / 100);
      expect(result.totalLogReturn).toBeCloseTo(expectedTotalLogReturn, 10);
    });

    it('should handle price decreases', () => {
      const result = calculateReturns({
        prices: [100, 95, 90, 85],
        method: 'log',
      });

      expect(result.returns).toHaveLength(3);
      expect(result.returns[0]).toBeCloseTo(Math.log(95/100), 5); // ln(0.95)
      expect(result.returns[1]).toBeCloseTo(Math.log(90/95), 5);  // ln(0.947)
      expect(result.returns[2]).toBeCloseTo(Math.log(85/90), 5);  // ln(0.944)
      
      // Total log return should equal ln(85/100)
      expect(result.totalLogReturn).toBeCloseTo(Math.log(85/100), 10);
    });

    it('should handle zero price change', () => {
      const result = calculateReturns({
        prices: [100, 100, 100, 100],
        method: 'log',
      });

      expect(result.returns.every(return_ => return_ === 0)).toBe(true);
      expect(result.totalLogReturn).toBeCloseTo(0, 10);
      expect(result.meanReturn).toBeCloseTo(0, 10);
    });
  });

  describe('Annualization', () => {
    it('should annualize simple returns correctly', () => {
      const result = calculateReturns({
        prices: [100, 102, 104, 106, 108], // 2% per period
        method: 'simple',
        annualize: true,
        annualizationFactor: 4, // Quarterly data
      });

      expect(result.annualized).toBe(true);
      expect(result.annualizationFactor).toBe(4);
      
      // For simple returns: (1 + 0.02)^4 - 1
      const expectedAnnualized = Math.pow(1 + result.meanReturn, 4) - 1;
      expect(result.meanReturnAnnualized).toBeCloseTo(expectedAnnualized, 4);
      expect(result.standardDeviationAnnualized).toBeGreaterThan(0);
    });

    it('should annualize log returns correctly', () => {
      const result = calculateReturns({
        prices: [100, 102, 104, 106, 108], // ~2% per period
        method: 'log',
        annualize: true,
        annualizationFactor: 4, // Quarterly data
      });

      expect(result.annualized).toBe(true);
      
      // For log returns: mean_return * 4
      expect(result.meanReturnAnnualized).toBeCloseTo(result.meanReturn * 4, 6);
      expect(result.standardDeviationAnnualized).toBeCloseTo(
        result.standardDeviation * Math.sqrt(4), 6
      );
    });

    it('should handle daily data annualization', () => {
      const result = calculateReturns({
        prices: [100, 100.5, 101, 100.8, 101.2], // Small daily changes
        method: 'simple',
        annualize: true,
        annualizationFactor: 252, // Daily data
      });

      expect(result.annualizationFactor).toBe(252);
      expect(result.meanReturnAnnualized).toBeDefined();
      expect(result.standardDeviationAnnualized).toBeDefined();
    });

    it('should handle monthly data annualization', () => {
      const result = calculateReturns({
        prices: [100, 105, 110, 108, 115], // Monthly changes
        method: 'log',
        annualize: true,
        annualizationFactor: 12, // Monthly data
      });

      expect(result.annualizationFactor).toBe(12);
      expect(result.meanReturnAnnualized).toBeCloseTo(result.meanReturn * 12, 6);
      expect(result.standardDeviationAnnualized).toBeCloseTo(
        result.standardDeviation * Math.sqrt(12), 6
      );
    });
  });

  describe('Statistical Properties', () => {
    it('should calculate mean and standard deviation correctly', () => {
      const result = calculateReturns({
        prices: [100, 110, 100, 110, 100], // Alternating +10%, -9.09%
        method: 'simple',
      });

      // The alternating pattern doesn't result in exactly zero mean
      expect(Math.abs(result.meanReturn)).toBeLessThan(0.01); // Small mean
      expect(result.standardDeviation).toBeGreaterThan(0);
      expect(result.returns).toHaveLength(4);
    });

    it('should handle constant growth', () => {
      const result = calculateReturns({
        prices: [100, 110, 121, 133.1], // 10% constant growth
        method: 'simple',
      });

      expect(result.returns.every(return_ => Math.abs(return_ - 0.1) < 0.001)).toBe(true);
      expect(result.meanReturn).toBeCloseTo(0.1, 5);
      expect(result.standardDeviation).toBeCloseTo(0, 5);
    });

    it('should preserve additive property for log returns', () => {
      const prices = [100, 105, 110, 108, 115];
      const result = calculateReturns({
        prices,
        method: 'log',
      });

      // Sum of log returns should equal log of total return
      const sumOfLogReturns = result.returns.reduce((sum, return_) => sum + return_, 0);
      const totalLogReturn = Math.log(prices[prices.length - 1] / prices[0]);
      
      expect(sumOfLogReturns).toBeCloseTo(totalLogReturn, 10);
      expect(result.totalLogReturn).toBeCloseTo(totalLogReturn, 10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum required prices', () => {
      const result = calculateReturns({
        prices: [100, 105],
        method: 'simple',
      });

      expect(result.returns).toHaveLength(1);
      expect(result.returns[0]).toBeCloseTo(0.05, 5);
      expect(result.totalReturn).toBeCloseTo(0.05, 5);
    });

    it('should handle very small price changes', () => {
      const result = calculateReturns({
        prices: [100, 100.001, 100.002, 100.001],
        method: 'log',
      });

      expect(result.returns).toHaveLength(3);
      expect(result.returns.every(return_ => Math.abs(return_) < 0.001)).toBe(true);
    });

    it('should handle large price changes', () => {
      const result = calculateReturns({
        prices: [100, 200, 300, 150], // 100%, 50%, -50%
        method: 'simple',
      });

      expect(result.returns).toHaveLength(3);
      expect(result.returns[0]).toBeCloseTo(1.0, 5); // 100%
      expect(result.returns[1]).toBeCloseTo(0.5, 5);  // 50%
      expect(result.returns[2]).toBeCloseTo(-0.5, 5); // -50%
    });
  });

  describe('Input Validation', () => {
    it('should throw error for insufficient prices', () => {
      expect(() => {
        calculateReturns({
          prices: [100], // Only 1 price
          method: 'simple',
        });
      }).toThrow(); // Zod validation error
    });

    it('should throw error for zero or negative prices', () => {
      expect(() => {
        calculateReturns({
          prices: [100, 0, 105], // Zero price
          method: 'simple',
        });
      }).toThrow(); // Zod validation error for non-positive prices
    });

    it('should throw error for negative prices', () => {
      expect(() => {
        calculateReturns({
          prices: [100, -10, 105], // Negative price
          method: 'simple',
        });
      }).toThrow(); // Zod validation error for negative prices
    });

    it('should throw error for zero annualization factor', () => {
      expect(() => {
        calculateReturns({
          prices: [100, 105, 110],
          annualizationFactor: 0,
        });
      }).toThrow();
    });

    it('should throw error for negative annualization factor', () => {
      expect(() => {
        calculateReturns({
          prices: [100, 105, 110],
          annualizationFactor: -1,
        });
      }).toThrow();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle daily stock prices', () => {
      const dailyPrices = [100, 100.5, 99.8, 101.2, 100.9, 102.1, 101.5];
      const result = calculateReturns({
        prices: dailyPrices,
        method: 'simple',
        annualize: true,
        annualizationFactor: 252,
      });

      expect(result.returns).toHaveLength(6);
      expect(result.annualized).toBe(true);
      expect(result.meanReturnAnnualized).toBeDefined();
      expect(result.standardDeviationAnnualized).toBeDefined();
    });

    it('should handle monthly index returns', () => {
      const monthlyPrices = [1000, 1020, 1015, 1035, 1040, 1025, 1050];
      const result = calculateReturns({
        prices: monthlyPrices,
        method: 'log',
        annualize: true,
        annualizationFactor: 12,
      });

      expect(result.returns).toHaveLength(6);
      expect(result.method).toBe('log');
      expect(result.totalLogReturn).toBeCloseTo(Math.log(1050/1000), 5);
    });

    it('should handle bond price data', () => {
      const bondPrices = [100, 99.5, 99.8, 100.1, 100.3, 100.0]; // Small fluctuations
      const result = calculateReturns({
        prices: bondPrices,
        method: 'simple',
        annualize: true,
        annualizationFactor: 252,
      });

      expect(result.returns.every(return_ => Math.abs(return_) < 0.01)).toBe(true); // Small returns
      expect(result.standardDeviation).toBeLessThan(0.01); // Low volatility
    });
  });
});
