/**
 * Test datasets for performance benchmarking
 */

export interface Dataset {
  size: number;
  description: string;
  prices: number[];
  returns: number[];
  high: number[];
  low: number[];
  close: number[];
  weights: number[];
  covarianceMatrix: number[][];
}

/**
 * Generate synthetic price data
 */
function generatePrices(size: number): number[] {
  const prices: number[] = [100]; // Start at 100
  let currentPrice = 100;
  
  for (let i = 1; i < size; i++) {
    // Random walk with slight upward bias
    const change = (Math.random() - 0.45) * 0.02; // -1.5% to +2.5% daily
    currentPrice *= (1 + change);
    prices.push(Math.max(currentPrice, 0.01)); // Prevent negative prices
  }
  
  return prices;
}

/**
 * Generate returns from prices
 */
function generateReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  return returns;
}

/**
 * Generate OHLC data
 */
function generateOHLC(prices: number[]): { high: number[], low: number[], close: number[] } {
  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [...prices]; // Close = prices
  
  for (let i = 0; i < prices.length; i++) {
    const volatility = 0.02; // 2% intraday volatility
    const highPrice = prices[i] * (1 + Math.random() * volatility);
    const lowPrice = prices[i] * (1 - Math.random() * volatility);
    
    high.push(Math.max(highPrice, prices[i]));
    low.push(Math.max(lowPrice, 0.01));
  }
  
  return { high, low, close };
}

/**
 * Generate portfolio weights
 */
function generateWeights(size: number): number[] {
  const weights: number[] = [];
  
  for (let i = 0; i < size; i++) {
    weights.push(Math.random());
  }
  
  // Normalize weights
  const sum = weights.reduce((acc, w) => acc + w, 0);
  return weights.map(w => w / sum);
}

/**
 * Generate covariance matrix
 */
function generateCovarianceMatrix(size: number): number[][] {
  const matrix: number[][] = [];
  
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      if (i === j) {
        row.push(0.04 + Math.random() * 0.02); // Variance: 4-6%
      } else {
        row.push((Math.random() - 0.5) * 0.02); // Covariance: -1% to +1%
      }
    }
    matrix.push(row);
  }
  
  return matrix;
}

/**
 * Generate test datasets of different sizes
 */
export function generateDatasets(): Dataset[] {
  const sizes = [100, 500, 1000, 2500, 5000, 10000];
  const datasets: Dataset[] = [];
  
  for (const size of sizes) {
    const prices = generatePrices(size);
    const returns = generateReturns(prices);
    const { high, low, close } = generateOHLC(prices);
    const weights = generateWeights(Math.min(size / 10, 50)); // Max 50 assets
    const covarianceMatrix = generateCovarianceMatrix(weights.length);
    
    datasets.push({
      size,
      description: `${size.toLocaleString()} data points`,
      prices,
      returns,
      high,
      low,
      close,
      weights,
      covarianceMatrix
    });
  }
  
  return datasets;
}

/**
 * Quick access to common dataset sizes
 */
export const COMMON_SIZES = {
  SMALL: 100,
  MEDIUM: 1000,
  LARGE: 5000,
  VERY_LARGE: 10000
} as const;
