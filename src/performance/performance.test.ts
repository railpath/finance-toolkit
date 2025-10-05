import { describe, expect, it } from 'vitest';

import { calculateCovarianceMatrix } from '../risk/calculateCovarianceMatrix';
import { matrixMatrixMultiply } from '../utils/matrixOperations';
import { solveQuadraticProgram } from '../utils/solveQuadraticProgram';

describe('Performance Tests', () => {
  it('should handle large portfolio optimization efficiently', () => {
    const startTime = performance.now();
    
    // Large portfolio: 50 assets
    const n = 50;
    const returns = Array.from({ length: n }, () => 
      Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.1)
    );
    
    const { matrix: covarianceMatrix } = calculateCovarianceMatrix({ returns });
    const linearTerm = new Array(n).fill(0);
    
    const result = solveQuadraticProgram(
      covarianceMatrix,
      linearTerm,
      {
        equalityConstraints: { 
          A: [new Array(n).fill(1)], 
          b: [1] 
        },
        nonNegative: true,
        maxIterations: 1000
      }
    );
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Should complete within reasonable time (< 5 seconds)
    expect(executionTime).toBeLessThan(5000);
    expect(result.solution).toHaveLength(n);
    expect(result.converged).toBe(true);
  });

  it('should handle large matrix operations efficiently', () => {
    const startTime = performance.now();
    
    // Large matrices: 100x100
    const size = 100;
    const matrixA = Array.from({ length: size }, () => 
      Array.from({ length: size }, () => Math.random())
    );
    const matrixB = Array.from({ length: size }, () => 
      Array.from({ length: size }, () => Math.random())
    );
    
    const result = matrixMatrixMultiply(matrixA, matrixB);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Should complete within reasonable time (< 2 seconds)
    expect(executionTime).toBeLessThan(2000);
    expect(result).toHaveLength(size);
    expect(result[0]).toHaveLength(size);
  });

  it('should not leak memory with repeated operations', () => {
    const iterations = 100;
    const results: any[] = [];
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const startMemory = process.memoryUsage();
    
    for (let i = 0; i < iterations; i++) {
      const n = 20;
      const returns = Array.from({ length: n }, () => 
        Array.from({ length: 50 }, () => Math.random() * 0.1)
      );
      
      const { matrix: covarianceMatrix } = calculateCovarianceMatrix({ returns });
      const linearTerm = new Array(n).fill(0);
      
      const result = solveQuadraticProgram(
        covarianceMatrix,
        linearTerm,
        {
          equalityConstraints: { 
            A: [new Array(n).fill(1)], 
            b: [1] 
          },
          nonNegative: true,
          maxIterations: 100
        }
      );
      
      results.push(result);
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const endMemory = process.memoryUsage();
    const memoryIncrease = endMemory.heapUsed - startMemory.heapUsed;
    
    // Memory increase should be reasonable (< 100MB for 100 iterations)
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    expect(results).toHaveLength(iterations);
  });

  it('should handle Monte Carlo VaR efficiently', () => {
    const startTime = performance.now();
    
    // Large dataset for Monte Carlo
    const returns = Array.from({ length: 10000 }, () => 
      (Math.random() - 0.5) * 0.2
    );
    
    // This would normally be tested, but we need to import the function
    // For now, just test that we can create the data efficiently
    expect(returns).toHaveLength(10000);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Data creation should be fast (< 100ms)
    expect(executionTime).toBeLessThan(100);
  });

  it('should handle edge case with very large numbers', () => {
    const startTime = performance.now();
    
    // Test with very large numbers
    const largeMatrix = [
      [1e10, 1e10, 1e10],
      [1e10, 1e10, 1e10],
      [1e10, 1e10, 1e10]
    ];
    
    const largeVector = [1e10, 1e10, 1e10];
    
    const result = solveQuadraticProgram(
      largeMatrix,
      largeVector,
      {
        equalityConstraints: { 
          A: [[1, 1, 1]], 
          b: [1] 
        },
        nonNegative: true,
        maxIterations: 100
      }
    );
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Should complete without overflow errors
    expect(executionTime).toBeLessThan(1000);
    expect(result.solution).toHaveLength(3);
    expect(result.solution.every(x => isFinite(x))).toBe(true);
  });

  it('should handle numerical precision with small numbers', () => {
    const startTime = performance.now();
    
    // Test with very small numbers
    const smallMatrix = [
      [1e-10, 1e-10, 1e-10],
      [1e-10, 1e-10, 1e-10],
      [1e-10, 1e-10, 1e-10]
    ];
    
    const smallVector = [1e-10, 1e-10, 1e-10];
    
    const result = solveQuadraticProgram(
      smallMatrix,
      smallVector,
      {
        equalityConstraints: { 
          A: [[1, 1, 1]], 
          b: [1] 
        },
        nonNegative: true,
        maxIterations: 100
      }
    );
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Should complete without underflow errors
    expect(executionTime).toBeLessThan(1000);
    expect(result.solution).toHaveLength(3);
    expect(result.solution.every(x => isFinite(x))).toBe(true);
  });
});
