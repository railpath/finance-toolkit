import {
  createConstantVector,
  createZeroVector,
  vectorAdd,
  vectorCross,
  vectorDistance,
  vectorDot,
  vectorEquals,
  vectorNorm,
  vectorNormalize,
  vectorScale,
  vectorSubtract
} from './vectorOperations';

describe('Vector Operations', () => {
  describe('vectorNorm', () => {
    it('should calculate norm of 2D vector', () => {
      expect(vectorNorm([3, 4])).toBeCloseTo(5);
    });

    it('should calculate norm of 3D vector', () => {
      expect(vectorNorm([1, 1, 1])).toBeCloseTo(Math.sqrt(3));
    });

    it('should handle zero vector', () => {
      expect(vectorNorm([0, 0, 0])).toBe(0);
    });

    it('should handle negative values', () => {
      expect(vectorNorm([-3, -4])).toBeCloseTo(5);
    });
  });

  describe('vectorAdd', () => {
    it('should add two vectors', () => {
      expect(vectorAdd([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9]);
    });

    it('should handle zero vectors', () => {
      expect(vectorAdd([1, 2, 3], [0, 0, 0])).toEqual([1, 2, 3]);
    });

    it('should handle negative values', () => {
      expect(vectorAdd([1, -2, 3], [-4, 5, -6])).toEqual([-3, 3, -3]);
    });

    it('should throw error for mismatched lengths', () => {
      expect(() => vectorAdd([1, 2], [3, 4, 5])).toThrow('Vectors must have the same length');
    });
  });

  describe('vectorSubtract', () => {
    it('should subtract two vectors', () => {
      expect(vectorSubtract([5, 7, 9], [1, 2, 3])).toEqual([4, 5, 6]);
    });

    it('should handle zero vectors', () => {
      expect(vectorSubtract([1, 2, 3], [0, 0, 0])).toEqual([1, 2, 3]);
    });

    it('should handle negative results', () => {
      expect(vectorSubtract([1, 2, 3], [4, 5, 6])).toEqual([-3, -3, -3]);
    });

    it('should throw error for mismatched lengths', () => {
      expect(() => vectorSubtract([1, 2], [3, 4, 5])).toThrow('Vectors must have the same length');
    });
  });

  describe('vectorScale', () => {
    it('should scale vector by positive scalar', () => {
      expect(vectorScale([1, 2, 3], 2)).toEqual([2, 4, 6]);
    });

    it('should scale vector by negative scalar', () => {
      expect(vectorScale([1, 2, 3], -1)).toEqual([-1, -2, -3]);
    });

    it('should handle zero scalar', () => {
      expect(vectorScale([1, 2, 3], 0)).toEqual([0, 0, 0]);
    });

    it('should handle fractional scalar', () => {
      expect(vectorScale([2, 4, 6], 0.5)).toEqual([1, 2, 3]);
    });
  });

  describe('vectorDot', () => {
    it('should calculate dot product', () => {
      expect(vectorDot([1, 2, 3], [4, 5, 6])).toBe(32); // 1*4 + 2*5 + 3*6
    });

    it('should handle orthogonal vectors', () => {
      expect(vectorDot([1, 0], [0, 1])).toBe(0);
    });

    it('should handle parallel vectors', () => {
      expect(vectorDot([2, 3], [4, 6])).toBe(26); // 2*4 + 3*6
    });

    it('should throw error for mismatched lengths', () => {
      expect(() => vectorDot([1, 2], [3, 4, 5])).toThrow('Vectors must have the same length');
    });
  });

  describe('vectorCross', () => {
    it('should calculate cross product of standard basis vectors', () => {
      expect(vectorCross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
      expect(vectorCross([0, 1, 0], [1, 0, 0])).toEqual([0, 0, -1]);
    });

    it('should calculate cross product of arbitrary vectors', () => {
      expect(vectorCross([1, 2, 3], [4, 5, 6])).toEqual([-3, 6, -3]);
    });

    it('should handle parallel vectors', () => {
      expect(vectorCross([1, 2, 3], [2, 4, 6])).toEqual([0, 0, 0]);
    });

    it('should throw error for non-3D vectors', () => {
      expect(() => vectorCross([1, 2], [3, 4])).toThrow('Cross product is only defined for 3D vectors');
    });
  });

  describe('vectorNormalize', () => {
    it('should normalize vector to unit length', () => {
      const normalized = vectorNormalize([3, 4]);
      expect(vectorNorm(normalized)).toBeCloseTo(1);
      expect(normalized[0]).toBeCloseTo(0.6);
      expect(normalized[1]).toBeCloseTo(0.8);
    });

    it('should normalize 3D vector', () => {
      const normalized = vectorNormalize([1, 1, 1]);
      expect(vectorNorm(normalized)).toBeCloseTo(1);
      expect(normalized[0]).toBeCloseTo(1/Math.sqrt(3));
    });

    it('should throw error for zero vector', () => {
      expect(() => vectorNormalize([0, 0, 0])).toThrow('Cannot normalize zero vector');
    });
  });

  describe('vectorDistance', () => {
    it('should calculate distance between points', () => {
      expect(vectorDistance([0, 0], [3, 4])).toBeCloseTo(5);
    });

    it('should handle identical points', () => {
      expect(vectorDistance([1, 2, 3], [1, 2, 3])).toBe(0);
    });

    it('should handle negative coordinates', () => {
      expect(vectorDistance([-1, -1], [1, 1])).toBeCloseTo(Math.sqrt(8));
    });
  });

  describe('vectorEquals', () => {
    it('should return true for identical vectors', () => {
      expect(vectorEquals([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should return true for approximately equal vectors', () => {
      expect(vectorEquals([1.0000001, 2], [1, 2.0000001], 1e-6)).toBe(true);
    });

    it('should return false for different vectors', () => {
      expect(vectorEquals([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it('should return false for different lengths', () => {
      expect(vectorEquals([1, 2], [1, 2, 3])).toBe(false);
    });
  });

  describe('createZeroVector', () => {
    it('should create zero vector of specified length', () => {
      expect(createZeroVector(3)).toEqual([0, 0, 0]);
    });

    it('should handle length 1', () => {
      expect(createZeroVector(1)).toEqual([0]);
    });

    it('should handle length 0', () => {
      expect(createZeroVector(0)).toEqual([]);
    });
  });

  describe('createConstantVector', () => {
    it('should create vector filled with constant value', () => {
      expect(createConstantVector(3, 1)).toEqual([1, 1, 1]);
    });

    it('should handle negative values', () => {
      expect(createConstantVector(2, -5)).toEqual([-5, -5]);
    });

    it('should handle zero', () => {
      expect(createConstantVector(3, 0)).toEqual([0, 0, 0]);
    });
  });
});
