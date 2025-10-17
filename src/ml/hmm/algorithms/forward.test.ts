import { describe, expect, it } from 'vitest';

import { forward } from './forward';

describe('forward', () => {
  it('should compute forward probabilities with scaling', () => {
    // Simple 2-state HMM
    const observations = [
      [0.5],
      [1.0],
      [-0.5],
    ];
    
    const transitionMatrix = [
      [0.7, 0.3],
      [0.4, 0.6],
    ];
    
    const emissionParams = [
      { means: [0], variances: [1] },
      { means: [1], variances: [1] },
    ];
    
    const initialProbs = [0.6, 0.4];
    
    const result = forward(observations, transitionMatrix, emissionParams, initialProbs);
    
    // Check structure
    expect(result.alpha).toHaveLength(3);
    expect(result.alpha[0]).toHaveLength(2);
    expect(result.scalingFactors).toHaveLength(3);
    
    // Check that alpha rows are normalized (scaled)
    for (const alphaRow of result.alpha) {
      const sum = alphaRow.reduce((acc, val) => acc + val, 0);
      expect(sum).toBeCloseTo(1, 10);
    }
    
    // Log-likelihood should be finite
    expect(result.logLikelihood).not.toBe(-Infinity);
    expect(result.logLikelihood).not.toBe(Infinity);
  });

  it('should handle single observation', () => {
    const observations = [[0]];
    const transitionMatrix = [[0.7, 0.3], [0.4, 0.6]];
    const emissionParams = [
      { means: [0], variances: [1] },
      { means: [1], variances: [1] },
    ];
    const initialProbs = [0.5, 0.5];
    
    const result = forward(observations, transitionMatrix, emissionParams, initialProbs);
    
    expect(result.alpha).toHaveLength(1);
    expect(result.scalingFactors).toHaveLength(1);
  });
});

