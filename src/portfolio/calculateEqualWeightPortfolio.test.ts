import { calculateEqualWeightPortfolio } from './calculateEqualWeightPortfolio';

describe('calculateEqualWeightPortfolio', () => {
  describe('Basic Equal Weight Calculations', () => {
    it('should calculate equal weights correctly', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 5,
        sumTo1: true,
      });

      expect(result.numberOfAssets).toBe(5);
      expect(result.equalWeight).toBeCloseTo(0.2, 10); // 1/5 = 0.2
      expect(result.weights).toHaveLength(5);
      expect(result.weights.every(weight => Math.abs(weight - 0.2) < 1e-10)).toBe(true);
      expect(result.totalWeight).toBeCloseTo(1, 10);
      expect(result.sumTo1).toBe(true);
    });

    it('should handle different numbers of assets', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 3,
        sumTo1: true,
      });

      expect(result.equalWeight).toBeCloseTo(1/3, 10);
      expect(result.weights).toEqual([1/3, 1/3, 1/3]);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle large portfolios', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 100,
        sumTo1: true,
      });

      expect(result.equalWeight).toBeCloseTo(0.01, 10); // 1/100 = 0.01
      expect(result.weights).toHaveLength(100);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle minimum required assets', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 2,
        sumTo1: true,
      });

      expect(result.equalWeight).toBeCloseTo(0.5, 10);
      expect(result.weights).toEqual([0.5, 0.5]);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });
  });

  describe('Constraints', () => {
    it('should handle minimum weight constraint', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 10,
        minWeight: 0.1, // 10% minimum
        sumTo1: true,
      });

      expect(result.weights.every(weight => weight >= 0.1)).toBe(true);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle maximum weight constraint', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 3,
        maxWeight: 0.4, // 40% maximum
        sumTo1: true,
      });

      expect(result.weights.every(weight => weight <= 0.4)).toBe(true);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle both min and max constraints', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 5,
        minWeight: 0.15, // 15% minimum
        maxWeight: 0.25, // 25% maximum
        sumTo1: true,
      });

      expect(result.weights.every(weight => weight >= 0.15 && weight <= 0.25)).toBe(true);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle sumTo1 = false', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 4,
        sumTo1: false,
      });

      expect(result.equalWeight).toBeCloseTo(0.25, 10);
      expect(result.totalWeight).toBeCloseTo(1, 10); // Still sums to 1 by default
    });

    it('should rebalance when constraints change total weight', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 3,
        minWeight: 0.3, // Forces total > 1, then rebalances
        sumTo1: true,
      });

      // With minWeight = 0.3 and 3 assets, each gets 0.3, total = 0.9
      // After rebalancing: each gets 0.9/3 = 0.3, but this violates minWeight constraint
      // So the algorithm should handle this gracefully
      expect(result.totalWeight).toBeCloseTo(1, 10);
      
      // All weights should be equal after rebalancing
      const firstWeight = result.weights[0];
      expect(result.weights.every(weight => Math.abs(weight - firstWeight) < 1e-10)).toBe(true);
    });
  });

  describe('Mathematical Properties', () => {
    it('should satisfy 1/N property for unconstrained case', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 7,
        sumTo1: true,
      });

      const expectedWeight = 1 / 7;
      expect(result.equalWeight).toBeCloseTo(expectedWeight, 10);
      expect(result.weights.every(weight => Math.abs(weight - expectedWeight) < 1e-10)).toBe(true);
    });

    it('should have equal weights when no constraints', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 6,
        sumTo1: true,
      });

      const firstWeight = result.weights[0];
      expect(result.weights.every(weight => Math.abs(weight - firstWeight) < 1e-10)).toBe(true);
    });

    it('should maintain equal weights after constraint application and rebalancing', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 5,
        minWeight: 0.18, // Forces rebalancing
        sumTo1: true,
      });

      // After rebalancing, all weights should still be equal
      const firstWeight = result.weights[0];
      expect(result.weights.every(weight => Math.abs(weight - firstWeight) < 1e-10)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum number of assets', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 2,
        sumTo1: true,
      });

      expect(result.numberOfAssets).toBe(2);
      expect(result.weights).toEqual([0.5, 0.5]);
    });

    it('should handle constraints that are satisfied by equal weights', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 4,
        minWeight: 0.2, // 1/4 = 0.25, so no adjustment needed
        maxWeight: 0.3,
        sumTo1: true,
      });

      expect(result.weights).toEqual([0.25, 0.25, 0.25, 0.25]);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle very tight constraints', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 3,
        minWeight: 0.33,
        maxWeight: 0.34,
        sumTo1: true,
      });

      expect(result.weights.every(weight => weight >= 0.33 && weight <= 0.34)).toBe(true);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for insufficient assets', () => {
      expect(() => {
        calculateEqualWeightPortfolio({
          numberOfAssets: 1, // Need at least 2
          sumTo1: true,
        });
      }).toThrow();
    });

    it('should throw error for zero assets', () => {
      expect(() => {
        calculateEqualWeightPortfolio({
          numberOfAssets: 0,
          sumTo1: true,
        });
      }).toThrow();
    });

    it('should throw error for negative assets', () => {
      expect(() => {
        calculateEqualWeightPortfolio({
          numberOfAssets: -1, 
          sumTo1: true,
        });
      }).toThrow();
    });

    it('should throw error for non-integer assets', () => {
      expect(() => {
        calculateEqualWeightPortfolio({
          numberOfAssets: 3.5,
          sumTo1: true,
        });
      }).toThrow();
    });

    it('should throw error for invalid min weight', () => {
      expect(() => {
        calculateEqualWeightPortfolio({
          numberOfAssets: 5,
          minWeight: -0.1, // Negative weight
          sumTo1: true,
        });
      }).toThrow();
    });

    it('should throw error for invalid max weight', () => {
      expect(() => {
        calculateEqualWeightPortfolio({
          numberOfAssets: 5,
          maxWeight: 1.5, // Weight > 1
          sumTo1: true,
        });
      }).toThrow();
    });

    it('should throw error for min weight > max weight', () => {
      expect(() => {
        calculateEqualWeightPortfolio({
          numberOfAssets: 5,
          minWeight: 0.3,
          maxWeight: 0.2, // Min > Max
          sumTo1: true,
        });
      }).toThrow();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle S&P 500 equal weight', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 500,
        sumTo1: true,
      });

      expect(result.equalWeight).toBeCloseTo(0.002, 5); // 1/500 = 0.002
      expect(result.weights).toHaveLength(500);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle sector allocation with constraints', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 11, // 11 GICS sectors
        minWeight: 0.05, // 5% minimum per sector
        maxWeight: 0.15, // 15% maximum per sector
        sumTo1: true,
      });

      expect(result.weights.every(weight => weight >= 0.05 && weight <= 0.15)).toBe(true);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });

    it('should handle bond portfolio equal weighting', () => {
      const result = calculateEqualWeightPortfolio({
        numberOfAssets: 20, // 20 different bonds
        sumTo1: true,
      });

      expect(result.equalWeight).toBeCloseTo(0.05, 5); // 5% per bond
      expect(result.weights).toHaveLength(20);
      expect(result.totalWeight).toBeCloseTo(1, 10);
    });
  });
});
