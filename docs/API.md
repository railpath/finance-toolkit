# API Reference

Complete API documentation for @railpath/finance-toolkit.

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

## Portfolio Management

### `calculatePortfolioOptimization`

Calculates Markowitz Mean-Variance Portfolio Optimization using Quadratic Programming.

**Description**: Implements the classic Markowitz portfolio theory for optimal asset allocation using a dedicated quadratic programming solver. Supports minimum variance, maximum Sharpe ratio, and target return optimization with various constraints.

```typescript
function calculatePortfolioOptimization(options: PortfolioOptimizationOptions): PortfolioOptimizationResult
```

**Parameters**:
- `expectedReturns: number[]` - Array of expected returns for each asset
- `covarianceMatrix: number[][]` - Covariance matrix (n×n) for asset returns
- `riskFreeRate?: number` - Risk-free rate for Sharpe ratio calculation (default: 0)
- `objective?: 'minimumVariance' | 'maximumSharpe' | 'targetReturn'` - Optimization objective (default: 'minimumVariance')
- `targetReturn?: number` - Target return for target return optimization
- `minWeight?: number` - Minimum weight per asset (default: 0)
- `maxWeight?: number` - Maximum weight per asset (default: 1)
- `sumTo1?: boolean` - Whether weights must sum to 1 (default: true)

**Returns**:
- `weights: number[]` - Optimal portfolio weights
- `expectedReturn: number` - Expected portfolio return
- `variance: number` - Portfolio variance
- `volatility: number` - Portfolio volatility (standard deviation)
- `method: string` - Optimization method used
- `converged: boolean` - Whether optimization converged
- `iterations?: number` - Number of iterations performed
- `sharpeRatio?: number` - Sharpe ratio (for maximum Sharpe optimization)

**Example**:
```typescript
const optimization = calculatePortfolioOptimization({
  expectedReturns: [0.08, 0.12, 0.15],
  covarianceMatrix: [
    [0.04, 0.02, 0.01],
    [0.02, 0.09, 0.03],
    [0.01, 0.03, 0.02]
  ],
  objective: 'minimumVariance',
  minWeight: 0.1,
  maxWeight: 0.8
});

console.log('Optimal weights:', optimization.weights);
console.log('Expected return:', optimization.expectedReturn);
console.log('Volatility:', optimization.volatility);
console.log('Converged:', optimization.converged);
console.log('Iterations:', optimization.iterations);
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

### `calculateSkewness`

Calculates the Skewness (third moment) of a dataset.

**Description**: Skewness measures the asymmetry of the distribution. Positive values indicate right-skewed distributions (long right tail), negative values indicate left-skewed distributions (long left tail), and zero indicates symmetric distribution.

```typescript
function calculateSkewness(data: number[]): number
```

**Parameters**:
- `data: number[]` - Array of numbers to calculate skewness for

**Returns**:
- `number` - Skewness value

**Example**:
```typescript
const returns = [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01];
const skewness = calculateSkewness(returns);
console.log('Skewness:', skewness); // -0.234 (left-skewed)
```

---

### `calculateSemideviation`

Calculates the Semideviation (Downside Deviation) of a dataset.

**Description**: Semideviation measures the volatility of returns below a specified threshold. It focuses only on downside risk, ignoring positive volatility, making it a key metric for downside risk assessment.

```typescript
function calculateSemideviation(options: SemideviationOptions): SemideviationResult
```

**Parameters**:
- `returns: number[]` - Array of returns to calculate semideviation for
- `threshold?: number` - Threshold for downside returns (default: 0)
- `annualizationFactor?: number` - Annualization factor (default: 252)
- `annualized?: boolean` - Whether to return annualized values (default: true)

**Returns**:
- `semideviation: number` - Period-based semideviation
- `annualizedSemideviation: number` - Annualized semideviation
- `downsideCount: number` - Number of downside returns
- `downsidePercentage: number` - Percentage of downside returns
- `threshold: number` - Threshold used
- `meanReturn: number` - Mean return of dataset
- `standardDeviation: number` - Standard deviation for comparison

**Example**:
```typescript
const semideviation = calculateSemideviation({
  returns: [0.01, -0.02, 0.03, -0.01, -0.05, 0.02],
  threshold: 0, // Zero threshold
  annualizationFactor: 252
});

console.log('Semideviation:', semideviation.semideviation);
console.log('Downside %:', semideviation.downsidePercentage); // 50%
```

---

### `calculateKurtosis`

Calculates the Excess Kurtosis (fourth moment) of a dataset.

**Description**: Kurtosis measures the "tailedness" of the distribution. Positive excess kurtosis indicates heavy tails (more extreme values than normal distribution), negative values indicate light tails, and zero indicates normal distribution.

```typescript
function calculateKurtosis(data: number[]): number
```

**Parameters**:
- `data: number[]` - Array of numbers to calculate kurtosis for

**Returns**:
- `number` - Excess kurtosis value (kurtosis - 3)

**Example**:
```typescript
const returns = [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01];
const kurtosis = calculateKurtosis(returns);
console.log('Excess Kurtosis:', kurtosis); // 2.45 (fat tails)
```

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

### `solveQuadraticProgram`

Solves Quadratic Programming problems using gradient descent with constraint projection.

**Description**: A practical implementation of quadratic programming optimization suitable for portfolio optimization and other financial applications. Uses simplified gradient descent with constraint projection for robust results.

```typescript
function solveQuadraticProgram(Q: number[][], c: number[], options?: QuadraticProgramOptions): QuadraticProgramResult
```

**Parameters**:
- `Q: number[][]` - Quadratic coefficient matrix (n×n, symmetric, positive semi-definite)
- `c: number[]` - Linear coefficient vector (n×1)
- `options?: QuadraticProgramOptions` - Solver options and constraints

**Options**:
- `equalityConstraints?: { A: number[][], b: number[] }` - Equality constraints: Ax = b
- `nonNegative?: boolean` - Non-negativity constraints: x ≥ 0 (default: false)
- `maxIterations?: number` - Maximum number of iterations (default: 1000)
- `tolerance?: number` - Convergence tolerance (default: 1e-3)
- `initialGuess?: number[]` - Initial guess (optional)

**Returns**:
- `solution: number[]` - Solution vector
- `objectiveValue: number` - Final objective value
- `converged: boolean` - Whether optimization converged
- `iterations: number` - Number of iterations performed
- `gradientNorm: number` - Final gradient norm
- `constraintViolation: number` - Constraint violation (if any)

**Example**:
```typescript
// Portfolio optimization: min wᵀΣw subject to wᵀ1=1, w≥0
const result = solveQuadraticProgram(
  covarianceMatrix,  // Q = Σ
  [0, 0, 0],        // c = 0 (minimum variance)
  {
    equalityConstraints: { A: [[1,1,1]], b: [1] },  // wᵀ1 = 1
    nonNegative: true,                              // w ≥ 0
    maxIterations: 1000,
    tolerance: 1e-4
  }
);

console.log('Solution:', result.solution);
console.log('Converged:', result.converged);
console.log('Iterations:', result.iterations);
```

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

### `vectorNorm`

Calculates the Euclidean norm (magnitude) of a vector.

```typescript
function vectorNorm(v: number[]): number
```

### `vectorAdd`

Add two vectors element-wise.

```typescript
function vectorAdd(a: number[], b: number[]): number[]
```

### `vectorDot`

Calculate the dot product (inner product) of two vectors.

```typescript
function vectorDot(a: number[], b: number[]): number
```

### `matrixVectorMultiply`

Multiply a matrix by a vector.

```typescript
function matrixVectorMultiply(A: number[][], x: number[]): number[]
```

### `matrixTranspose`

Calculate the transpose of a matrix.

```typescript
function matrixTranspose(A: number[][]): number[][]
```

### `solveLinearSystem`

Solve a linear system Ax = b using Gaussian elimination.

```typescript
function solveLinearSystem(A: number[][], b: number[]): number[]
```

### `projectOntoEqualityConstraints`

Project a solution vector onto equality constraints Ax = b.

```typescript
function projectOntoEqualityConstraints(x: number[], A: number[][], b: number[]): number[]
```

### `projectOntoNonNegativityConstraints`

Project a solution vector onto non-negativity constraints x ≥ 0.

```typescript
function projectOntoNonNegativityConstraints(x: number[]): number[]
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

---

## Utility Functions

### `solveQuadraticProgram`

Solves Quadratic Programming problems using gradient descent with constraint projection.

**Description**: A practical implementation of quadratic programming optimization suitable for portfolio optimization and other financial applications. Uses simplified gradient descent with constraint projection for robust results.

```typescript
function solveQuadraticProgram(Q: number[][], c: number[], options?: QuadraticProgramOptions): QuadraticProgramResult
```

**Parameters**:
- `Q: number[][]` - Quadratic coefficient matrix (n×n, symmetric, positive semi-definite)
- `c: number[]` - Linear coefficient vector (n×1)
- `options?: QuadraticProgramOptions` - Solver options and constraints

**Options**:
- `equalityConstraints?: { A: number[][], b: number[] }` - Equality constraints: Ax = b
- `nonNegative?: boolean` - Non-negativity constraints: x ≥ 0 (default: false)
- `maxIterations?: number` - Maximum number of iterations (default: 1000)
- `tolerance?: number` - Convergence tolerance (default: 1e-3)
- `initialGuess?: number[]` - Initial guess (optional)

**Returns**:
- `solution: number[]` - Solution vector
- `objectiveValue: number` - Final objective value
- `converged: boolean` - Whether optimization converged
- `iterations: number` - Number of iterations performed
- `gradientNorm: number` - Final gradient norm
- `constraintViolation: number` - Constraint violation (if any)

**Example**:
```typescript
// Portfolio optimization: min wᵀΣw subject to wᵀ1=1, w≥0
const result = solveQuadraticProgram(
  covarianceMatrix,  // Q = Σ
  [0, 0, 0],        // c = 0 (minimum variance)
  {
    equalityConstraints: { A: [[1,1,1]], b: [1] },  // wᵀ1 = 1
    nonNegative: true,                              // w ≥ 0
    maxIterations: 1000,
    tolerance: 1e-4
  }
);

console.log('Solution:', result.solution);
console.log('Converged:', result.converged);
console.log('Iterations:', result.iterations);
```

---

## Vector Operations

Mathematical operations on vectors for use in optimization and numerical computations.

### `vectorNorm`
Calculate the Euclidean norm (magnitude) of a vector.

### `vectorAdd`
Add two vectors element-wise.

### `vectorSubtract`
Subtract two vectors element-wise.

### `vectorScale`
Scale a vector by a scalar value.

### `vectorDot`
Calculate the dot product of two vectors.

### `vectorCross`
Calculate the cross product of two 3D vectors.

### `vectorNormalize`
Normalize a vector to unit length.

### `vectorDistance`
Calculate the Euclidean distance between two vectors.

### `vectorEquals`
Check if two vectors are approximately equal.

### `createZeroVector`
Create a zero vector of specified length.

### `createConstantVector`
Create a vector filled with a constant value.

---

## Matrix Operations

Mathematical operations on matrices for use in optimization and numerical computations.

### `matrixVectorMultiply`
Multiply a matrix by a vector.

### `matrixTranspose`
Calculate the transpose of a matrix.

### `matrixMatrixMultiply`
Multiply two matrices.

### `matrixTrace`
Calculate the trace (sum of diagonal elements) of a matrix.

### `isMatrixSymmetric`
Check if a matrix is symmetric.

### `isMatrixPositiveDefinite`
Check if a matrix is positive definite.

### `createIdentityMatrix`
Create an identity matrix of specified size.

### `createZeroMatrix`
Create a zero matrix of specified dimensions.

### `matrixDiagonal`
Extract the diagonal elements of a matrix.

### `matrixFrobeniusNorm`
Calculate the Frobenius norm of a matrix.

---

## Linear System Solver

Functions for solving linear systems of equations.

### `solveLinearSystem`
Solve a linear system Ax = b using Gaussian elimination.

### `solveMultipleLinearSystems`
Solve multiple linear systems with the same coefficient matrix.

### `matrixDeterminant`
Calculate the determinant of a square matrix.

### `luDecomposition`
Perform LU decomposition of a matrix.

### `isMatrixInvertible`
Check if a matrix is invertible.

### `matrixConditionNumber`
Calculate the condition number of a matrix.

---

## Constraint Projection

Functions for projecting solutions onto constraint sets.

### `projectOntoEqualityConstraints`
Project a solution onto equality constraints.

### `projectOntoNonNegativityConstraints`
Project a solution onto non-negativity constraints.

### `projectOntoBoxConstraints`
Project a solution onto box constraints.

### `projectOntoSimplex`
Project a solution onto the simplex constraint.

### `projectGradientOntoEqualityConstraints`
Project a gradient onto equality constraints.

### `projectGradientOntoNonNegativityConstraints`
Project a gradient onto non-negativity constraints.

### `calculateEqualityConstraintViolation`
Calculate the violation of equality constraints.

### `calculateInequalityConstraintViolation`
Calculate the violation of inequality constraints.

### `isSolutionFeasible`
Check if a solution satisfies all constraints.
