# finlib-ts Documentation

Complete documentation for the finlib-ts TypeScript library.

---

## Documentation Overview

### [Getting Started](README.md)
- Installation and setup
- Quick start guide
- Basic usage

### [API Reference](API.md)
- Complete API documentation
- All functions and parameters
- Return values and examples

### [Portfolio Performance](PORTFOLIO_PERFORMANCE.md)
- Time-Weighted Return (TWR)
- Money-Weighted Return (MWR)
- Performance attribution
- Best practices

### [Risk Metrics](RISK_METRICS.md)
- Value at Risk (VaR)
- Expected Shortfall (CVaR)
- Risk-adjusted returns
- Stress testing

### [TypeScript Types](TYPES.md)
- Complete type documentation
- Zod schema validation
- Type guards and utilities

### [Examples](EXAMPLES.md)
- Real-world use cases
- Portfolio management dashboard
- Risk monitoring system
- Client reporting

---

## Quick Start

### Installation

```bash
npm install finlib-ts
```

### Basic Usage

```typescript
import { 
  calculateTimeWeightedReturn, 
  calculateMoneyWeightedReturn,
  calculateVaR,
  calculateSharpeRatio 
} from 'finlib-ts';

// Portfolio Performance
const twr = calculateTimeWeightedReturn({
  portfolioValues: [1000, 1100, 1200, 1150],
  cashFlows: [0, 100, 0, -50],
  annualizationFactor: 252
});

// Risk Analysis
const var95 = calculateVaR({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  confidenceLevel: 0.95,
  method: 'historical'
});
```

---

## Available Functions

### Portfolio Performance
- `calculateTimeWeightedReturn` - TWR Performance
- `calculateMoneyWeightedReturn` - MWR Performance (IRR)

### Risk Metrics
- `calculateVaR` - Value at Risk
- `calculateExpectedShortfall` - Conditional VaR
- `calculateSharpeRatio` - Risk-Adjusted Returns
- `calculateSortinoRatio` - Downside Risk-Adjusted Returns
- `calculateMaxDrawdown` - Maximum Drawdown

### Volatility
- `calculateVolatility` - Standard Volatility
- `calculateEWMAVolatility` - EWMA Volatility
- `calculateParkinsonVolatility` - Parkinson Volatility
- `calculateGarmanKlassVolatility` - Garman-Klass Volatility

### Portfolio Analysis
- `calculateCorrelationMatrix` - Asset Correlations
- `calculateCovarianceMatrix` - Asset Covariances
- `calculatePortfolioVolatility` - Portfolio Risk

### Performance Metrics
- `calculateAlpha` - CAPM Alpha
- `calculateBeta` - CAPM Beta
- `calculateCalmarRatio` - Return vs. Drawdown

---

## Use Cases

### Portfolio Manager
- Performance Attribution
- Benchmark Comparison
- Risk-Adjusted Returns

### Risk Manager
- VaR Monitoring
- Stress Testing
- Risk Limits

### Quantitative Analyst
- Factor Models
- Volatility Forecasting
- Correlation Analysis

### Financial Advisor
- Client Performance
- Risk Assessment
- Asset Allocation

---

## 🔧 TypeScript Support

### Type Safety
```typescript
import type { 
  TimeWeightedReturnOptions, 
  TimeWeightedReturnResult 
} from 'finlib-ts';

const options: TimeWeightedReturnOptions = {
  portfolioValues: [1000, 1100, 1200],
  cashFlows: [0, 100, 0],
  annualizationFactor: 252
};

const result: TimeWeightedReturnResult = calculateTimeWeightedReturn(options);
```

### Zod Validation
```typescript
// Runtime validation with Zod
const validatedOptions = TimeWeightedReturnOptionsSchema.parse(options);
const result = calculateTimeWeightedReturn(validatedOptions);
```

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

MIT License - see [LICENSE](../LICENSE) for details.
