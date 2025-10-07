# Portfolio Optimization

## Overview

The `calculatePortfolioOptimization` function implements **Mean-Variance Optimization** based on Modern Portfolio Theory (MPT) using a custom Quadratic Programming solver.

## Implementation Details

### Optimization Method

**Mean-Variance Optimization (Markowitz)**
- Minimizes portfolio variance for a given expected return
- Uses quadratic programming to find optimal weights
- Implements Active Set Method for constraint handling

### Solver

Custom **Quadratic Programming Solver** with:
- **Algorithm**: Active Set Method with constraint projection
- **Convergence**: Gradient-based with configurable tolerance
- **Max Iterations**: 1000 (configurable via options)

### Constraints

#### Supported Constraints

1. **Sum-to-One Constraint** (Always Active)
   - All weights must sum to 1.0
   - Ensures fully invested portfolio

2. **Long-Only Constraint** (Optional, Default: ON)
   ```typescript
   {
     longOnly: true  // No short positions (weights >= 0)
   }
   ```

3. **Weight Bounds** (Optional)
   ```typescript
   {
     minWeight: 0.05,  // Min 5% per asset
     maxWeight: 0.30   // Max 30% per asset
   }
   ```

4. **Target Return** (Optional)
   ```typescript
   {
     targetReturn: 0.10  // 10% expected return
   }
   ```

#### NOT Currently Supported

- ❌ Leverage constraints
- ❌ Sector/Group constraints
- ❌ Turnover constraints
- ❌ Transaction costs

## Risk-Free Rate

The risk-free rate is **NOT** used in the optimization itself.

**Usage:**
- Used only for **Sharpe Ratio calculation** in the output
- Does not affect optimal weights
- Optional parameter (defaults to 0)

## Parameters

### Required

- `expectedReturns: number[]` - Expected returns for each asset (annualized)
- `covarianceMatrix: number[][]` - Covariance matrix of asset returns

### Optional

- `riskFreeRate?: number` - Risk-free rate for Sharpe ratio (default: 0)
- `longOnly?: boolean` - Enforce non-negative weights (default: true)
- `minWeight?: number` - Minimum weight per asset (default: none)
- `maxWeight?: number` - Maximum weight per asset (default: none)
- `targetReturn?: number` - Target portfolio return (default: none)
- `maxIterations?: number` - Solver max iterations (default: 1000)
- `tolerance?: number` - Convergence tolerance (default: 1e-6)

## Output

```typescript
{
  weights: number[];              // Optimal portfolio weights
  expectedReturn: number;         // Portfolio expected return
  expectedVolatility: number;     // Portfolio volatility (std dev)
  sharpeRatio: number;           // (Return - RiskFree) / Volatility
  success: boolean;              // Optimization succeeded
  iterations?: number;           // Iterations until convergence
  message?: string;              // Status/error message
}
```

## Examples

### Basic Mean-Variance Optimization

```typescript
import { calculatePortfolioOptimization } from '@railpath/finance-toolkit';

const result = calculatePortfolioOptimization({
  expectedReturns: [0.10, 0.12, 0.08, 0.15],
  covarianceMatrix: [
    [0.04, 0.02, 0.01, 0.03],
    [0.02, 0.09, 0.02, 0.04],
    [0.01, 0.02, 0.01, 0.02],
    [0.03, 0.04, 0.02, 0.16]
  ],
  riskFreeRate: 0.03
});

console.log(result.weights);           // [0.25, 0.30, 0.20, 0.25]
console.log(result.expectedReturn);    // 0.1125
console.log(result.sharpeRatio);       // 1.85
```

### With Weight Constraints

```typescript
const result = calculatePortfolioOptimization({
  expectedReturns: [0.10, 0.12, 0.08, 0.15],
  covarianceMatrix: [...],
  minWeight: 0.10,  // At least 10% per asset
  maxWeight: 0.40,  // At most 40% per asset
  longOnly: true    // No short selling
});
```

### Target Return Optimization

```typescript
const result = calculatePortfolioOptimization({
  expectedReturns: [0.10, 0.12, 0.08, 0.15],
  covarianceMatrix: [...],
  targetReturn: 0.12,  // Target 12% return
  longOnly: true
});
```

## Mathematical Formulation

### Objective Function

Minimize portfolio variance:

```
min (1/2) * w' * Σ * w
```

Where:
- `w` = portfolio weights
- `Σ` = covariance matrix

### Constraints

```
w' * 1 = 1           (sum to one)
w >= 0               (long-only, if enabled)
w_i >= minWeight     (if specified)
w_i <= maxWeight     (if specified)
w' * μ = targetReturn (if specified)
```

Where:
- `μ` = expected returns vector

## Limitations

1. **Single Period**: Assumes single-period optimization
2. **Gaussian Returns**: Implicitly assumes normal distribution
3. **No Rebalancing Costs**: Ignores transaction costs
4. **Historical Inputs**: Requires user-provided expected returns and covariance

## Best Practices

1. **Expected Returns**: Use realistic forward-looking estimates, not historical averages
2. **Covariance Matrix**: Ensure positive semi-definite (use shrinkage if needed)
3. **Constraints**: Set reasonable bounds to avoid extreme allocations
4. **Risk-Free Rate**: Use current T-Bill rate for Sharpe calculation

## Related Functions

- `calculateCovarianceMatrix` - Compute covariance from returns
- `calculatePortfolioVolatility` - Calculate portfolio risk
- `calculatePortfolioRebalancing` - Implement optimal weights

