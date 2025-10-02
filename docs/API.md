# API Reference

Complete API documentation for finlib-ts.

---

## Portfolio Performance

### `calculateTimeWeightedReturn`

Calculates the Time-Weighted Return (TWR) of a portfolio.

**Description**: TWR measures portfolio performance independent of cash flows. Ideal for evaluating portfolio managers.

```typescript
function calculateTimeWeightedReturn(options: TimeWeightedReturnOptions): TimeWeightedReturnResult
```

**Parameters**:
- `portfolioValues: number[]` - Portfolio values at each time point
- `cashFlows: number[]` - Cash flows (positive = deposit, negative = withdrawal)
- `annualizationFactor?: number` - Annualization factor (default: 252)

**Returns**:
- `twr: number` - Time-Weighted Return
- `annualizedTWR: number` - Annualized TWR
- `periodReturns: number[]` - Period returns

**Example**:
```typescript
const result = calculateTimeWeightedReturn({
  portfolioValues: [1000, 1100, 1200, 1150],
  cashFlows: [0, 100, 0, -50],
  annualizationFactor: 252
});

console.log(result.twr); // 0.15 (15%)
console.log(result.annualizedTWR); // 0.15
```

---

### `calculateMoneyWeightedReturn`

Calculates the Money-Weighted Return (MWR) using IRR method.

**Description**: MWR considers the size and timing of cash flows. Equivalent to Internal Rate of Return (IRR).

```typescript
function calculateMoneyWeightedReturn(options: MoneyWeightedReturnOptions): MoneyWeightedReturnResult
```

**Parameters**:
- `cashFlows: number[]` - Cash flows (positive = deposit, negative = withdrawal)
- `dates: Date[]` - Cash flow timestamps
- `finalValue: number` - Final portfolio value
- `initialValue?: number` - Initial value (default: 0)
- `maxIterations?: number` - Max Newton-Raphson iterations (default: 100)
- `tolerance?: number` - Convergence tolerance (default: 1e-6)

**Returns**:
- `mwr: number` - Money-Weighted Return (IRR)
- `annualizedMWR: number` - Annualized MWR
- `cashFlowCount: number` - Number of cash flows
- `timePeriodYears: number` - Time period in years
- `npv: number` - Net Present Value
- `iterations: number` - Number of iterations

**Example**:
```typescript
const result = calculateMoneyWeightedReturn({
  cashFlows: [1000, 100, -50],
  dates: [
    new Date('2023-01-01'), 
    new Date('2023-06-01'), 
    new Date('2023-12-01')
  ],
  finalValue: 1150,
  initialValue: 0
});

console.log(result.mwr); // 0.12 (12%)
console.log(result.annualizedMWR); // 0.12
```

---

## Risk Metrics

### `calculateVaR`

Calculates Value at Risk (VaR) using various methods.

```typescript
function calculateVaR(options: VaROptions): VaRResult
```

**Parameters**:
- `returns: number[]` - Historical returns
- `confidenceLevel: number` - Confidence level (e.g. 0.95 for 95%)
- `method: 'historical' | 'parametric' | 'monte-carlo'` - Calculation method
- `annualizationFactor?: number` - Annualization factor (default: 252)

**Returns**:
- `var: number` - Value at Risk
- `confidenceLevel: number` - Used confidence level
- `method: string` - Used method

**Example**:
```typescript
const var95 = calculateVaR({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  confidenceLevel: 0.95,
  method: 'historical'
});

console.log(var95.var); // -0.02 (2% Verlust)
```

---

### `calculateExpectedShortfall`

Calculates Expected Shortfall (Conditional VaR).

```typescript
function calculateExpectedShortfall(options: ExpectedShortfallOptions): ExpectedShortfallResult
```

**Parameters**:
- `returns: number[]` - Historical returns
- `confidenceLevel: number` - Confidence level
- `method: 'historical' | 'parametric'` - Calculation method
- `annualizationFactor?: number` - Annualization factor

**Returns**:
- `expectedShortfall: number` - Expected Shortfall
- `confidenceLevel: number` - Confidence level
- `method: string` - Method

---

### `calculateSharpeRatio`

Calculates the Sharpe Ratio for risk-adjusted returns.

```typescript
function calculateSharpeRatio(options: SharpeRatioOptions): SharpeRatioResult
```

**Parameters**:
- `returns: number[]` - Portfolio returns
- `riskFreeRate: number` - Risk-free rate
- `annualizationFactor?: number` - Annualization factor

**Returns**:
- `sharpeRatio: number` - Sharpe Ratio
- `annualizedSharpeRatio: number` - Annualized Sharpe Ratio

---

### `calculateSortinoRatio`

Calculates the Sortino Ratio for downside risk-adjusted returns.

```typescript
function calculateSortinoRatio(options: SortinoRatioOptions): SortinoRatioResult
```

**Parameters**:
- `returns: number[]` - Portfolio returns
- `riskFreeRate: number` - Risk-free rate
- `annualizationFactor?: number` - Annualization factor

**Returns**:
- `sortinoRatio: number` - Sortino Ratio
- `annualizedSortinoRatio: number` - Annualized Sortino Ratio

---

### `calculateMaxDrawdown`

Calculates the maximum drawdown of a portfolio.

```typescript
function calculateMaxDrawdown(options: MaxDrawdownOptions): MaxDrawdownResult
```

**Parameters**:
- `portfolioValues: number[]` - Portfolio values over time
- `dates?: Date[]` - Optional: timestamps
- `cashFlows?: number[]` - Optional: cash flows

**Returns**:
- `maxDrawdown: number` - Maximum Drawdown
- `maxDrawdownPercent: number` - Maximum Drawdown in percent
- `startDate?: Date` - Start of drawdown
- `endDate?: Date` - End of drawdown

---

## Volatility

### `calculateVolatility`

Calculates standard volatility.

```typescript
function calculateVolatility(options: VolatilityOptions): VolatilityResult
```

**Parameters**:
- `returns: number[]` - Returns
- `annualizationFactor?: number` - Annualization factor

**Returns**:
- `volatility: number` - Volatility
- `annualizedVolatility: number` - Annualized volatility

---

### `calculateEWMAVolatility`

Calculates EWMA (Exponentially Weighted Moving Average) volatility.

```typescript
function calculateEWMAVolatility(options: EWMAVolatilityOptions): EWMAVolatilityResult
```

**Parameters**:
- `returns: number[]` - Returns
- `lambda: number` - Decay factor (0 < lambda < 1)
- `annualizationFactor?: number` - Annualization factor

---

### `calculateParkinsonVolatility`

Calculates Parkinson volatility based on High-Low range.

```typescript
function calculateParkinsonVolatility(options: ParkinsonVolatilityOptions): ParkinsonVolatilityResult
```

**Parameters**:
- `high: number[]` - High prices
- `low: number[]` - Low prices
- `annualizationFactor?: number` - Annualization factor

---

### `calculateGarmanKlassVolatility`

Calculates Garman-Klass volatility based on OHLC data.

```typescript
function calculateGarmanKlassVolatility(options: GarmanKlassVolatilityOptions): GarmanKlassVolatilityResult
```

**Parameters**:
- `open: number[]` - Open prices
- `high: number[]` - High prices
- `low: number[]` - Low prices
- `close: number[]` - Close prices
- `annualizationFactor?: number` - Annualization factor

---

## Portfolio Analysis

### `calculateCorrelationMatrix`

Calculates the correlation matrix between assets.

```typescript
function calculateCorrelationMatrix(options: CorrelationMatrixOptions): CorrelationMatrixResult
```

**Parameters**:
- `assetReturns: number[][]` - Returns for each asset
- `annualizationFactor?: number` - Annualization factor

**Returns**:
- `correlationMatrix: number[][]` - Correlation matrix
- `assetCount: number` - Number of assets

---

### `calculateCovarianceMatrix`

Calculates the covariance matrix between assets.

```typescript
function calculateCovarianceMatrix(options: CovarianceMatrixOptions): CovarianceMatrixResult
```

**Parameters**:
- `assetReturns: number[][]` - Returns for each asset
- `annualizationFactor?: number` - Annualization factor

**Returns**:
- `covarianceMatrix: number[][]` - Covariance matrix
- `assetCount: number` - Number of assets

---

### `calculatePortfolioVolatility`

Calculates portfolio volatility based on weights and covariance matrix.

```typescript
function calculatePortfolioVolatility(options: PortfolioVolatilityOptions): PortfolioVolatilityResult
```

**Parameters**:
- `weights: number[]` - Asset weights
- `covarianceMatrix: number[][]` - Covariance matrix
- `annualizationFactor?: number` - Annualization factor

**Returns**:
- `portfolioVolatility: number` - Portfolio volatility
- `annualizedVolatility: number` - Annualized volatility

---

## Performance Metrics

### `calculateAlpha`

Calculates Alpha (excess return) based on CAPM.

```typescript
function calculateAlpha(options: AlphaOptions): AlphaResult
```

**Parameters**:
- `assetReturns: number[]` - Asset returns
- `benchmarkReturns: number[]` - Benchmark returns
- `riskFreeRate: number` - Risk-free rate
- `annualizationFactor?: number` - Annualization factor

---

### `calculateBeta`

Calculates Beta (systematic risk) based on CAPM.

```typescript
function calculateBeta(options: BetaOptions): BetaResult
```

**Parameters**:
- `assetReturns: number[]` - Asset returns
- `benchmarkReturns: number[]` - Benchmark returns
- `annualizationFactor?: number` - Annualization factor

---

### `calculateCalmarRatio`

Calculates the Calmar Ratio (Return vs. Maximum Drawdown).

```typescript
function calculateCalmarRatio(options: CalmarRatioOptions): CalmarRatioResult
```

**Parameters**:
- `returns: number[]` - Portfolio returns
- `portfolioValues: number[]` - Portfolio values
- `annualizationFactor?: number` - Annualization factor

---

## Utility Functions

### `getZScore`

Calculates Z-Score for normal distribution.

```typescript
function getZScore(confidenceLevel: number): number
```

### `inverseErf`

Calculates inverse Error Function for statistical calculations.

```typescript
function inverseErf(x: number): number
```

---

## Type Definitions

All functions use Zod schemas for type-safety:

```typescript
// Portfolio Types
export type TimeWeightedReturnOptions = {
  portfolioValues: number[];
  cashFlows: number[];
  annualizationFactor?: number;
};

export type TimeWeightedReturnResult = {
  twr: number;
  annualizedTWR: number;
  periodReturns: number[];
};

// Risk Types
export type VaROptions = {
  returns: number[];
  confidenceLevel: number;
  method: 'historical' | 'parametric' | 'monte-carlo';
  annualizationFactor?: number;
};

export type VaRResult = {
  var: number;
  confidenceLevel: number;
  method: string;
};
```

---

## Performance Notes

- **Optimized for large datasets**: Efficient algorithms for portfolio analysis
- **Memory-Efficient**: Minimal memory allocation
- **Type-Safe**: Complete TypeScript support
- **Validated**: Zod schema validation for all inputs

---

## Error Handling

All functions throw meaningful errors:

```typescript
try {
  const result = calculateTimeWeightedReturn(options);
} catch (error) {
  if (error instanceof Error) {
    console.error('Calculation failed:', error.message);
  }
}
```

**Common errors**:
- `Invalid input data` - Invalid input data
- `Array length mismatch` - Unequal array lengths
- `Convergence failed` - Newton-Raphson convergence failed
- `Invalid confidence level` - Invalid confidence level
