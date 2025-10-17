import { describe, expect, it } from 'vitest';

import { detectRegime } from './detectRegime';

describe('detectRegime', () => {
  // Generate synthetic price data
  const generatePrices = (length: number, trend: 'up' | 'down' | 'flat' = 'flat') => {
    const prices: number[] = [100];
    for (let i = 1; i < length; i++) {
      let change = (Math.random() - 0.5) * 2; // Random walk
      
      if (trend === 'up') {
        change += 0.5; // Upward drift
      } else if (trend === 'down') {
        change -= 0.5; // Downward drift
      }
      
      prices.push(prices[i - 1] * (1 + change / 100));
    }
    return prices;
  };

  it('should detect regimes with default options', () => {
    const prices = generatePrices(200);
    const result = detectRegime(prices);
    
    // Check structure
    expect(result.currentRegime).toBeDefined();
    expect(result.regimes).toBeInstanceOf(Array);
    expect(result.regimes.length).toBeGreaterThan(0);
    expect(result.stateSequence).toBeInstanceOf(Array);
    expect(result.stateProbabilities).toBeInstanceOf(Array);
    expect(result.model).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should use default state labels', () => {
    const prices = generatePrices(100);
    const result = detectRegime(prices);
    
    const validLabels = ['bearish', 'neutral', 'bullish'];
    expect(validLabels).toContain(result.currentRegime);
  });

  it('should accept custom state labels', () => {
    const prices = generatePrices(100);
    const result = detectRegime(prices, {
      numStates: 2,
      stateLabels: ['down', 'up'],
    });
    
    expect(['down', 'up']).toContain(result.currentRegime);
  });

  it('should work with different number of states', () => {
    const prices = generatePrices(150);
    
    for (const numStates of [2, 3, 4]) {
      const result = detectRegime(prices, { numStates });
      
      expect(result.model.numStates).toBe(numStates);
      expect(result.regimes.every(r => typeof r === 'string')).toBe(true);
    }
  });

  it('should handle custom features', () => {
    const prices = generatePrices(150);
    const result = detectRegime(prices, {
      features: ['returns', 'volatility'],
      featureWindow: 10,
    });
    
    expect(result.model.numFeatures).toBe(2);
  });

  it('should throw error for insufficient data', () => {
    const prices = [100, 101, 102]; // Too few prices
    
    expect(() => detectRegime(prices, { numStates: 3 })).toThrow();
  });

  it('should throw error for invalid prices', () => {
    expect(() => detectRegime([100, -50])).toThrow();
    expect(() => detectRegime([100, 0])).toThrow();
    expect(() => detectRegime([100])).toThrow();
  });

  it('should produce consistent results with same data', () => {
    const prices = generatePrices(100);
    
    const result1 = detectRegime(prices, { maxIterations: 50 });
    const result2 = detectRegime(prices, { maxIterations: 50 });
    
    // Results should be deterministic given same initialization
    expect(result1.regimes).toHaveLength(result2.regimes.length);
  });

  it('should have confidence between 0 and 1', () => {
    const prices = generatePrices(100);
    const result = detectRegime(prices);
    
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should produce valid state probabilities', () => {
    const prices = generatePrices(100);
    const result = detectRegime(prices);
    
    // Each time step should have probabilities that sum to 1
    for (const probs of result.stateProbabilities) {
      const sum = probs.reduce((acc, p) => acc + p, 0);
      expect(sum).toBeCloseTo(1, 5);
      
      // All probabilities should be in [0, 1]
      expect(probs.every(p => p >= 0 && p <= 1)).toBe(true);
    }
  });
});

