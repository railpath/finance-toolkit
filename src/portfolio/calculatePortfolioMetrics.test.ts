import { calculatePortfolioMetrics } from './calculatePortfolioMetrics';

describe('calculatePortfolioMetrics', () => {
  describe('Basic Metrics Calculation', () => {
    it('should calculate basic portfolio metrics correctly', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 108000, 102000, 110000],
        riskFreeRate: 0.02,
        annualizationFactor: 12, // Monthly data
      });

      expect(result.periods).toBe(5);
      expect(result.years).toBeCloseTo(4/12, 5); // 4 periods / 12 months
      expect(result.totalReturn).toBeCloseTo(0.1, 5); // (110000 - 100000) / 100000
      expect(result.cagr).toBeGreaterThan(0);
      expect(result.maxDrawdown).toBeGreaterThan(0);
      expect(result.volatility).toBeGreaterThan(0);
      expect(result.sharpeRatio).toBeDefined();
      expect(result.sortinoRatio).toBeDefined();
      expect(result.valueAtRisk).toBeLessThanOrEqual(0); // VaR should be negative or zero
      expect(result.expectedShortfall).toBeLessThanOrEqual(0); // ES should be negative or zero
    });

    it('should calculate CAGR correctly for different time periods', () => {
      const result1 = calculatePortfolioMetrics({
        portfolioValues: [100000, 110000], // 1 period
        annualizationFactor: 12, // Monthly
      });

      const result2 = calculatePortfolioMetrics({
        portfolioValues: [100000, 110000], // 1 period
        annualizationFactor: 252, // Daily
      });

      // CAGR should be higher for daily data (shorter time period)
      expect(result2.cagr).toBeGreaterThan(result1.cagr);
    });

    it('should handle constant portfolio values', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 100000, 100000, 100000],
        annualizationFactor: 12,
      });

      expect(result.totalReturn).toBeCloseTo(0, 5);
      expect(result.cagr).toBeCloseTo(0, 5);
      expect(result.maxDrawdown).toBeCloseTo(0, 5);
      expect(result.volatility).toBeCloseTo(0, 5);
      expect(result.sharpeRatio).toBe(0); // No risk premium
    });

    it('should handle declining portfolio values', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 95000, 90000, 85000],
        annualizationFactor: 12,
      });

      expect(result.totalReturn).toBeLessThan(0);
      expect(result.cagr).toBeLessThan(0);
      expect(result.maxDrawdown).toBeGreaterThan(0);
    });
  });

  describe('Drawdown Calculations', () => {
    it('should calculate max drawdown correctly', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 120000, 90000, 110000, 80000, 100000], // Peak at 120k, trough at 80k
        annualizationFactor: 12,
      });

      // Max drawdown should be from 120k to 80k = 40k
      expect(result.maxDrawdown).toBeCloseTo(40000, 5);
      expect(result.maxDrawdownPercent).toBeCloseTo(40000/120000, 5);
    });

    it('should calculate current drawdown correctly', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 120000, 90000, 110000, 100000], // Peak at 120k, current at 100k
        annualizationFactor: 12,
      });

      // Current drawdown should be from 120k to 100k = 20k
      expect(result.currentDrawdown).toBeCloseTo(20000, 5);
      expect(result.currentDrawdownPercent).toBeCloseTo(20000/120000, 5);
    });

    it('should handle no drawdown scenario', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 110000, 115000], // Always increasing
        annualizationFactor: 12,
      });

      expect(result.maxDrawdown).toBeCloseTo(0, 5);
      expect(result.maxDrawdownPercent).toBeCloseTo(0, 5);
      expect(result.currentDrawdown).toBeCloseTo(0, 5);
      expect(result.currentDrawdownPercent).toBeCloseTo(0, 5);
    });

    it('should handle portfolio at all-time high', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 95000, 90000, 120000], // New peak at end
        annualizationFactor: 12,
      });

      // Current drawdown should be 0 (at peak)
      expect(result.currentDrawdown).toBeCloseTo(0, 5);
      expect(result.currentDrawdownPercent).toBeCloseTo(0, 5);
    });
  });

  describe('Risk-Adjusted Metrics', () => {
    it('should calculate Sharpe ratio correctly', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 110000, 115000],
        riskFreeRate: 0.02,
        annualizationFactor: 12,
      });

      expect(result.sharpeRatio).toBeDefined();
      expect(result.sharpeRatio).toBeGreaterThan(0); // Should be positive for positive returns
    });

    it('should calculate Sortino ratio correctly', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 110000, 115000],
        riskFreeRate: 0.02,
        annualizationFactor: 12,
      });

      expect(result.sortinoRatio).toBeDefined();
      expect(result.sortinoRatio).toBeGreaterThanOrEqual(0);
    });

    it('should handle zero volatility scenario', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 100000, 100000, 100000],
        riskFreeRate: 0.02,
        annualizationFactor: 12,
      });

      expect(result.sharpeRatio).toBe(0); // No excess return, no risk
      expect(result.sortinoRatio).toBe(0); // No downside risk
    });

    it('should handle negative risk-adjusted ratios', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 95000, 90000, 85000], // Declining portfolio
        riskFreeRate: 0.02,
        annualizationFactor: 12,
      });

      expect(result.sharpeRatio).toBeLessThan(0); // Negative excess return
      expect(result.sortinoRatio).toBeLessThan(0); // Negative excess return
    });
  });

  describe('VaR and Expected Shortfall', () => {
    it('should calculate VaR and Expected Shortfall', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 98000, 102000, 95000, 108000],
        confidenceLevel: 0.05, // 5% VaR
        annualizationFactor: 12,
      });

      expect(result.valueAtRisk).toBeLessThanOrEqual(0); // VaR should be negative or zero
      // ES should be more negative than VaR (when both are calculated) or equal to 0
      expect(result.expectedShortfall).toBeLessThanOrEqual(0);
      expect(result.confidenceLevel).toBe(0.05);
    });

    it('should handle different confidence levels', () => {
      const result95 = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 98000, 102000, 95000, 108000],
        confidenceLevel: 0.05, // 5% VaR
        annualizationFactor: 12,
      });

      const result99 = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 98000, 102000, 95000, 108000],
        confidenceLevel: 0.01, // 1% VaR
        annualizationFactor: 12,
      });

      // 99% VaR should be more negative than 95% VaR
      expect(result99.valueAtRisk).toBeLessThan(result95.valueAtRisk);
      expect(result99.expectedShortfall).toBeLessThanOrEqual(result95.expectedShortfall);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for insufficient portfolio values', () => {
      expect(() => {
        calculatePortfolioMetrics({
          portfolioValues: [100000], // Only 1 value
        });
      }).toThrow();
    });

    it('should throw error for negative portfolio values', () => {
      expect(() => {
        calculatePortfolioMetrics({
          portfolioValues: [100000, -50000], // Negative value
        });
      }).toThrow();
    });

    it('should throw error for zero portfolio values', () => {
      expect(() => {
        calculatePortfolioMetrics({
          portfolioValues: [100000, 0], // Zero value
        });
      }).toThrow();
    });

    it('should throw error for invalid confidence level', () => {
      expect(() => {
        calculatePortfolioMetrics({
          portfolioValues: [100000, 105000],
          confidenceLevel: 1.5, // Invalid confidence level
        });
      }).toThrow();
    });

    it('should throw error for invalid annualization factor', () => {
      expect(() => {
        calculatePortfolioMetrics({
          portfolioValues: [100000, 105000],
          annualizationFactor: 0, // Invalid factor
        });
      }).toThrow();
    });

    it('should handle mismatched dates length gracefully', () => {
      // The schema allows optional dates, so mismatched length should not throw
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000, 110000],
        dates: [new Date(), new Date()], // Mismatched length - should be ignored
      });
      expect(result.periods).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single period (no returns)', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 105000], // Only 2 values = 1 period
        annualizationFactor: 12,
      });

      expect(result.periods).toBe(2);
      expect(result.years).toBeCloseTo(1/12, 5); // 1 period / 12 months
      expect(result.totalReturn).toBeCloseTo(0.05, 5); // 5% return
    });

    it('should handle very short time periods', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 101000, 102000],
        annualizationFactor: 252, // Daily data
      });

      expect(result.years).toBeCloseTo(2/252, 5); // Very short period
      expect(result.cagr).toBeGreaterThan(0);
    });

    it('should handle very long time periods', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [100000, 200000], // 100% return
        annualizationFactor: 1, // Annual data
      });

      expect(result.years).toBeCloseTo(1, 5); // 1 year
      expect(result.cagr).toBeCloseTo(1, 5); // 100% CAGR
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle equity portfolio performance', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [
          100000, 102000, 98000, 105000, 110000, 108000, 115000, 112000, 120000
        ],
        riskFreeRate: 0.025,
        annualizationFactor: 12, // Monthly data
        confidenceLevel: 0.05,
      });

      expect(result.totalReturn).toBeGreaterThan(0); // 20% total return
      expect(result.cagr).toBeGreaterThan(0);
      expect(result.maxDrawdown).toBeGreaterThan(0);
      expect(result.sharpeRatio).toBeGreaterThan(0);
      expect(result.sortinoRatio).toBeGreaterThan(0);
      expect(result.volatility).toBeGreaterThan(0);
    });

    it('should handle bond portfolio performance', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [
          100000, 100500, 101000, 101200, 101500, 102000, 102200, 102500
        ],
        riskFreeRate: 0.015,
        annualizationFactor: 12, // Monthly data
        confidenceLevel: 0.05,
      });

      expect(result.totalReturn).toBeGreaterThan(0);
      expect(result.cagr).toBeGreaterThan(0);
      expect(result.volatility).toBeLessThan(0.1); // Lower volatility than equity
      expect(result.maxDrawdown).toBeLessThan(1000); // Small drawdowns
    });

    it('should handle volatile portfolio performance', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [
          100000, 120000, 80000, 130000, 70000, 140000, 90000, 150000
        ],
        riskFreeRate: 0.02,
        annualizationFactor: 12,
        confidenceLevel: 0.05,
      });

      expect(result.totalReturn).toBeGreaterThan(0); // 50% total return
      expect(result.volatility).toBeGreaterThan(0.2); // High volatility
      expect(result.maxDrawdown).toBeGreaterThan(30000); // Large drawdowns
      expect(result.sharpeRatio).toBeGreaterThan(0); // Still positive Sharpe despite volatility
    });

    it('should handle bear market scenario', () => {
      const result = calculatePortfolioMetrics({
        portfolioValues: [
          100000, 95000, 90000, 85000, 80000, 75000, 70000, 65000
        ],
        riskFreeRate: 0.02,
        annualizationFactor: 12,
        confidenceLevel: 0.05,
      });

      expect(result.totalReturn).toBeLessThan(0); // -35% total return
      expect(result.cagr).toBeLessThan(0);
      expect(result.maxDrawdown).toBeGreaterThan(30000); // Large drawdown
      expect(result.sharpeRatio).toBeLessThan(0); // Negative Sharpe ratio
    });
  });
});
