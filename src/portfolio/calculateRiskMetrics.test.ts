import { calculateRiskMetrics } from './calculateRiskMetrics';

describe('calculateRiskMetrics', () => {
  describe('Beta Calculation', () => {
    it('should calculate beta correctly', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02], // Asset 1
          [0.04, 0.02, 0.06, 0.01], // Asset 2
        ],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
        riskFreeRate: 0.02,
      });

      expect(result.betas).toHaveLength(2);
      expect(result.betas[0]).toBeDefined();
      expect(result.betas[1]).toBeDefined();
      expect(result.riskFreeRate).toBe(0.02);
    });

    it('should handle beta = 1 for assets that move with benchmark', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.04, 0.03, 0.06, 0.02], // Same as benchmark
        ],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
      });

      expect(result.betas[0]).toBeCloseTo(1, 5);
    });

    it('should handle beta > 1 for volatile assets', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.08, 0.06, 0.12, 0.04], // 2x benchmark
        ],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
      });

      expect(result.betas[0]).toBeCloseTo(2, 2);
    });

    it('should handle beta < 1 for defensive assets', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.02, 0.015, 0.03, 0.01], // 0.5x benchmark
        ],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
      });

      expect(result.betas[0]).toBeCloseTo(0.5, 2);
    });

    it('should handle no benchmark (NaN betas)', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02],
          [0.04, 0.02, 0.06, 0.01],
        ],
        // No benchmark provided
      });

      expect(result.betas).toHaveLength(2);
      expect(result.betas[0]).toBe(0); // No benchmark, beta = 0
      expect(result.betas[1]).toBe(0); // No benchmark, beta = 0
    });
  });

  describe('Correlation Matrix', () => {
    it('should calculate correlation matrix correctly', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02],
          [0.04, 0.02, 0.06, 0.01],
          [0.06, 0.04, 0.08, 0.03],
        ],
      });

      expect(result.correlationMatrix).toHaveLength(3);
      expect(result.correlationMatrix[0]).toHaveLength(3);
      
      // Diagonal should be 1.0 (perfect correlation with itself)
      expect(result.correlationMatrix[0][0]).toBeCloseTo(1, 5);
      expect(result.correlationMatrix[1][1]).toBeCloseTo(1, 5);
      expect(result.correlationMatrix[2][2]).toBeCloseTo(1, 5);
      
      // Matrix should be symmetric
      expect(result.correlationMatrix[0][1]).toBeCloseTo(result.correlationMatrix[1][0], 5);
      expect(result.correlationMatrix[0][2]).toBeCloseTo(result.correlationMatrix[2][0], 5);
      expect(result.correlationMatrix[1][2]).toBeCloseTo(result.correlationMatrix[2][1], 5);
    });

    it('should handle perfect positive correlation', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02],
          [0.05, 0.03, 0.07, 0.02], // Identical to first asset
        ],
      });

      expect(result.correlationMatrix[0][1]).toBeCloseTo(1, 5);
      expect(result.correlationMatrix[1][0]).toBeCloseTo(1, 5);
    });

    it('should handle perfect negative correlation', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02],
          [-0.05, -0.03, -0.07, -0.02], // Opposite of first asset
        ],
      });

      expect(result.correlationMatrix[0][1]).toBeCloseTo(-1, 5);
      expect(result.correlationMatrix[1][0]).toBeCloseTo(-1, 5);
    });

    it('should handle no correlation', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02],
          [0.02, 0.06, 0.01, 0.08], // Random returns
        ],
      });

      expect(Math.abs(result.correlationMatrix[0][1])).toBeLessThan(1);
      expect(Math.abs(result.correlationMatrix[1][0])).toBeLessThan(1);
    });
  });

  describe('Downside Deviation', () => {
    it('should calculate downside deviation correctly', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, -0.02, 0.07, -0.01], // Mixed positive/negative returns
          [0.03, 0.01, 0.04, 0.02],   // All positive returns
        ],
        confidenceLevel: 0.0, // Use zero as threshold
      });

      expect(result.downsideDeviations).toHaveLength(2);
      expect(result.downsideDeviationsAnnualized).toHaveLength(2);
      
      // First asset should have higher downside deviation (has negative returns)
      expect(result.downsideDeviations[0]).toBeGreaterThan(0);
      expect(result.downsideDeviations[1]).toBeCloseTo(0, 5); // No negative returns
    });

    it('should annualize downside deviation correctly', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, -0.02, 0.07, -0.01],
        ],
        annualizationFactor: 252, // Daily data
        confidenceLevel: 0.0,
      });

      const expectedAnnualized = result.downsideDeviations[0] * Math.sqrt(252);
      expect(result.downsideDeviationsAnnualized[0]).toBeCloseTo(expectedAnnualized, 5);
    });

    it('should handle different confidence levels', () => {
      const result1 = calculateRiskMetrics({
        assetReturns: [
          [0.05, -0.02, 0.07, -0.01],
        ],
        confidenceLevel: 0.0, // Zero threshold
      });

      const result2 = calculateRiskMetrics({
        assetReturns: [
          [0.05, -0.02, 0.07, -0.01],
        ],
        confidenceLevel: 0.02, // 2% threshold
      });

      expect(result1.downsideDeviations[0]).not.toBe(result2.downsideDeviations[0]);
    });

    it('should handle all positive returns (zero downside deviation)', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02], // All positive
        ],
        confidenceLevel: 0.0,
      });

      expect(result.downsideDeviations[0]).toBeCloseTo(0, 5);
      expect(result.downsideDeviationsAnnualized[0]).toBeCloseTo(0, 5);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for mismatched asset return lengths', () => {
      expect(() => {
        calculateRiskMetrics({
          assetReturns: [
            [0.05, 0.03, 0.07], // 3 periods
            [0.04, 0.02, 0.06, 0.01], // 4 periods
          ],
        });
      }).toThrow('Asset 1 returns length must match other assets');
    });

    it('should throw error for mismatched benchmark length', () => {
      expect(() => {
        calculateRiskMetrics({
          assetReturns: [
            [0.05, 0.03, 0.07, 0.02],
          ],
          benchmarkReturns: [0.04, 0.03], // Different length
        });
      }).toThrow('Benchmark returns length must match asset returns length');
    });

    it('should throw error for invalid confidence level', () => {
      expect(() => {
        calculateRiskMetrics({
          assetReturns: [[0.05, 0.03, 0.07, 0.02]],
          confidenceLevel: -0.1, // Negative
        });
      }).toThrow();
    });

    it('should throw error for invalid annualization factor', () => {
      expect(() => {
        calculateRiskMetrics({
          assetReturns: [[0.05, 0.03, 0.07, 0.02]],
          annualizationFactor: 0, // Zero
        });
      }).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single asset', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.03, 0.07, 0.02],
        ],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
      });

      expect(result.assets).toBe(1);
      expect(result.periods).toBe(4);
      expect(result.betas).toHaveLength(1);
      expect(result.correlationMatrix).toHaveLength(1);
      expect(result.correlationMatrix[0]).toHaveLength(1);
      expect(result.correlationMatrix[0][0]).toBeCloseTo(1, 5);
    });

    it('should handle single period', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05],
          [0.04],
        ],
        benchmarkReturns: [0.04],
      });

      expect(result.assets).toBe(2);
      expect(result.periods).toBe(1);
      // With only 1 period, correlation and beta cannot be calculated meaningfully (replaced NaN with 0)
      expect(result.betas[0]).toBe(0);
      expect(result.betas[1]).toBe(0);
    });

    it('should handle zero variance assets', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.05, 0.05, 0.05, 0.05], // Constant returns
          [0.04, 0.02, 0.06, 0.01], // Variable returns
        ],
        benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
      });

      // Beta should be 0 for constant returns (replaced NaN with 0)
      expect(result.betas[0]).toBe(0);
      expect(result.betas[1]).toBeDefined();
      
      // Downside deviation should be 0 for constant positive returns
      expect(result.downsideDeviations[0]).toBeCloseTo(0, 5);
    });

    it('should handle negative returns', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [-0.05, -0.03, -0.07, -0.02], // All negative
          [0.04, 0.02, 0.06, 0.01],     // All positive
        ],
      });

      expect(result.downsideDeviations[0]).toBeGreaterThan(0);
      expect(result.downsideDeviations[1]).toBeGreaterThan(0); // All negative returns have downside deviation
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle equity portfolio risk metrics', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.08, 0.05, 0.12, 0.03, -0.02], // Technology stocks
          [0.04, 0.02, 0.06, 0.01, 0.01],  // Utilities
          [0.06, 0.04, 0.08, 0.03, -0.01], // Healthcare
        ],
        benchmarkReturns: [0.05, 0.03, 0.07, 0.02, 0.00],
        riskFreeRate: 0.02,
        annualizationFactor: 252,
      });

      expect(result.assets).toBe(3);
      expect(result.periods).toBe(5);
      expect(result.betas).toHaveLength(3);
      expect(result.correlationMatrix).toHaveLength(3);
      expect(result.downsideDeviations).toHaveLength(3);
    });

    it('should handle bond portfolio risk metrics', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.005, 0.006, 0.004, 0.007, 0.005], // Government bonds
          [0.008, 0.009, 0.007, 0.010, 0.008], // Corporate bonds
          [0.003, 0.004, 0.002, 0.005, 0.003], // Money market
        ],
        benchmarkReturns: [0.005, 0.006, 0.004, 0.007, 0.005],
        annualizationFactor: 252,
      });

      expect(result.assets).toBe(3);
      expect(result.betas).toHaveLength(3);
      expect(result.correlationMatrix).toHaveLength(3);
      expect(result.downsideDeviations).toHaveLength(3);
    });

    it('should handle mixed asset portfolio', () => {
      const result = calculateRiskMetrics({
        assetReturns: [
          [0.08, 0.05, 0.12, 0.03, -0.02], // Stocks
          [0.005, 0.006, 0.004, 0.007, 0.005], // Bonds
          [0.15, -0.05, 0.20, -0.10, 0.08], // Alternative investments
        ],
        benchmarkReturns: [0.05, 0.03, 0.07, 0.02, 0.00],
        riskFreeRate: 0.02,
        annualizationFactor: 252,
      });

      expect(result.assets).toBe(3);
      expect(result.periods).toBe(5);
      
      // Alternative investments should have higher downside deviation
      expect(result.downsideDeviations[2]).toBeGreaterThan(result.downsideDeviations[1]);
      
      // Bonds should have lower beta than stocks
      expect(result.betas[1]).toBeLessThan(result.betas[0]);
    });
  });
});
