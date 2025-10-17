import { describe, expect, it } from 'vitest';

import { initializeHMM } from './initializeHMM';

describe('initializeHMM', () => {
  it('should initialize HMM with correct dimensions', () => {
    const observations = Array.from({ length: 100 }, (_, i) => [
      Math.sin(i * 0.1),
      Math.cos(i * 0.1),
    ]);
    
    const numStates = 3;
    const model = initializeHMM(observations, numStates);
    
    expect(model.numStates).toBe(3);
    expect(model.numFeatures).toBe(2);
    expect(model.transitionMatrix).toHaveLength(3);
    expect(model.transitionMatrix[0]).toHaveLength(3);
    expect(model.emissionParams).toHaveLength(3);
    expect(model.initialProbs).toHaveLength(3);
  });

  it('should have normalized transition matrix', () => {
    const observations = Array.from({ length: 50 }, () => [Math.random()]);
    const model = initializeHMM(observations, 2);
    
    for (const row of model.transitionMatrix) {
      const sum = row.reduce((acc, val) => acc + val, 0);
      expect(sum).toBeCloseTo(1, 10);
    }
  });

  it('should have normalized initial probabilities', () => {
    const observations = Array.from({ length: 50 }, () => [Math.random()]);
    const model = initializeHMM(observations, 2);
    
    const sum = model.initialProbs.reduce((acc, val) => acc + val, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it('should have positive variances', () => {
    const observations = Array.from({ length: 50 }, () => [Math.random()]);
    const model = initializeHMM(observations, 2);
    
    for (const params of model.emissionParams) {
      expect(params.variances.every(v => v > 0)).toBe(true);
    }
  });
});

