# Value at Risk (VaR) Methods

## Overview

The library implements three VaR calculation methods, each with different assumptions and use cases.

## Methods Comparison

| Method | Distribution | Best For | Pros | Cons |
|--------|-------------|----------|------|------|
| **Historical** | Empirical | Non-normal returns | No assumptions | Requires large sample |
| **Parametric** | Normal | Large portfolios | Fast, analytical | Normal assumption |
| **Monte Carlo** | Custom | Complex portfolios | Flexible | Computationally intensive |

---

## 1. Historical VaR

### Method

Uses empirical distribution of historical returns.

**Algorithm:**
1. Sort historical returns
2. Find percentile corresponding to confidence level
3. Return absolute value at that percentile

### Parameters

```typescript
calculateHistoricalVaR({
  returns: number[];           // Historical returns
  confidenceLevel?: number;    // Default: 0.95 (95%)
})
```

### Assumptions

- ✅ **No distribution assumption**
- ✅ **Past is representative of future**
- ❌ Requires sufficient historical data (min. 250 observations recommended)

### Time Horizon

- **Implicit**: Based on frequency of input returns
- Daily returns → 1-day VaR
- Weekly returns → 1-week VaR
- Monthly returns → 1-month VaR

### Example

```typescript
import { calculateHistoricalVaR } from '@railpath/finance-toolkit';

const result = calculateHistoricalVaR({
  returns: dailyReturns,  // Array of 252 daily returns
  confidenceLevel: 0.95   // 95% confidence
});

console.log(result.value);  // 1-day VaR at 95%
// Interpretation: 95% confident loss won't exceed this value in 1 day
```

---

## 2. Parametric VaR

### Method

Assumes returns follow a **Normal (Gaussian) Distribution**.

**Formula:**
```
VaR = μ + Z * σ
```

Where:
- `μ` = mean return
- `Z` = Z-score for confidence level
- `σ` = standard deviation

### Parameters

```typescript
calculateParametricVaR({
  returns: number[];           // Historical returns for μ and σ
  confidenceLevel?: number;    // Default: 0.95
})
```

### Distribution

**Normal Distribution (Gaussian)**
- Mean: Sample mean of returns
- Std Dev: Sample standard deviation
- Z-scores:
  - 90%: -1.28
  - 95%: -1.65
  - 99%: -2.33

**NOT Implemented:**
- ❌ Student's t-distribution
- ❌ Fat-tailed distributions
- ❌ GARCH models

### Time Horizon

- **Implicit**: Based on frequency of input returns
- Can scale using **square root of time** (not recommended for long horizons):
  ```
  VaR(T days) ≈ VaR(1 day) * √T
  ```

### Example

```typescript
import { calculateParametricVaR } from '@railpath/finance-toolkit';

const result = calculateParametricVaR({
  returns: dailyReturns,
  confidenceLevel: 0.99  // 99% confidence
});

console.log(result.value);  // 1-day VaR at 99%
```

### Limitations

- Assumes normal distribution (underestimates tail risk)
- Not suitable for skewed or fat-tailed distributions
- Use Historical or Monte Carlo for non-normal returns

---

## 3. Monte Carlo VaR

### Method

Simulates future returns using specified distribution parameters.

**Algorithm:**
1. Generate N random returns from Normal(μ, σ)
2. Sort simulated returns
3. Find percentile at confidence level

### Parameters

```typescript
calculateMonteCarloVaR({
  returns: number[];           // Historical returns for μ and σ
  confidenceLevel?: number;    // Default: 0.95
  simulations?: number;        // Default: 10,000
})
```

### Simulation Details

- **Number of Simulations**: 10,000 (default, configurable)
- **Distribution**: Normal(μ, σ) derived from historical returns
- **Random Seed**: Not fixed (results vary slightly between runs)

### Distribution

**Currently: Normal Distribution Only**
- Mean: Historical mean
- Std Dev: Historical standard deviation

**Future Enhancements Could Include:**
- Student's t-distribution
- Custom distributions
- GARCH volatility models

### Time Horizon

- **Single period**: Simulates one-step ahead returns
- Based on frequency of input returns (daily → 1-day, etc.)

### Example

```typescript
import { calculateMonteCarloVaR } from '@railpath/finance-toolkit';

const result = calculateMonteCarloVaR({
  returns: dailyReturns,
  confidenceLevel: 0.95,
  simulations: 50000  // Higher for more precision
});

console.log(result.value);  // 1-day VaR at 95%
console.log(result.simulations);  // 50000
```

### When to Use

- **Complex portfolios** with non-linear instruments
- **Scenario analysis** with custom distributions
- **Stress testing** with modified parameters

---

## Pre-configured Functions

### VaR 95%

```typescript
import { calculateVaR95 } from '@railpath/finance-toolkit';

const result = calculateVaR95({
  returns: dailyReturns,
  method: 'historical'  // or 'parametric' or 'montecarlo'
});
```

### VaR 99%

```typescript
import { calculateVaR99 } from '@railpath/finance-toolkit';

const result = calculateVaR99({
  returns: dailyReturns,
  method: 'parametric'
});
```

---

## Expected Shortfall (CVaR)

All VaR methods also return **Expected Shortfall** (Conditional VaR):

```typescript
const result = calculateHistoricalVaR({
  returns: dailyReturns,
  confidenceLevel: 0.95
});

console.log(result.value);  // VaR: max loss at 95%
console.log(result.cvar);   // CVaR: expected loss beyond VaR
```

**CVaR Calculation:**
- Average of all returns worse than VaR threshold
- More conservative than VaR
- Better captures tail risk

---

## Time Horizon Scaling

### NOT Recommended (But Possible)

For **multi-day VaR** from 1-day VaR:

```
VaR(T days) ≈ VaR(1 day) * √T
```

**Issues:**
- Assumes i.i.d. returns
- Ignores mean reversion
- Not valid for long horizons

### Recommended Approach

1. Use returns at target frequency (e.g., weekly returns for weekly VaR)
2. Or simulate multi-period paths (Monte Carlo)

---

## Best Practices

### Method Selection

1. **Historical VaR**:
   - ✅ Sufficient data (250+ observations)
   - ✅ Non-normal returns
   - ✅ Simple implementation

2. **Parametric VaR**:
   - ✅ Large portfolios (fast calculation)
   - ✅ Approximately normal returns
   - ❌ Avoid for fat-tailed/skewed distributions

3. **Monte Carlo VaR**:
   - ✅ Complex portfolios
   - ✅ Custom scenarios
   - ❌ Computationally expensive

### General Guidelines

- Use **99% confidence** for regulatory capital
- Use **95% confidence** for internal risk management
- Compare multiple methods for robustness
- Backtest VaR estimates regularly

---

## Related Functions

- `calculateHistoricalExpectedShortfall` - CVaR using historical method
- `calculateParametricExpectedShortfall` - CVaR using parametric method
- `calculateMaxDrawdown` - Maximum historical loss
- `calculatePortfolioMetrics` - Includes VaR in comprehensive analysis

