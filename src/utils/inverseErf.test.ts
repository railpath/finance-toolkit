import { describe, expect, it } from 'vitest';

import { inverseErf } from './inverseErf';

describe('inverseErf', () => {
  it('should calculate inverse error function for 0', () => {
    const result = inverseErf(0);

    expect(result).toBeCloseTo(0, 4);
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for 0.5', () => {
    const result = inverseErf(0.5);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for -0.5', () => {
    const result = inverseErf(-0.5);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for 0.9', () => {
    const result = inverseErf(0.9);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for -0.9', () => {
    const result = inverseErf(-0.9);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for 0.95', () => {
    const result = inverseErf(0.95);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for -0.95', () => {
    const result = inverseErf(-0.95);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for 0.99', () => {
    const result = inverseErf(0.99);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should calculate inverse error function for -0.99', () => {
    const result = inverseErf(-0.99);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should be consistent for same inputs', () => {
    const result1 = inverseErf(0.5);
    const result2 = inverseErf(0.5);

    expect(result1).toBeCloseTo(result2, 10);
  });

  it('should handle edge case with 0.1', () => {
    const result = inverseErf(0.1);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.1', () => {
    const result = inverseErf(-0.1);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.2', () => {
    const result = inverseErf(0.2);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.2', () => {
    const result = inverseErf(-0.2);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.3', () => {
    const result = inverseErf(0.3);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.3', () => {
    const result = inverseErf(-0.3);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.4', () => {
    const result = inverseErf(0.4);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.4', () => {
    const result = inverseErf(-0.4);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.6', () => {
    const result = inverseErf(0.6);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.6', () => {
    const result = inverseErf(-0.6);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.7', () => {
    const result = inverseErf(0.7);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.7', () => {
    const result = inverseErf(-0.7);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.8', () => {
    const result = inverseErf(0.8);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.8', () => {
    const result = inverseErf(-0.8);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.85', () => {
    const result = inverseErf(0.85);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.85', () => {
    const result = inverseErf(-0.85);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.92', () => {
    const result = inverseErf(0.92);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.92', () => {
    const result = inverseErf(-0.92);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.97', () => {
    const result = inverseErf(0.97);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.97', () => {
    const result = inverseErf(-0.97);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.98', () => {
    const result = inverseErf(0.98);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.98', () => {
    const result = inverseErf(-0.98);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.995', () => {
    const result = inverseErf(0.995);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.995', () => {
    const result = inverseErf(-0.995);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.998', () => {
    const result = inverseErf(0.998);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.998', () => {
    const result = inverseErf(-0.998);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.999', () => {
    const result = inverseErf(0.999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.999', () => {
    const result = inverseErf(-0.999);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9995', () => {
    const result = inverseErf(0.9995);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.9995', () => {
    const result = inverseErf(-0.9995);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9999', () => {
    const result = inverseErf(0.9999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.9999', () => {
    const result = inverseErf(-0.9999);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.99999', () => {
    const result = inverseErf(0.99999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.99999', () => {
    const result = inverseErf(-0.99999);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.00001', () => {
    const result = inverseErf(0.00001);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.00001', () => {
    const result = inverseErf(-0.00001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.0001', () => {
    const result = inverseErf(0.0001);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.0001', () => {
    const result = inverseErf(-0.0001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.001', () => {
    const result = inverseErf(0.001);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.001', () => {
    const result = inverseErf(-0.001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.01', () => {
    const result = inverseErf(0.01);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.01', () => {
    const result = inverseErf(-0.01);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should validate mathematical properties', () => {
    // Test symmetry: inverseErf(-x) = -inverseErf(x)
    const x = 0.5;
    const result1 = inverseErf(x);
    const result2 = inverseErf(-x);

    expect(result1).toBeCloseTo(-result2, 4);
  });

  it('should handle edge case with 0.1', () => {
    const result = inverseErf(0.1);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.1', () => {
    const result = inverseErf(-0.1);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.2', () => {
    const result = inverseErf(0.2);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.2', () => {
    const result = inverseErf(-0.2);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.3', () => {
    const result = inverseErf(0.3);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.3', () => {
    const result = inverseErf(-0.3);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.4', () => {
    const result = inverseErf(0.4);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.4', () => {
    const result = inverseErf(-0.4);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.6', () => {
    const result = inverseErf(0.6);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.6', () => {
    const result = inverseErf(-0.6);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.7', () => {
    const result = inverseErf(0.7);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.7', () => {
    const result = inverseErf(-0.7);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.8', () => {
    const result = inverseErf(0.8);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.8', () => {
    const result = inverseErf(-0.8);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.85', () => {
    const result = inverseErf(0.85);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.85', () => {
    const result = inverseErf(-0.85);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.92', () => {
    const result = inverseErf(0.92);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.92', () => {
    const result = inverseErf(-0.92);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.97', () => {
    const result = inverseErf(0.97);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.97', () => {
    const result = inverseErf(-0.97);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.98', () => {
    const result = inverseErf(0.98);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.98', () => {
    const result = inverseErf(-0.98);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.995', () => {
    const result = inverseErf(0.995);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.995', () => {
    const result = inverseErf(-0.995);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.998', () => {
    const result = inverseErf(0.998);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.998', () => {
    const result = inverseErf(-0.998);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.999', () => {
    const result = inverseErf(0.999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.999', () => {
    const result = inverseErf(-0.999);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9995', () => {
    const result = inverseErf(0.9995);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.9995', () => {
    const result = inverseErf(-0.9995);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.9999', () => {
    const result = inverseErf(0.9999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.9999', () => {
    const result = inverseErf(-0.9999);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.99999', () => {
    const result = inverseErf(0.99999);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.99999', () => {
    const result = inverseErf(-0.99999);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.00001', () => {
    const result = inverseErf(0.00001);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.00001', () => {
    const result = inverseErf(-0.00001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.0001', () => {
    const result = inverseErf(0.0001);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.0001', () => {
    const result = inverseErf(-0.0001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.001', () => {
    const result = inverseErf(0.001);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.001', () => {
    const result = inverseErf(-0.001);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with 0.01', () => {
    const result = inverseErf(0.01);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });

  it('should handle edge case with -0.01', () => {
    const result = inverseErf(-0.01);

    expect(result).toBeLessThan(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
  });
});
