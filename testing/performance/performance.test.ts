/**
 * Performance benchmark tests
 */

import { describe, it, expect } from 'vitest';
import { 
  measureExecutionTime, 
  createBenchmarkResult, 
  runBenchmarkSuite,
  formatBenchmarkResults,
  checkPerformanceThreshold,
  type BenchmarkResult 
} from './benchmark';
import { generateDatasets } from './datasets';

// Import functions to benchmark
import { calculateSMA } from '../../src/indicators/trend/calculateSMA';
import { calculateEMA } from '../../src/indicators/trend/calculateEMA';
import { calculateMACD } from '../../src/indicators/trend/calculateMACD';
import { calculateRSI } from '../../src/indicators/momentum/calculateRSI';
import { calculateStochastic } from '../../src/indicators/momentum/calculateStochastic';
import { calculateBollingerBands } from '../../src/indicators/volatility/calculateBollingerBands';

describe('Performance Benchmarks', () => {
  const datasets = generateDatasets();

  describe('Technical Indicators Performance', () => {
    it('should benchmark SMA performance across dataset sizes', async () => {
      const benchmarks = datasets.map(dataset => 
        async (): Promise<BenchmarkResult> => {
          const { executionTime, memoryUsed } = await measureExecutionTime(() => {
            return calculateSMA({
              prices: dataset.prices,
              period: Math.min(20, Math.floor(dataset.size / 10))
            });
          });

          return createBenchmarkResult(
            'calculateSMA',
            dataset.size,
            executionTime,
            memoryUsed
          );
        }
      );

      const suite = await runBenchmarkSuite('SMA Performance', benchmarks);
      
      // Check performance thresholds
      for (const result of suite.results) {
        const threshold = checkPerformanceThreshold(result);
        console.log(`📊 ${result.function} (${result.datasetSize}): ${result.executionTime.toFixed(2)}ms - ${threshold.passed ? '✅ PASS' : '❌ FAIL'} (threshold: ${threshold.threshold}ms)`);
        
        // For very large datasets, be more lenient
        if (result.datasetSize >= 10000) {
          expect(result.executionTime).toBeLessThan(500); // 500ms max for 10K+ points
        } else {
          expect(threshold.passed).toBe(true);
        }
      }

      console.log(formatBenchmarkResults(suite));
    });

    it('should benchmark EMA performance across dataset sizes', async () => {
      const benchmarks = datasets.slice(0, 4).map(dataset => // Test smaller datasets for EMA
        async (): Promise<BenchmarkResult> => {
          const { executionTime, memoryUsed } = await measureExecutionTime(() => {
            return calculateEMA({
              prices: dataset.prices,
              period: Math.min(20, Math.floor(dataset.size / 10))
            });
          });

          return createBenchmarkResult(
            'calculateEMA',
            dataset.size,
            executionTime,
            memoryUsed
          );
        }
      );

      const suite = await runBenchmarkSuite('EMA Performance', benchmarks);
      
      for (const result of suite.results) {
        const threshold = checkPerformanceThreshold(result);
        expect(threshold.passed).toBe(true);
      }

      console.log(formatBenchmarkResults(suite));
    });

    it('should benchmark RSI performance across dataset sizes', async () => {
      const benchmarks = datasets.slice(0, 4).map(dataset =>
        async (): Promise<BenchmarkResult> => {
          const { executionTime, memoryUsed } = await measureExecutionTime(() => {
            return calculateRSI({
              prices: dataset.prices,
              period: 14
            });
          });

          return createBenchmarkResult(
            'calculateRSI',
            dataset.size,
            executionTime,
            memoryUsed
          );
        }
      );

      const suite = await runBenchmarkSuite('RSI Performance', benchmarks);
      
      for (const result of suite.results) {
        const threshold = checkPerformanceThreshold(result);
        expect(threshold.passed).toBe(true);
      }

      console.log(formatBenchmarkResults(suite));
    });

    it('should benchmark Bollinger Bands performance across dataset sizes', async () => {
      const benchmarks = datasets.slice(0, 4).map(dataset =>
        async (): Promise<BenchmarkResult> => {
          const { executionTime, memoryUsed } = await measureExecutionTime(() => {
            return calculateBollingerBands({
              prices: dataset.prices,
              period: 20,
              stdDevMultiplier: 2
            });
          });

          return createBenchmarkResult(
            'calculateBollingerBands',
            dataset.size,
            executionTime,
            memoryUsed
          );
        }
      );

      const suite = await runBenchmarkSuite('Bollinger Bands Performance', benchmarks);
      
      for (const result of suite.results) {
        const threshold = checkPerformanceThreshold(result);
        expect(threshold.passed).toBe(true);
      }

      console.log(formatBenchmarkResults(suite));
    });
  });

  describe('Complex Functions Performance', () => {
    it('should benchmark MACD performance across dataset sizes', async () => {
      const benchmarks = datasets.slice(0, 3).map(dataset =>
        async (): Promise<BenchmarkResult> => {
          const { executionTime, memoryUsed } = await measureExecutionTime(() => {
            return calculateMACD({
              prices: dataset.prices,
              fastPeriod: 12,
              slowPeriod: 26,
              signalPeriod: 9
            });
          });

          return createBenchmarkResult(
            'calculateMACD',
            dataset.size,
            executionTime,
            memoryUsed
          );
        }
      );

      const suite = await runBenchmarkSuite('MACD Performance', benchmarks);
      
      for (const result of suite.results) {
        const threshold = checkPerformanceThreshold(result);
        expect(threshold.passed).toBe(true);
      }

      console.log(formatBenchmarkResults(suite));
    });

    it('should benchmark Stochastic Oscillator performance across dataset sizes', async () => {
      const benchmarks = datasets.slice(0, 3).map(dataset =>
        async (): Promise<BenchmarkResult> => {
          const { executionTime, memoryUsed } = await measureExecutionTime(() => {
            return calculateStochastic({
              high: dataset.high,
              low: dataset.low,
              close: dataset.close,
              kPeriod: 14,
              dPeriod: 3
            });
          });

          return createBenchmarkResult(
            'calculateStochastic',
            dataset.size,
            executionTime,
            memoryUsed
          );
        }
      );

      const suite = await runBenchmarkSuite('Stochastic Performance', benchmarks);
      
      for (const result of suite.results) {
        const threshold = checkPerformanceThreshold(result);
        expect(threshold.passed).toBe(true);
      }

      console.log(formatBenchmarkResults(suite));
    });
  });

  describe('Performance Regression Detection', () => {
    it('should detect performance regressions in critical functions', async () => {
      const criticalFunctions = [
        {
          name: 'calculateSMA',
          fn: () => calculateSMA({ prices: datasets[2].prices, period: 20 }),
          maxTime: 50 // 50ms max for 2.5K points
        },
        {
          name: 'calculateRSI', 
          fn: () => calculateRSI({ prices: datasets[2].prices, period: 14 }),
          maxTime: 100 // 100ms max for 2.5K points
        }
      ];

      for (const func of criticalFunctions) {
        const { executionTime } = await measureExecutionTime(async () => func.fn());
        
        console.log(`🔍 ${func.name}: ${executionTime.toFixed(2)}ms (threshold: ${func.maxTime}ms)`);
        
        if (executionTime > func.maxTime) {
          console.warn(`⚠️  Performance regression detected in ${func.name}!`);
          console.warn(`   Expected: < ${func.maxTime}ms, Actual: ${executionTime.toFixed(2)}ms`);
        }
        
        expect(executionTime).toBeLessThan(func.maxTime);
      }
    });
  });

  describe('Memory Usage Analysis', () => {
    it('should analyze memory usage patterns', async () => {
      const dataset = datasets[2]; // Use medium dataset
      
      const memoryTests = [
        {
          name: 'SMA Memory',
          fn: () => calculateSMA({ prices: dataset.prices, period: 20 })
        },
        {
          name: 'RSI Memory',
          fn: () => calculateRSI({ prices: dataset.prices, period: 14 })
        },
        {
          name: 'Bollinger Bands Memory',
          fn: () => calculateBollingerBands({ prices: dataset.prices, period: 20, stdDevMultiplier: 2 })
        }
      ];

      for (const test of memoryTests) {
        const { memoryUsed } = await measureExecutionTime(async () => test.fn());
        
        console.log(`🧠 ${test.name}: ${memoryUsed?.toFixed(2)}MB`);
        
        // Memory should be reasonable (less than 100MB for these operations)
        if (memoryUsed && memoryUsed > 100) {
          console.warn(`⚠️  High memory usage detected in ${test.name}: ${memoryUsed.toFixed(2)}MB`);
        }
        
        expect(memoryUsed || 0).toBeLessThan(100);
      }
    });
  });
});
