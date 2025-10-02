/**
 * Garman-Klass volatility estimator
 * Uses OHLC data, most efficient unbiased estimator
 * 
 * Garman, M. B., & Klass, M. J. (1980). "On the Estimation of Security Price Volatilities 
 * from Historical Data"
 */
export function calculateGarmanKlassVolatility(
  openPrices: number[],
  highPrices: number[],
  lowPrices: number[],
  closePrices: number[]
): number {
  const n = openPrices.length;
  
  if (n === 0) {
    throw new Error('Price arrays cannot be empty');
  }
  
  if (n !== highPrices.length || n !== lowPrices.length || n !== closePrices.length) {
    throw new Error('All price arrays must have equal length');
  }

  let sum = 0;

  for (let i = 0; i < n; i++) {
    // Validate prices
    if (openPrices[i] <= 0 || highPrices[i] <= 0 || lowPrices[i] <= 0 || closePrices[i] <= 0) {
      throw new Error('All prices must be positive');
    }
    
    if (highPrices[i] < lowPrices[i]) {
      throw new Error('High price must be greater than or equal to low price');
    }

    const hlRatio = Math.log(highPrices[i] / lowPrices[i]);
    const coRatio = Math.log(closePrices[i] / openPrices[i]);
    
    // Garman-Klass formula: 0.5 * (ln(H/L))² - (2*ln(2)-1) * (ln(C/O))²
    sum += 0.5 * Math.pow(hlRatio, 2) - (2 * Math.log(2) - 1) * Math.pow(coRatio, 2);
  }

  const variance = sum / n;
  
  // Handle negative variance (can happen with the formula)
  if (variance < 0) {
    return 0;
  }
  
  return Math.sqrt(variance);
}
