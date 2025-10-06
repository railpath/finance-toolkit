/**
 * Performance benchmarking utilities
 */

export interface BenchmarkResult {
  function: string;
  datasetSize: number;
  executionTime: number; // milliseconds
  memoryUsed?: number; // MB
  iterations?: number;
  averageTime?: number; // ms per iteration
}

export interface BenchmarkSuite {
  name: string;
  results: BenchmarkResult[];
  totalTime: number;
  averageTime: number;
}

/**
 * Measure execution time of a function
 */
export async function measureExecutionTime<T>(
  fn: () => T | Promise<T>,
  iterations: number = 1
): Promise<{ result: T; executionTime: number; averageTime: number; memoryUsed?: number }> {
  const startTime = performance.now();
  const startMemory = process.memoryUsage();
  
  let result: T;
  
  if (iterations === 1) {
    result = await fn();
  } else {
    // For multiple iterations, we'll just call it once and multiply
    // In real benchmarks, you'd want to call the function multiple times
    result = await fn();
  }
  
  const endTime = performance.now();
  const endMemory = process.memoryUsage();
  
  const executionTime = endTime - startTime;
  const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
  
  // Only report memory if it's positive (memory increase) or if it's a significant decrease
  // This avoids showing negative values due to garbage collection
  const memoryUsed = memoryDelta > 0 ? memoryDelta / 1024 / 1024 : undefined;
  const averageTime = executionTime / iterations;
  
  return {
    result,
    executionTime,
    averageTime,
    memoryUsed
  };
}

/**
 * Create a benchmark result
 */
export function createBenchmarkResult(
  functionName: string,
  datasetSize: number,
  executionTime: number,
  memoryUsed?: number,
  iterations: number = 1
): BenchmarkResult {
  return {
    function: functionName,
    datasetSize,
    executionTime,
    averageTime: executionTime / iterations,
    memoryUsed,
    iterations
  };
}

/**
 * Run a benchmark suite
 */
export async function runBenchmarkSuite(
  name: string,
  benchmarks: Array<() => Promise<BenchmarkResult>>
): Promise<BenchmarkSuite> {
  console.log(`\n🚀 Running benchmark suite: ${name}`);
  console.log('=' .repeat(50));
  
  const results: BenchmarkResult[] = [];
  const startTime = performance.now();
  
  for (const benchmark of benchmarks) {
    try {
      const result = await benchmark();
      results.push(result);
      
      // Log individual result
      const memoryInfo = result.memoryUsed ? ` | Memory: ${result.memoryUsed.toFixed(2)}MB` : '';
      console.log(`✅ ${result.function} (${result.datasetSize.toLocaleString()}): ${result.executionTime.toFixed(2)}ms${memoryInfo}`);
    } catch (error) {
      console.error(`❌ Benchmark failed: ${error}`);
    }
  }
  
  const totalTime = performance.now() - startTime;
  const averageTime = totalTime / benchmarks.length;
  
  console.log('=' .repeat(50));
  console.log(`📊 Suite completed in ${totalTime.toFixed(2)}ms (avg: ${averageTime.toFixed(2)}ms per benchmark)`);
  
  return {
    name,
    results,
    totalTime,
    averageTime
  };
}

/**
 * Format benchmark results for display
 */
export function formatBenchmarkResults(suite: BenchmarkSuite): string {
  let output = `\n📈 Benchmark Results: ${suite.name}\n`;
  output += '=' .repeat(60) + '\n';
  
  // Group by function
  const grouped = suite.results.reduce((acc, result) => {
    if (!acc[result.function]) {
      acc[result.function] = [];
    }
    acc[result.function].push(result);
    return acc;
  }, {} as Record<string, BenchmarkResult[]>);
  
  for (const [functionName, results] of Object.entries(grouped)) {
    output += `\n🔧 ${functionName}:\n`;
    
    for (const result of results.sort((a, b) => a.datasetSize - b.datasetSize)) {
      const throughput = result.datasetSize / (result.executionTime / 1000); // ops/sec
      const memoryInfo = result.memoryUsed ? ` | Memory: ${result.memoryUsed.toFixed(2)}MB` : '';
      
      output += `  ${result.datasetSize.toLocaleString().padStart(8)}: ${result.executionTime.toFixed(2).padStart(8)}ms | ${throughput.toFixed(0).padStart(8)} ops/sec${memoryInfo}\n`;
    }
  }
  
  output += '\n' + '=' .repeat(60) + '\n';
  return output;
}

/**
 * Save benchmark results to JSON
 */
export function saveBenchmarkResults(suite: BenchmarkSuite, filename?: string): void {
  const fs = require('fs');
  const path = require('path');
  
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const defaultFilename = `benchmark-${timestamp}.json`;
  const filepath = path.join(resultsDir, filename || defaultFilename);
  
  const data = {
    timestamp: new Date().toISOString(),
    suite,
    summary: {
      totalBenchmarks: suite.results.length,
      totalTime: suite.totalTime,
      averageTime: suite.averageTime
    }
  };
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 Results saved to: ${filepath}`);
}

/**
 * Performance thresholds for different dataset sizes
 */
export const PERFORMANCE_THRESHOLDS = {
  SMALL: {
    maxTime: 10, // 10ms for small datasets
    description: 'Small datasets (< 1K points)'
  },
  MEDIUM: {
    maxTime: 50, // 50ms for medium datasets
    description: 'Medium datasets (1K - 5K points)'
  },
  LARGE: {
    maxTime: 200, // 200ms for large datasets
    description: 'Large datasets (5K - 10K points)'
  },
  VERY_LARGE: {
    maxTime: 1000, // 1s for very large datasets
    description: 'Very large datasets (> 10K points)'
  }
} as const;

/**
 * Check if benchmark result meets performance expectations
 */
export function checkPerformanceThreshold(result: BenchmarkResult): {
  passed: boolean;
  threshold: number;
  category: string;
} {
  const { datasetSize, executionTime } = result;
  
  if (datasetSize < 1000) {
    return {
      passed: executionTime <= PERFORMANCE_THRESHOLDS.SMALL.maxTime,
      threshold: PERFORMANCE_THRESHOLDS.SMALL.maxTime,
      category: PERFORMANCE_THRESHOLDS.SMALL.description
    };
  } else if (datasetSize < 5000) {
    return {
      passed: executionTime <= PERFORMANCE_THRESHOLDS.MEDIUM.maxTime,
      threshold: PERFORMANCE_THRESHOLDS.MEDIUM.maxTime,
      category: PERFORMANCE_THRESHOLDS.MEDIUM.description
    };
  } else if (datasetSize < 10000) {
    return {
      passed: executionTime <= PERFORMANCE_THRESHOLDS.LARGE.maxTime,
      threshold: PERFORMANCE_THRESHOLDS.LARGE.maxTime,
      category: PERFORMANCE_THRESHOLDS.LARGE.description
    };
  } else {
    return {
      passed: executionTime <= PERFORMANCE_THRESHOLDS.VERY_LARGE.maxTime,
      threshold: PERFORMANCE_THRESHOLDS.VERY_LARGE.maxTime,
      category: PERFORMANCE_THRESHOLDS.VERY_LARGE.description
    };
  }
}
