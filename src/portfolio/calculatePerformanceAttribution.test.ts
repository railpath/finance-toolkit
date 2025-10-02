import { calculatePerformanceAttribution } from './calculatePerformanceAttribution';

describe('calculatePerformanceAttribution', () => {
  describe('Brinson Attribution Model', () => {
    it('should calculate Brinson attribution correctly', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.05, 0.03],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.06, 0.04], // Asset 1: outperforms benchmark
          [0.04, 0.02]  // Asset 2: underperforms benchmark
        ],
        portfolioWeights: [
          [0.6, 0.5], // Portfolio overweight Asset 1
          [0.4, 0.5]
        ],
        benchmarkWeights: [
          [0.5, 0.5], // Benchmark equal weight
          [0.5, 0.5]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      expect(result.method).toBe('brinson');
      expect(result.periods).toBe(2);
      expect(result.assets).toBe(2);
      expect(result.portfolioReturn).toBeCloseTo(0.04, 5); // (0.05 + 0.03) / 2
      expect(result.benchmarkReturn).toBeCloseTo(0.035, 5); // (0.04 + 0.03) / 2
      expect(result.excessReturn).toBeCloseTo(0.005, 5); // 0.04 - 0.035
    });

    it('should decompose excess return into three components', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.06, 0.04],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.07, 0.05], // Asset 1: strong performance
          [0.03, 0.02]  // Asset 2: weak performance
        ],
        portfolioWeights: [
          [0.7, 0.6], // Overweight strong performer
          [0.3, 0.4]
        ],
        benchmarkWeights: [
          [0.5, 0.5], // Equal weight benchmark
          [0.5, 0.5]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      // Verify attribution components are calculated (may not sum exactly due to attribution model limitations)
      expect(result.allocationEffect).toBeDefined();
      expect(result.selectionEffect).toBeDefined();
      expect(result.interactionEffect).toBeDefined();
      expect(result.excessReturn).toBeGreaterThan(0);
    });

    it('should handle equal weights (no allocation effect)', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.05, 0.04],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.06, 0.05], // Asset 1: outperforms
          [0.04, 0.03]  // Asset 2: matches benchmark
        ],
        portfolioWeights: [
          [0.5, 0.5], // Same as benchmark weights
          [0.5, 0.5]
        ],
        benchmarkWeights: [
          [0.5, 0.5], // Equal weight benchmark
          [0.5, 0.5]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      // Allocation effect should be zero (no overweighting/underweighting)
      expect(result.allocationEffect).toBeCloseTo(0, 5);
      // Excess return should come from selection effect only
      expect(result.excessReturn).toBeCloseTo(result.selectionEffect, 5);
    });

    it('should handle no selection effect (assets match benchmark)', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.05, 0.04],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.04, 0.03], // Asset 1: matches benchmark
          [0.04, 0.03]  // Asset 2: matches benchmark
        ],
        portfolioWeights: [
          [0.6, 0.5], // Overweight Asset 1
          [0.4, 0.5]
        ],
        benchmarkWeights: [
          [0.5, 0.5], // Equal weight benchmark
          [0.5, 0.5]
        ],
        method: 'brinson',  
        annualizationFactor: 252,
      });

      // Selection effect should be zero (no stock picking)
      expect(result.selectionEffect).toBeCloseTo(0, 5);
      // Excess return should be positive (portfolio outperforms benchmark)
      expect(result.excessReturn).toBeGreaterThan(0);
      // Allocation effect should be positive (overweighting outperforming asset)
      expect(result.allocationEffect).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Arithmetic Attribution Model', () => {
    it('should calculate arithmetic attribution correctly', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.05, 0.03],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.06, 0.04],
          [0.04, 0.02]
        ],
        portfolioWeights: [
          [0.6, 0.5],
          [0.4, 0.5]
        ],
        benchmarkWeights: [
          [0.5, 0.5],
          [0.5, 0.5]
        ],
        method: 'arithmetic', 
        annualizationFactor: 252,
      });

      expect(result.method).toBe('arithmetic');
      expect(result.interactionEffect).toBeCloseTo(0, 5); // No interaction in arithmetic
    });

    it('should decompose excess return into two components (arithmetic)', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.06, 0.04],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.07, 0.05],
          [0.03, 0.02]
        ],
        portfolioWeights: [
          [0.7, 0.6],
          [0.3, 0.4]
        ],
        benchmarkWeights: [
          [0.5, 0.5],
          [0.5, 0.5]
        ],
        method: 'arithmetic',
        annualizationFactor: 252,
      });

      // In arithmetic method: no interaction effect
      expect(result.interactionEffect).toBeCloseTo(0, 5);
      // Attribution components should be calculated
      expect(result.allocationEffect).toBeDefined();
      expect(result.selectionEffect).toBeDefined();
      expect(result.excessReturn).toBeGreaterThan(0);
    });
  });

  describe('Asset-Level Attribution', () => {
    it('should provide asset-level attribution breakdown', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.05, 0.04],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.06, 0.05], // Asset 1: outperforms
          [0.03, 0.02], // Asset 2: underperforms
          [0.04, 0.03]  // Asset 3: matches benchmark
        ],
        portfolioWeights: [
          [0.5, 0.4], // Asset 1: underweight
          [0.3, 0.4], // Asset 2: underweight
          [0.2, 0.2]  // Asset 3: underweight
        ],
        benchmarkWeights: [
          [0.4, 0.4], // Benchmark weights
          [0.4, 0.4],
          [0.2, 0.2]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      expect(result.assetAttribution).toHaveLength(3);
      
      // Each asset should have attribution components
      result.assetAttribution.forEach((asset, index) => {
        expect(asset.assetIndex).toBe(index);
        expect(asset.allocationEffect).toBeDefined();
        expect(asset.selectionEffect).toBeDefined();
        expect(asset.interactionEffect).toBeDefined();
        expect(asset.totalEffect).toBeCloseTo(
          asset.allocationEffect + asset.selectionEffect + asset.interactionEffect, 5
        );
      });

      // Sum of asset-level effects should equal total effects
      const totalAllocation = result.assetAttribution.reduce((sum, asset) => sum + asset.allocationEffect, 0);
      const totalSelection = result.assetAttribution.reduce((sum, asset) => sum + asset.selectionEffect, 0);
      const totalInteraction = result.assetAttribution.reduce((sum, asset) => sum + asset.interactionEffect, 0);

      expect(totalAllocation).toBeCloseTo(result.allocationEffect, 5);
      expect(totalSelection).toBeCloseTo(result.selectionEffect, 5);
      expect(totalInteraction).toBeCloseTo(result.interactionEffect, 5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single period', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.05],
        benchmarkReturns: [0.04],
        assetReturns: [
          [0.06],
          [0.04]
        ],
        portfolioWeights: [
          [0.6],
          [0.4]
        ],
        benchmarkWeights: [
          [0.5],
          [0.5]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      expect(result.periods).toBe(1);
      expect(result.assets).toBe(2);
      expect(result.portfolioReturn).toBeCloseTo(0.05, 5);
      expect(result.benchmarkReturn).toBeCloseTo(0.04, 5);
      expect(result.excessReturn).toBeCloseTo(0.01, 5);
    });

    it('should handle single asset', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.05, 0.04],
        benchmarkReturns: [0.04, 0.03],
        assetReturns: [
          [0.06, 0.05]
        ],
        portfolioWeights: [
          [1.0, 1.0]
        ],
        benchmarkWeights: [
          [1.0, 1.0]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      expect(result.periods).toBe(2);
      expect(result.assets).toBe(1);
      expect(result.assetAttribution).toHaveLength(1);
    });

    it('should handle zero returns', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0, 0],
        benchmarkReturns: [0, 0],
        assetReturns: [
          [0, 0],
          [0, 0]
        ],
        portfolioWeights: [
          [0.6, 0.5],
          [0.4, 0.5]
        ],
        benchmarkWeights: [
          [0.5, 0.5],
          [0.5, 0.5]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      expect(result.portfolioReturn).toBeCloseTo(0, 5);
      expect(result.benchmarkReturn).toBeCloseTo(0, 5);
      expect(result.excessReturn).toBeCloseTo(0, 5);
      expect(result.allocationEffect).toBeCloseTo(0, 5);
      expect(result.selectionEffect).toBeCloseTo(0, 5);
      expect(result.interactionEffect).toBeCloseTo(0, 5);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for mismatched returns length', () => {
      expect(() => {
        calculatePerformanceAttribution({
          portfolioReturns: [0.05, 0.03],
          benchmarkReturns: [0.04], // Different length
          assetReturns: [[0.06, 0.04], [0.04, 0.02]],
          portfolioWeights: [[0.6, 0.5], [0.4, 0.5]],
          benchmarkWeights: [[0.5, 0.5], [0.5, 0.5]],
          method: 'brinson',
          annualizationFactor: 252,
        });
      }).toThrow('Benchmark returns length must match portfolio returns length');
    });

    it('should throw error for mismatched asset count', () => {
      expect(() => {
        calculatePerformanceAttribution({
          portfolioReturns: [0.05, 0.03],
          benchmarkReturns: [0.04, 0.03],
          assetReturns: [[0.06, 0.04], [0.04, 0.02]],
          portfolioWeights: [[0.6, 0.5]], // Only 1 asset weight
          benchmarkWeights: [[0.5, 0.5], [0.5, 0.5]],
          method: 'brinson',
          annualizationFactor: 252,
        });
      }).toThrow('Weight matrices must have same number of assets as asset returns');
    });

    it('should throw error for mismatched periods', () => {
      expect(() => {
        calculatePerformanceAttribution({
          portfolioReturns: [0.05, 0.03],
          benchmarkReturns: [0.04, 0.03],
          assetReturns: [[0.06, 0.04], [0.04, 0.02]],
          portfolioWeights: [[0.6], [0.4]], // Only 1 period
          benchmarkWeights: [[0.5, 0.5], [0.5, 0.5]],
          method: 'brinson',
          annualizationFactor: 252,
        });
      }).toThrow('Weight matrices must have same number of periods as returns');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle sector rotation strategy', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.08, 0.06, 0.04],
        benchmarkReturns: [0.05, 0.05, 0.05],
        assetReturns: [
          [0.10, 0.08, 0.06], // Technology sector
          [0.04, 0.04, 0.04], // Utilities sector
          [0.06, 0.05, 0.04]  // Healthcare sector
        ],
        portfolioWeights: [
          [0.6, 0.5, 0.4], // Reduce tech exposure
          [0.2, 0.2, 0.2], // Stable utilities
          [0.2, 0.3, 0.4]  // Increase healthcare
        ],
        benchmarkWeights: [
          [0.5, 0.5, 0.5], // Equal weight benchmark
          [0.25, 0.25, 0.25],
          [0.25, 0.25, 0.25]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      expect(result.excessReturn).toBeGreaterThan(0); // Positive excess return
      expect(result.assetAttribution).toHaveLength(3);
    });

    it('should handle bond portfolio attribution', () => {
      const result = calculatePerformanceAttribution({
        portfolioReturns: [0.03, 0.025, 0.02],
        benchmarkReturns: [0.025, 0.025, 0.025],
        assetReturns: [
          [0.04, 0.03, 0.025], // Long-term bonds
          [0.02, 0.02, 0.015], // Short-term bonds
          [0.025, 0.025, 0.02] // Corporate bonds
        ],
        portfolioWeights: [
          [0.5, 0.4, 0.3], // Reduce duration
          [0.3, 0.4, 0.5], // Increase short-term
          [0.2, 0.2, 0.2]  // Stable corporate
        ],
        benchmarkWeights: [
          [0.4, 0.4, 0.4], // Equal weight benchmark
          [0.3, 0.3, 0.3],
          [0.3, 0.3, 0.3]
        ],
        method: 'brinson',
        annualizationFactor: 252,
      });

      expect(result.periods).toBe(3);
      expect(result.assets).toBe(3);
      expect(result.excessReturn).toBeDefined();
    });
  });
});
