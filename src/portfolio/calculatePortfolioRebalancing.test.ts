import { calculatePortfolioRebalancing } from './calculatePortfolioRebalancing';

describe('calculatePortfolioRebalancing', () => {
  describe('Fixed Rebalancing', () => {
    it('should rebalance to exact target weights', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
      });

      expect(result.method).toBe('fixed');
      expect(result.newWeights[0]).toBeCloseTo(0.5, 10);
      expect(result.newWeights[1]).toBeCloseTo(0.5, 10);
      expect(result.rebalancingNeeded).toBe(true);
      expect(result.assetsToRebalance).toBe(2);
    });

    it('should calculate trade amounts correctly', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
      });

      // Asset 1: reduce from 60% to 50% = -10% = -10,000
      // Asset 2: increase from 40% to 50% = +10% = +10,000
      expect(result.tradeAmounts[0]).toBeCloseTo(-10000, 2);
      expect(result.tradeAmounts[1]).toBeCloseTo(10000, 2);
      expect(result.totalTradeAmount).toBeCloseTo(20000, 2);
    });

    it('should handle no rebalancing needed', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.5, 0.5],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
      });

      expect(result.rebalancingNeeded).toBe(false);
      expect(result.assetsToRebalance).toBe(0);
      expect(result.tradeAmounts.every(amount => Math.abs(amount) < 1e-10)).toBe(true);
      expect(result.totalTradeAmount).toBeCloseTo(0, 10);
    });

    it('should handle three-asset portfolio', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.5, 0.3, 0.2],
        targetWeights: [0.4, 0.4, 0.2],
        portfolioValue: 100000,
        method: 'fixed',
      });

      expect(result.newWeights).toHaveLength(3);
      expect(result.newWeights[0]).toBeCloseTo(0.4, 10);
      expect(result.newWeights[1]).toBeCloseTo(0.4, 10);
      expect(result.newWeights[2]).toBeCloseTo(0.2, 10);
      expect(result.assetsToRebalance).toBe(2); // Assets 0 and 1 change
    });
  });

  describe('Proportional Rebalancing', () => {
    it('should scale weights proportionally', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'proportional',
      });

      expect(result.method).toBe('proportional');
      expect(result.newWeights).toHaveLength(2);
      expect(result.newWeights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 10);
    });

    it('should maintain relative ratios in proportional rebalancing', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4], // 3:2 ratio
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'proportional',
      });

      // In proportional rebalancing, the 3:2 ratio should be maintained
      const ratio = result.newWeights[0] / result.newWeights[1];
      expect(ratio).toBeCloseTo(1.5, 5); // 3/2 = 1.5
    });
  });

  describe('Transaction Costs', () => {
    it('should calculate transaction costs correctly', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
        transactionCosts: 0.001, // 0.1%
        includeTransactionCosts: true,
      });

      expect(result.totalTransactionCosts).toBeGreaterThan(0);
      expect(result.portfolioValueAfterCosts).toBeLessThan(100000);
      
      // Transaction costs should be 0.1% of total trade amount
      const expectedCosts = result.totalTradeAmount * 0.001;
      expect(result.totalTransactionCosts).toBeCloseTo(expectedCosts, 2);
    });

    it('should handle zero transaction costs', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
        transactionCosts: 0,
        includeTransactionCosts: true,
      });

      expect(result.totalTransactionCosts).toBeCloseTo(0, 10);
      expect(result.portfolioValueAfterCosts).toBeCloseTo(100000, 10);
    });

    it('should not include transaction costs when flag is false', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
        transactionCosts: 0.001,
        includeTransactionCosts: false,
      });

      expect(result.totalTransactionCosts).toBeCloseTo(0, 10);
      expect(result.portfolioValueAfterCosts).toBeCloseTo(100000, 10);
    });
  });

  describe('Minimum Trade Size', () => {
    it('should filter out trades below minimum threshold', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.5001, 0.4999],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
        minTradeSize: 0.001, // 0.1%
      });

      // Trades are very small (0.01% and -0.01%), below 0.1% threshold
      expect(result.assetsToRebalance).toBe(0);
      expect(result.rebalancingNeeded).toBe(false);
      expect(result.tradeAmounts.every(amount => Math.abs(amount) < 1000)).toBe(true);
    });

    it('should allow trades above minimum threshold', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.51, 0.49],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
        minTradeSize: 0.001, // 0.1%
      });

      // Trades are 1% and -1%, above 0.1% threshold
      expect(result.assetsToRebalance).toBe(2);
      expect(result.rebalancingNeeded).toBe(true);
      expect(result.tradeAmounts[0]).toBeCloseTo(-1000, 2); // -1%
      expect(result.tradeAmounts[1]).toBeCloseTo(1000, 2);  // +1%
    });
  });

  describe('Portfolio Metrics', () => {
    it('should calculate turnover correctly', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
      });

      // Total trade amount = 20,000, turnover = 20,000 / 2 / 100,000 = 0.1 = 10%
      expect(result.turnover).toBeCloseTo(0.1, 5);
    });

    it('should calculate trade percentages correctly', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 100000,
        method: 'fixed',
      });

      expect(result.tradePercentages[0]).toBeCloseTo(-0.1, 5); // -10%
      expect(result.tradePercentages[1]).toBeCloseTo(0.1, 5);  // +10%
    });

    it('should handle large portfolio values', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 1000000, // 1M portfolio
        method: 'fixed',
      });

      expect(result.tradeAmounts[0]).toBeCloseTo(-100000, 2); // -100k
      expect(result.tradeAmounts[1]).toBeCloseTo(100000, 2);  // +100k
      expect(result.totalTradeAmount).toBeCloseTo(200000, 2); // 200k total
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small portfolio values', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.6, 0.4],
        targetWeights: [0.5, 0.5],
        portfolioValue: 1000,
        method: 'fixed',
      });

      expect(result.tradeAmounts[0]).toBeCloseTo(-100, 2); // -100
      expect(result.tradeAmounts[1]).toBeCloseTo(100, 2);  // +100
      expect(result.totalTradeAmount).toBeCloseTo(200, 2); // 200 total
    });

    it('should handle fractional weights', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.3333, 0.3333, 0.3334],
        targetWeights: [0.3333, 0.3333, 0.3334],
        portfolioValue: 100000,
        method: 'fixed',
      });

      expect(result.rebalancingNeeded).toBe(false);
      expect(result.assetsToRebalance).toBe(0);
    });

    it('should handle weights that sum to 1 within tolerance', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.5, 0.499999, 0.000001],
        targetWeights: [0.5, 0.5, 0.0],
        portfolioValue: 100000,
        method: 'fixed',
      });

      expect(result.newWeights).toHaveLength(3);
      expect(result.newWeights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 10);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for mismatched array lengths', () => {
      expect(() => {
        calculatePortfolioRebalancing({
          currentWeights: [0.6, 0.4],
          targetWeights: [0.5], // Different length
          portfolioValue: 100000,
        });
      }).toThrow(); // Zod validation error
    });

    it('should throw error for insufficient assets', () => {
      expect(() => {
        calculatePortfolioRebalancing({
          currentWeights: [1.0], // Only 1 asset
          targetWeights: [1.0],
          portfolioValue: 100000,
        });
      }).toThrow(); // Zod validation error
    });

    it('should throw error for weights not summing to 1', () => {
      expect(() => {
        calculatePortfolioRebalancing({
          currentWeights: [0.6, 0.3], // Sum = 0.9
          targetWeights: [0.5, 0.5],
          portfolioValue: 100000,
        });
      }).toThrow('Current weights sum to');
    });

    it('should throw error for negative portfolio value', () => {
      expect(() => {
        calculatePortfolioRebalancing({
          currentWeights: [0.5, 0.5],
          targetWeights: [0.5, 0.5],
          portfolioValue: -100000,
        });
      }).toThrow();
    });

    it('should throw error for zero portfolio value', () => {
      expect(() => {
        calculatePortfolioRebalancing({
          currentWeights: [0.5, 0.5],
          targetWeights: [0.5, 0.5],
          portfolioValue: 0,
        });
      }).toThrow();
    });

    it('should throw error for invalid min trade size', () => {
      expect(() => {
        calculatePortfolioRebalancing({
          currentWeights: [0.5, 0.5],
          targetWeights: [0.5, 0.5],
          portfolioValue: 100000,
          minTradeSize: -0.1, // Negative
        });
      }).toThrow();
    });

    it('should throw error for invalid transaction costs', () => {
      expect(() => {
        calculatePortfolioRebalancing({
          currentWeights: [0.5, 0.5],
          targetWeights: [0.5, 0.5],
          portfolioValue: 100000,
          transactionCosts: -0.1, // Negative
        });
      }).toThrow();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle 60/40 stock/bond rebalancing', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.65, 0.35], // Drifted from 60/40
        targetWeights: [0.6, 0.4],
        portfolioValue: 500000,
        method: 'fixed',
        transactionCosts: 0.001, // 0.1%
        includeTransactionCosts: true,
      });

      expect(result.newWeights[0]).toBeCloseTo(0.6, 10);
      expect(result.newWeights[1]).toBeCloseTo(0.4, 10);
      expect(result.tradeAmounts[0]).toBeCloseTo(-25000, 2); // Sell 25k stocks
      expect(result.tradeAmounts[1]).toBeCloseTo(25000, 2);  // Buy 25k bonds
      expect(result.totalTransactionCosts).toBeGreaterThan(0);
    });

    it('should handle sector rotation', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.3, 0.3, 0.2, 0.2], // 4 sectors
        targetWeights: [0.25, 0.25, 0.25, 0.25], // Equal weight
        portfolioValue: 1000000,
        method: 'fixed',
      });

      expect(result.newWeights).toEqual([0.25, 0.25, 0.25, 0.25]);
      expect(result.assetsToRebalance).toBe(4);
      // Manual calculation: trades are [5%, -5%, 5%, 5%] = 20% total, turnover = 10%
      expect(result.turnover).toBeCloseTo(0.1, 5); // 10% turnover
    });

    it('should handle risk parity rebalancing', () => {
      const result = calculatePortfolioRebalancing({
        currentWeights: [0.4, 0.4, 0.2],
        targetWeights: [0.33, 0.33, 0.34], // Risk parity weights
        portfolioValue: 200000,
        method: 'fixed',
        minTradeSize: 0.005, // 0.5% minimum
      });

      expect(result.newWeights[0]).toBeCloseTo(0.33, 5);
      expect(result.newWeights[1]).toBeCloseTo(0.33, 5);
      expect(result.newWeights[2]).toBeCloseTo(0.34, 5);
      expect(result.assetsToRebalance).toBe(3);
    });
  });
});
