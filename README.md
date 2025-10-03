# 🏔️ @railpath/finance-toolkit

A comprehensive TypeScript library for portfolio management and risk analytics.

**@railpath/finance-toolkit** provides a complete collection of financial metrics with focus on modularity, type-safety, and performance.

---

## Features

### **Portfolio Performance Metrics**
- **Time-Weighted Return (TWR)** – Performance independent of cash flows
- **Money-Weighted Return (MWR)** – IRR-based performance with cash flow consideration
- **Sharpe Ratio** – Risk-adjusted returns
- **Sortino Ratio** – Downside risk-adjusted returns
- **Calmar Ratio** – Return vs. maximum drawdown

### **Risk Metrics**
- **Value at Risk (VaR)** – Historical, Parametric, Monte Carlo methods
- **Expected Shortfall (CVaR)** – Conditional Value at Risk
- **Maximum Drawdown** – Largest loss from peak to trough
- **Alpha & Beta** – CAPM-based performance metrics
- **Tracking Error** – Deviation from benchmark

### **Volatility Calculations**
- **Standard Deviation** – Classical volatility
- **EWMA Volatility** – Exponentially Weighted Moving Average
- **Parkinson Volatility** – High-Low range based
- **Garman-Klass Volatility** – OHLC-based volatility

### **Portfolio Analysis**
- **Correlation Matrix** – Asset correlations
- **Covariance Matrix** – Asset covariances
- **Portfolio Volatility** – Total portfolio risk
- **Information Ratio** – Active return vs. tracking error

---

## Installation

```bash
npm install @railpath/finance-toolkit
```

## Quick Start

### Portfolio Performance

```typescript
import { 
  calculateTimeWeightedReturn, 
  calculateMoneyWeightedReturn 
} from '@railpath/finance-toolkit';

// Time-Weighted Return (TWR)
const twr = calculateTimeWeightedReturn({
  portfolioValues: [1000, 1100, 1200, 1150],
  cashFlows: [0, 100, 0, -50],
  annualizationFactor: 252
});

// Money-Weighted Return (MWR) - IRR
const mwr = calculateMoneyWeightedReturn({
  cashFlows: [1000, 100, -50],
  dates: [new Date('2023-01-01'), new Date('2023-06-01'), new Date('2023-12-01')],
  finalValue: 1150,
  initialValue: 0
});
```

### Risk Analysis

```typescript
import { 
  calculateVaR, 
  calculateSharpeRatio, 
  calculateMaxDrawdown 
} from '@railpath/finance-toolkit';

// Value at Risk (95% Confidence)
const var95 = calculateVaR({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  confidenceLevel: 0.95,
  method: 'historical'
});

// Sharpe Ratio
const sharpe = calculateSharpeRatio({
  returns: [0.01, 0.02, -0.01, 0.03],
  riskFreeRate: 0.02,
  annualizationFactor: 252
});

// Maximum Drawdown
const maxDD = calculateMaxDrawdown({
  portfolioValues: [1000, 1100, 1050, 1200, 1150]
});
```

### Portfolio Analysis

```typescript
import { 
  calculateCorrelationMatrix, 
  calculatePortfolioVolatility 
} from '@railpath/finance-toolkit';

// Asset Correlation Matrix
const correlation = calculateCorrelationMatrix({
  assetReturns: [
    [0.01, 0.02, -0.01], // Asset 1
    [0.015, 0.025, -0.005] // Asset 2
  ]
});

// Portfolio Volatility
const portfolioVol = calculatePortfolioVolatility({
  weights: [0.6, 0.4],
  covarianceMatrix: [[0.04, 0.02], [0.02, 0.09]]
});
```

---

## Use Cases

### **Portfolio Manager**
- Performance attribution and benchmarking
- Risk-adjusted return optimization
- Cash flow impact analysis

### **Risk Manager**
- VaR and Expected Shortfall monitoring
- Stress testing and scenario analysis
- Portfolio concentration risk

### **Quantitative Analyst**
- Factor model development
- Volatility forecasting
- Correlation structure analysis

### **Financial Advisor**
- Client portfolio performance
- Risk assessment and reporting
- Asset allocation optimization

---

## TypeScript Support

All functions are fully typed with Zod validation:

```typescript
import type { 
  TimeWeightedReturnOptions, 
  TimeWeightedReturnResult,
  MoneyWeightedReturnOptions,
  MoneyWeightedReturnResult 
} from '@railpath/finance-toolkit';

// Type-safe Options
const options: TimeWeightedReturnOptions = {
  portfolioValues: [1000, 1100, 1200],
  cashFlows: [0, 100, 0],
  annualizationFactor: 252
};

// Type-safe Results
const result: TimeWeightedReturnResult = calculateTimeWeightedReturn(options);
console.log(result.twr); // number
console.log(result.annualizedTWR); // number
console.log(result.periodReturns); // number[]
```

---

## API Reference

### Portfolio Performance

| Function | Description | Input | Output |
|----------|-------------|-------|--------|
| `calculateTimeWeightedReturn` | TWR Performance | Portfolio Values, Cash Flows | TWR, Annualized TWR, Period Returns |
| `calculateMoneyWeightedReturn` | MWR Performance (IRR) | Cash Flows, Dates, Final Value | MWR, Annualized MWR, NPV, Iterations |

### Risk Metrics

| Function | Description | Methods |
|----------|-------------|---------|
| `calculateVaR` | Value at Risk | Historical, Parametric, Monte Carlo |
| `calculateExpectedShortfall` | Conditional VaR | Historical, Parametric |
| `calculateSharpeRatio` | Risk-Adjusted Returns | Standard, Annualized |
| `calculateSortinoRatio` | Downside Risk-Adjusted | Standard, Annualized |
| `calculateMaxDrawdown` | Maximum Loss | Peak-to-Trough Analysis |

### Volatility

| Function | Description | Input |
|----------|-------------|-------|
| `calculateVolatility` | Standard Deviation | Returns Array |
| `calculateEWMAVolatility` | Exponentially Weighted | Returns, Lambda |
| `calculateParkinsonVolatility` | High-Low Range | OHLC Data |
| `calculateGarmanKlassVolatility` | OHLC-based | OHLC Data |

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage**: 829 Tests across 34 test files

---

## Build

```bash
# Build for production
npm run build

# Development with watch mode
npm run dev
```

**Output**: TypeScript declarations and optimized JavaScript modules

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement tests for new functions
4. Ensure all tests pass
5. Create a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details.
