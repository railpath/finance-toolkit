<img src="https://github.com/railpath/railpath/blob/main/railpath-logo.png" alt="Railpath" width="80" align="left">

# @railpath/finance-toolkit

A comprehensive TypeScript library for portfolio management and risk analytics.

**@railpath/finance-toolkit** provides a complete collection of financial metrics with focus on modularity, type-safety, and performance.

Part of the [RailPath](https://github.com/railpath) open source ecosystem – building financial infrastructure that belongs to everyone.

---

## Features

### **Portfolio Performance Metrics**
- **Time-Weighted Return (TWR)** – Performance independent of cash flows
- **Money-Weighted Return (MWR)** – IRR-based performance with cash flow consideration
- **Portfolio Metrics** – Comprehensive portfolio analysis (CAGR, Sharpe, Sortino, VaR, ES)
- **Performance Attribution** – Factor-based performance analysis
- **Portfolio Optimization** – Mean-variance optimization
- **Portfolio Rebalancing** – Rebalancing strategies and trade calculations
- **Equal Weight Portfolio** – Equal weight allocation strategies
- **Returns Calculation** – Various return calculation methods
- **Risk Metrics** – Portfolio-level risk analysis
- **Information Ratio** – Active return vs. tracking error
- **Tracking Error** – Deviation from benchmark

### **Risk Metrics**
- **Value at Risk (VaR)** – Historical, Parametric, Monte Carlo methods
- **Expected Shortfall (CVaR)** – Conditional Value at Risk
- **Maximum Drawdown** – Largest loss from peak to trough
- **Alpha & Beta** – CAPM-based performance metrics
- **Sharpe Ratio** – Risk-adjusted returns
- **Sortino Ratio** – Downside risk-adjusted returns
- **Calmar Ratio** – Return vs. maximum drawdown
- **Standard Deviation** – Classical volatility measure
- **Semideviation** – Downside volatility measure
- **Skewness & Kurtosis** – Distribution shape analysis
- **VaR 95% & 99%** – Pre-configured confidence levels

### **Technical Indicators**
- **SMA (Simple Moving Average)** – Trend-following indicator
- **EMA (Exponential Moving Average)** – Weighted trend indicator
- **MACD (Moving Average Convergence Divergence)** – Trend momentum indicator
- **RSI (Relative Strength Index)** – Momentum oscillator (0-100)
- **Stochastic Oscillator** – Momentum indicator (%K, %D)
- **Williams %R** – Momentum oscillator (-100 to 0)
- **Bollinger Bands** – Volatility-based price channels
- **ATR (Average True Range)** – Volatility measurement

### **Volatility Calculations**
- **Standard Deviation** – Classical volatility
- **EWMA Volatility** – Exponentially Weighted Moving Average
- **Parkinson Volatility** – High-Low range based
- **Garman-Klass Volatility** – OHLC-based volatility

### **Portfolio Analysis**
- **Correlation Matrix** – Asset correlations
- **Covariance Matrix** – Asset covariances
- **Portfolio Volatility** – Total portfolio risk
- **Portfolio Optimization** – Mean-variance optimization
- **Portfolio Rebalancing** – Rebalancing strategies
- **Equal Weight Allocation** – Equal weight strategies
- **Performance Attribution** – Factor-based analysis

### **Machine Learning - Regime Detection**
- **Hidden Markov Model (HMM)** – Market regime identification (bullish/bearish/neutral)
- **Feature Extraction** – Automatic feature engineering from price data
- **Flexible Configuration** – 2-5+ states with custom labels
- **Advanced Features** – Returns, Volatility, RSI, MACD, EMA support
- **Production-Ready** – Numerically stable algorithms, zero runtime dependencies
- **Low-Level API** – Forward, Backward, Viterbi, Baum-Welch algorithms for advanced users

---

## Language Support

Written in TypeScript, works seamlessly in JavaScript projects.
Type definitions included for IDE autocomplete.

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

### Technical Indicators

```typescript
import { 
  calculateSMA, 
  calculateEMA, 
  calculateMACD,
  calculateRSI, 
  calculateStochastic,
  calculateWilliamsR,
  calculateBollingerBands, 
  calculateATR 
} from '@railpath/finance-toolkit';

// Simple Moving Average (SMA)
const sma = calculateSMA({
  prices: [100, 102, 101, 103, 105, 104, 106],
  period: 5
});

// Exponential Moving Average (EMA)
const ema = calculateEMA({
  prices: [100, 102, 101, 103, 105, 104, 106],
  period: 5
});

// MACD (Moving Average Convergence Divergence)
const macd = calculateMACD({
  prices: [100, 102, 101, 103, 105, 104, 106, 107, 108, 109, 110, 111, 112, 113, 114],
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9
});

// Relative Strength Index (RSI)
const rsi = calculateRSI({
  prices: [100, 102, 101, 103, 105, 104, 106],
  period: 14
});

// Stochastic Oscillator
const stochastic = calculateStochastic({
  high: [102, 103, 101, 104, 105, 106, 107],
  low: [98, 99, 97, 100, 101, 102, 103],
  close: [100, 102, 100, 103, 104, 105, 106],
  kPeriod: 14,
  dPeriod: 3
});

// Williams %R
const williamsR = calculateWilliamsR({
  high: [102, 103, 101, 104, 105, 106, 107],
  low: [98, 99, 97, 100, 101, 102, 103],
  close: [100, 102, 100, 103, 104, 105, 106],
  period: 14
});

// Bollinger Bands
const bollinger = calculateBollingerBands({
  prices: [100, 102, 101, 103, 105, 104, 106],
  period: 20,
  stdDevMultiplier: 2
});
```

### Machine Learning - Regime Detection

```typescript
import { detectRegime } from '@railpath/finance-toolkit';

// Simple regime detection (3 states: bearish, neutral, bullish)
const result = detectRegime(prices);

console.log(result.currentRegime); // 'bullish'
console.log(result.confidence); // 0.85
console.log(result.regimes); // ['neutral', 'neutral', 'bullish', ...]

// Advanced with custom features
const advancedResult = detectRegime(prices, {
  numStates: 4,
  features: ['returns', 'volatility', 'rsi'],
  featureWindow: 20,
  stateLabels: ['strong_bearish', 'weak_bearish', 'weak_bullish', 'strong_bullish']
});
```

### More Examples

```typescript
// Average True Range (ATR)
const atr = calculateATR({
  high: [101, 103, 102, 104, 106, 105, 107],
  low: [99, 101, 100, 102, 104, 103, 105],
  close: [100, 102, 101, 103, 105, 104, 106],
  period: 14
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

### **Technical Analyst**
- Trend analysis with SMA, EMA, and MACD
- Momentum indicators (RSI, Stochastic, Williams %R) for market timing
- Volatility-based trading signals with Bollinger Bands and ATR

---

## TypeScript Support

All functions are fully typed with Zod validation and modular schema architecture:

```typescript
import type { 
  TimeWeightedReturnOptions, 
  TimeWeightedReturnResult,
  SMAOptions,
  SMAResult,
  RSIOptions,
  RSIResult
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

// Technical Indicators with separate Options/Result types
const smaOptions: SMAOptions = {
  prices: [100, 102, 101, 103, 105],
  period: 3
};

const smaResult: SMAResult = calculateSMA(smaOptions);
console.log(smaResult.sma); // number[]
console.log(smaResult.count); // number
console.log(smaResult.indices); // number[]

// MACD with multiple periods
const macdOptions: MACDOptions = {
  prices: [100, 102, 101, 103, 105, 104, 106],
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9
};

const macdResult: MACDResult = calculateMACD(macdOptions);
console.log(macdResult.macdLine); // number[]
console.log(macdResult.signalLine); // number[]
console.log(macdResult.histogram); // number[]
```

---

## Documentation

For detailed implementation specifications, see:

- **[Portfolio Optimization](docs/PORTFOLIO_OPTIMIZATION.md)** - Constraints, solver details, mathematical formulation
- **[VaR Methods](docs/VAR_METHODS.md)** - Distribution assumptions, time horizons, simulation parameters
- **[Technical Indicators](docs/TECHNICAL_INDICATORS.md)** - Calculation methods, smoothing techniques, standards

---

## API Reference

### Portfolio Performance

| Function | Description | Input | Output |
|----------|-------------|-------|--------|
| [`calculateTimeWeightedReturn`](src/portfolio/calculateTimeWeightedReturn.ts) | TWR Performance | Portfolio Values, Cash Flows | TWR, Annualized TWR, Period Returns |
| [`calculateMoneyWeightedReturn`](src/portfolio/calculateMoneyWeightedReturn.ts) | MWR Performance (IRR) | Cash Flows, Dates, Final Value | MWR, Annualized MWR, NPV, Iterations |
| [`calculatePortfolioMetrics`](src/portfolio/calculatePortfolioMetrics.ts) | Comprehensive Analysis | Portfolio Values, Risk-Free Rate | CAGR, Sharpe, Sortino, VaR, ES, Volatility |
| [`calculatePerformanceAttribution`](src/portfolio/calculatePerformanceAttribution.ts) | Factor Analysis | Returns, Factor Returns | Factor Contributions, Active Return |
| [`calculatePortfolioOptimization`](src/portfolio/calculatePortfolioOptimization.ts) | Mean-Variance Optimization | Expected Returns, Covariance Matrix | Optimal Weights, Risk-Return |
| [`calculatePortfolioRebalancing`](src/portfolio/calculatePortfolioRebalancing.ts) | Rebalancing Strategies | Current Weights, Target Weights | New Weights, Trade Amounts |
| [`calculateEqualWeightPortfolio`](src/portfolio/calculateEqualWeightPortfolio.ts) | Equal Weight Allocation | Asset Count | Equal Weights, Portfolio Metrics |
| [`calculateReturns`](src/portfolio/calculateReturns.ts) | Return Calculations | Prices, Dates | Various Return Types |
| [`calculateRiskMetrics`](src/portfolio/calculateRiskMetrics.ts) | Portfolio Risk Analysis | Returns, Risk-Free Rate | Risk Metrics, VaR, ES |
| [`calculateInformationRatio`](src/portfolio/calculateInformationRatio.ts) | Active Return Analysis | Portfolio Returns, Benchmark Returns | Information Ratio, Active Return |
| [`calculateTrackingError`](src/portfolio/calculateTrackingError.ts) | Benchmark Deviation | Portfolio Returns, Benchmark Returns | Tracking Error, Active Risk |

### Risk Metrics

| Function | Description | Methods |
|----------|-------------|---------|
| [`calculateVaR`](src/risk/calculateVaR.ts) | Value at Risk | Historical, Parametric, Monte Carlo |
| [`calculateVaR95`](src/risk/calculateVaR95.ts) | VaR 95% Confidence | Historical, Parametric, Monte Carlo |
| [`calculateVaR99`](src/risk/calculateVaR99.ts) | VaR 99% Confidence | Historical, Parametric, Monte Carlo |
| [`calculateHistoricalVaR`](src/risk/calculateHistoricalVaR.ts) | Historical VaR | Historical Method |
| [`calculateParametricVaR`](src/risk/calculateParametricVaR.ts) | Parametric VaR | Normal Distribution |
| [`calculateMonteCarloVaR`](src/risk/calculateMonteCarloVaR.ts) | Monte Carlo VaR | Simulation Method |
| [`calculateHistoricalExpectedShortfall`](src/risk/calculateHistoricalExpectedShortfall.ts) | Historical ES | Historical Method |
| [`calculateParametricExpectedShortfall`](src/risk/calculateParametricExpectedShortfall.ts) | Parametric ES | Normal Distribution |
| [`calculateSharpeRatio`](src/risk/calculateSharpeRatio.ts) | Risk-Adjusted Returns | Standard, Annualized |
| [`calculateSortinoRatio`](src/risk/calculateSortinoRatio.ts) | Downside Risk-Adjusted | Standard, Annualized |
| [`calculateSemideviation`](src/risk/calculateSemideviation.ts) | Downside Volatility | Zero/Mean Threshold |
| [`calculateCalmarRatio`](src/risk/calculateCalmarRatio.ts) | Return vs. Drawdown | Calmar Ratio |
| [`calculateSkewness`](src/risk/calculateSkewness.ts) | Distribution Asymmetry | Third Moment |
| [`calculateKurtosis`](src/risk/calculateKurtosis.ts) | Distribution Tailedness | Fourth Moment (Excess) |
| [`calculateAlpha`](src/risk/calculateAlpha.ts) | CAPM Alpha | Asset vs. Benchmark |
| [`calculateBeta`](src/risk/calculateBeta.ts) | CAPM Beta | Asset vs. Benchmark |
| [`calculateMaxDrawdown`](src/risk/calculateMaxDrawdown.ts) | Maximum Loss | Peak-to-Trough Analysis |
| [`calculateStandardDeviation`](src/risk/calculateStandardDeviation.ts) | Standard Deviation | Classical Measure |

### Volatility

| Function | Description | Input |
|----------|-------------|-------|
| [`calculateVolatility`](src/risk/calculateVolatility.ts) | Standard Deviation | Returns Array |
| [`calculateEWMAVolatility`](src/risk/calculateEWMAVolatility.ts) | Exponentially Weighted | Returns, Lambda |
| [`calculateParkinsonVolatility`](src/risk/calculateParkinsonVolatility.ts) | High-Low Range | High, Low Prices |
| [`calculateGarmanKlassVolatility`](src/risk/calculateGarmanKlassVolatility.ts) | OHLC-based | Open, High, Low, Close |
| [`calculateStandardDeviation`](src/risk/calculateStandardDeviation.ts) | Classical Measure | Returns Array |

### Portfolio Analysis

| Function | Description | Input |
|----------|-------------|-------|
| [`calculateCorrelationMatrix`](src/risk/calculateCorrelationMatrix.ts) | Asset Correlations | Asset Returns Matrix |
| [`calculateCovarianceMatrix`](src/risk/calculateCovarianceMatrix.ts) | Asset Covariances | Asset Returns Matrix |
| [`calculatePortfolioVolatility`](src/risk/calculatePortfolioVolatility.ts) | Portfolio Risk | Weights, Covariance Matrix |

### Technical Indicators

| Function | Description | Input | Output |
|----------|-------------|-------|--------|
| [`calculateSMA`](src/indicators/trend/calculateSMA.ts) | Simple Moving Average | Prices Array, Period | SMA Values, Indices |
| [`calculateEMA`](src/indicators/trend/calculateEMA.ts) | Exponential Moving Average | Prices Array, Period | EMA Values, Smoothing Factor |
| [`calculateMACD`](src/indicators/trend/calculateMACD.ts) | Moving Average Convergence Divergence | Prices Array, Fast/Slow/Signal Periods | MACD Line, Signal Line, Histogram |
| [`calculateRSI`](src/indicators/momentum/calculateRSI.ts) | Relative Strength Index | Prices Array, Period | RSI Values (0-100), Gains/Losses |
| [`calculateStochastic`](src/indicators/momentum/calculateStochastic.ts) | Stochastic Oscillator | High/Low/Close Arrays, K/D Periods | %K, %D, Highest High, Lowest Low |
| [`calculateWilliamsR`](src/indicators/momentum/calculateWilliamsR.ts) | Williams %R | High/Low/Close Arrays, Period | Williams %R Values (-100 to 0) |
| [`calculateBollingerBands`](src/indicators/volatility/calculateBollingerBands.ts) | Bollinger Bands | Prices Array, Period, StdDev Multiplier | Upper/Middle/Lower Bands, %B |
| [`calculateATR`](src/indicators/volatility/calculateATR.ts) | Average True Range | High/Low/Close Arrays, Period | ATR Values, True Range |

### Machine Learning - Regime Detection

| Function | Description | Input | Output |
|----------|-------------|-------|--------|
| [`detectRegime`](src/ml/hmm/detectRegime.ts) | HMM-based Market Regime Detection | Prices Array, Options | Current Regime, Regime Sequence, Probabilities, Model |
| [`trainHMM`](src/ml/hmm/core/trainHMM.ts) | Train Hidden Markov Model | Feature Matrix, Options | Trained HMM Model |
| [`extractFeatures`](src/ml/hmm/core/extractFeatures.ts) | Extract Features from Prices | Prices Array, Feature Config | Standardized Feature Matrix |

**Advanced HMM Algorithms**: [`forward`](src/ml/hmm/algorithms/forward.ts), [`backward`](src/ml/hmm/algorithms/backward.ts), [`viterbi`](src/ml/hmm/algorithms/viterbi.ts), [`baumWelch`](src/ml/hmm/algorithms/baumWelch.ts)

📖 **[Full Regime Detection Documentation](docs/REGIME_DETECTION.md)**

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run integration tests in watch mode
npm run test:integration:watch

# Run performance benchmarks
npm run test:performance

# Run performance benchmarks in watch mode
npm run test:performance:watch
```

**Test Coverage**: 1200+ Tests across 59 test files

### Battle Testing

This library uses a comprehensive battle testing approach to ensure accuracy by comparing TypeScript implementations against Python equivalents using battle-tested libraries (numpy, scipy, pandas).

### Performance Testing

Comprehensive performance benchmarks test functions across different dataset sizes to ensure optimal performance and detect regressions. Performance tests measure execution time, memory usage, and throughput for various dataset sizes to identify bottlenecks and ensure scalability. See [testing/README.md](testing/README.md) for details on the performance testing framework.

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
 
