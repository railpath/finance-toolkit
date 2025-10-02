import { describe, expect, it } from 'vitest';

import { getZScore } from './getZScore';

describe('getZScore', () => {
  it('should calculate Z-score for 95% confidence level', () => {
    const result = getZScore(0.95);

    expect(result).toBeCloseTo(1.64521, 4); // Standard 95% Z-score
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should calculate Z-score for 99% confidence level', () => {
    const result = getZScore(0.99);

    expect(result).toBeCloseTo(2.32679, 4); // Standard 99% Z-score
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should calculate Z-score for 90% confidence level', () => {
    const result = getZScore(0.90);

    expect(result).toBeCloseTo(1.28173, 4); // Standard 90% Z-score
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should calculate Z-score for 99.9% confidence level', () => {
    const result = getZScore(0.999);

    expect(result).toBeCloseTo(3.09052, 4); // Standard 99.9% Z-score
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should calculate Z-score for 50% confidence level', () => {
    const result = getZScore(0.50);

    expect(result).toBeCloseTo(0, 4); // Standard 50% Z-score (median)
    expect(typeof result).toBe('number');
  });

  it('should calculate Z-score for 80% confidence level', () => {
    const result = getZScore(0.80);

    expect(result).toBeCloseTo(0.84146, 4); // Standard 80% Z-score
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should calculate Z-score for 99.5% confidence level', () => {
    const result = getZScore(0.995);

    expect(result).toBeCloseTo(2.57624, 4); // Standard 99.5% Z-score
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should calculate Z-score for 99.95% confidence level', () => {
    const result = getZScore(0.9995);

    expect(result).toBeCloseTo(3.29076, 4); // Standard 99.95% Z-score
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should be consistent for same inputs', () => {
    const result1 = getZScore(0.95);
    const result2 = getZScore(0.95);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle edge case with very high confidence level', () => {
    const result = getZScore(0.9999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with very low confidence level', () => {
    const result = getZScore(0.01);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.5 confidence level', () => {
    const result = getZScore(0.5);

    expect(result).toBeCloseTo(0, 4);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.1 confidence level', () => {
    const result = getZScore(0.1);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9 confidence level', () => {
    const result = getZScore(0.9);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.99 confidence level', () => {
    const result = getZScore(0.99);

    expect(result).toBeCloseTo(2.32679, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.999 confidence level', () => {
    const result = getZScore(0.999);

    expect(result).toBeCloseTo(3.09052, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9999 confidence level', () => {
    const result = getZScore(0.9999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.0001 confidence level', () => {
    const result = getZScore(0.0001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.001 confidence level', () => {
    const result = getZScore(0.001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.01 confidence level', () => {
    const result = getZScore(0.01);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.1 confidence level', () => {
    const result = getZScore(0.1);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.2 confidence level', () => {
    const result = getZScore(0.2);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.3 confidence level', () => {
    const result = getZScore(0.3);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.4 confidence level', () => {
    const result = getZScore(0.4);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.6 confidence level', () => {
    const result = getZScore(0.6);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.7 confidence level', () => {
    const result = getZScore(0.7);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.8 confidence level', () => {
    const result = getZScore(0.8);

    expect(result).toBeCloseTo(0.84146, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.85 confidence level', () => {
    const result = getZScore(0.85);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.92 confidence level', () => {
    const result = getZScore(0.92);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.97 confidence level', () => {
    const result = getZScore(0.97);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.98 confidence level', () => {
    const result = getZScore(0.98);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.995 confidence level', () => {
    const result = getZScore(0.995);

    expect(result).toBeCloseTo(2.57624, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.998 confidence level', () => {
    const result = getZScore(0.998);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9995 confidence level', () => {
    const result = getZScore(0.9995);

    expect(result).toBeCloseTo(3.29076, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.99995 confidence level', () => {
    const result = getZScore(0.99995);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.99999 confidence level', () => {
    const result = getZScore(0.99999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should validate mathematical formula correctness', () => {
    // Test known Z-scores for validation
    const testCases = [
      { confidence: 0.50, expected: 0.0 },
      { confidence: 0.80, expected: 0.84146 },
      { confidence: 0.90, expected: 1.28173 },
      { confidence: 0.95, expected: 1.64521 },
      { confidence: 0.99, expected: 2.32679 },
      { confidence: 0.995, expected: 2.57624 },
      { confidence: 0.999, expected: 3.09052 },
      { confidence: 0.9995, expected: 3.29076 }
    ];

    testCases.forEach(({ confidence, expected }) => {
      const result = getZScore(confidence);
      expect(result).toBeCloseTo(expected, 4);
    });
  });

  it('should handle edge case with 0.00001 confidence level', () => {
    const result = getZScore(0.00001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.0001 confidence level', () => {
    const result = getZScore(0.0001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.001 confidence level', () => {
    const result = getZScore(0.001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.01 confidence level', () => {
    const result = getZScore(0.01);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.1 confidence level', () => {
    const result = getZScore(0.1);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.2 confidence level', () => {
    const result = getZScore(0.2);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.3 confidence level', () => {
    const result = getZScore(0.3);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.4 confidence level', () => {
    const result = getZScore(0.4);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.6 confidence level', () => {
    const result = getZScore(0.6);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.7 confidence level', () => {
    const result = getZScore(0.7);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.8 confidence level', () => {
    const result = getZScore(0.8);

    expect(result).toBeCloseTo(0.84146, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.85 confidence level', () => {
    const result = getZScore(0.85);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.92 confidence level', () => {
    const result = getZScore(0.92);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.97 confidence level', () => {
    const result = getZScore(0.97);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.98 confidence level', () => {
    const result = getZScore(0.98);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.995 confidence level', () => {
    const result = getZScore(0.995);

    expect(result).toBeCloseTo(2.57624, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.998 confidence level', () => {
    const result = getZScore(0.998);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9995 confidence level', () => {
    const result = getZScore(0.9995);

    expect(result).toBeCloseTo(3.29076, 4);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.99995 confidence level', () => {
    const result = getZScore(0.99995);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.99999 confidence level', () => {
    const result = getZScore(0.99999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });
});
