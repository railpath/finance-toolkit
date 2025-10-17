import { describe, expect, it } from 'vitest';

import { viterbi } from './viterbi';

describe('viterbi', () => {
  it('should find most likely state sequence', () => {
    // Simple 2-state HMM
    const observations = [
      [0.5],
      [1.0],
      [-0.5],
    ];
    
    const transitionMatrix = [
      [0.9, 0.1],
      [0.1, 0.9],
    ];
    
    const emissionParams = [
      { means: [0], variances: [1] },
      { means: [1], variances: [1] },
    ];
    
    const initialProbs = [0.6, 0.4];
    
    const result = viterbi(observations, transitionMatrix, emissionParams, initialProbs);
    
    // Check structure
    expect(result.path).toHaveLength(3);
    expect(result.path.every(s => s === 0 || s === 1)).toBe(true);
    expect(result.logProbability).not.toBe(-Infinity);
  });

  it('should prefer state with higher emission probability', () => {
    const observations = [[2]]; // High value
    
    const transitionMatrix = [[0.5, 0.5], [0.5, 0.5]];
    
    const emissionParams = [
      { means: [0], variances: [1] }, // State 0: low mean
      { means: [2], variances: [1] }, // State 1: high mean
    ];
    
    const initialProbs = [0.5, 0.5];
    
    const result = viterbi(observations, transitionMatrix, emissionParams, initialProbs);
    
    // Should prefer state 1 (higher mean closer to observation)
    expect(result.path[0]).toBe(1);
  });
});

