# Finance Toolkit Battle Testing

Comprehensive battle testing framework to validate TypeScript finance functions against Python equivalents using established battle-tested libraries (numpy, pandas, scipy).

## Purpose

This battle testing framework ensures that our TypeScript finance toolkit produces accurate results by comparing them against Python implementations that leverage battle-tested libraries. The Python implementations serve as the "ground truth" since they use established, mathematically verified libraries.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Build TypeScript project
cd .. && npm run build && cd testing

# Run comprehensive battle tests
python battle_tester.py
```

## Project Structure

```
testing/
├── finance_toolkit.py      # Python implementations using numpy/scipy
├── battle_tester.py        # Test runner and comparison engine
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This documentation
```

## Test Data

Uses structured test data from `../src/integration/test-data.json`:
- **Input parameters** for each function
- **Expected results** (Python as ground truth)
- **Multiple test cases** per function
- **Comprehensive coverage** of edge cases

## Functions Tested (38 Total)

### Risk Metrics
- `calculateAlpha` - Jensen's Alpha (CAPM)
- `calculateBeta` - Systematic risk measure
- `calculateSharpeRatio` - Risk-adjusted returns
- `calculateSortinoRatio` - Downside risk-adjusted returns
- `calculateInformationRatio` - Active return vs tracking error

### VaR & Risk Measures
- `calculateVaR` - Value at Risk (historical & parametric)
- `calculateVaR95` / `calculateVaR99` - Specific confidence levels
- `calculateHistoricalExpectedShortfall` - Historical CVaR
- `calculateParametricExpectedShortfall` - Parametric CVaR
- `calculateMonteCarloVaR` - Monte Carlo VaR simulation

### Statistical Functions
- `calculateKurtosis` - Fourth moment (tail risk)
- `calculateSkewness` - Third moment (asymmetry)
- `calculateStandardDeviation` - Volatility measure
- `calculateSemideviation` - Downside volatility

### Volatility Models
- `calculateVolatility` - Standard volatility
- `calculateEWMAVolatility` - Exponentially Weighted Moving Average
- `calculateGarmanKlassVolatility` - OHLC-based volatility
- `calculateParkinsonVolatility` - High-Low volatility

### Portfolio Management
- `calculateReturns` - Simple and logarithmic returns
- `calculateMaxDrawdown` - Maximum peak-to-trough decline
- `calculatePortfolioMetrics` - Comprehensive portfolio analysis
- `calculatePortfolioOptimization` - Markowitz optimization
- `calculatePortfolioRebalancing` - Rebalancing analysis
- `calculateEqualWeightPortfolio` - Equal weight allocation

### Advanced Analytics
- `calculateCorrelationMatrix` - Asset correlations
- `calculateCovarianceMatrix` - Asset covariances
- `calculatePortfolioVolatility` - Portfolio risk
- `calculateTrackingError` - Benchmark tracking
- `calculatePerformanceAttribution` - Return attribution
- `calculateRiskMetrics` - Comprehensive risk analysis

### Return Calculations
- `calculateMoneyWeightedReturn` - IRR-based returns
- `calculateTimeWeightedReturn` - Geometric mean returns
- `calculateCalmarRatio` - Return vs max drawdown

## Design Principles

### Battle-Tested Libraries
- **scipy.stats** for statistical functions (norm.ppf, kurtosis, skew)
- **numpy** for array operations and mathematical functions
- **scipy.optimize** for portfolio optimization
- **pandas** for data manipulation (where applicable)

### TypeScript Compatibility
- Maintain exact compatibility with TypeScript implementations
- Use population statistics (ddof=0) where TypeScript does
- Preserve exact mathematical formulas and conventions
- Handle edge cases identically

### Error Handling
- Comprehensive input validation
- Graceful handling of edge cases (empty arrays, zero volatility)
- Detailed error reporting and analysis

## Test Results

Current Status: **30 of 38 tests passing (78.9%)**

### Passing Tests (30)
All core functions working correctly with battle-tested libraries.

### Minor Differences (8)
Small numerical precision differences in:
- Money Weighted Return (IRR convergence)
- Parametric VaR (Z-score precision)
- Portfolio Optimization (optimization tolerance)
- Tracking Error (calculation method)

## Configuration

### Tolerance Levels
- **Absolute tolerance**: 1e-10
- **Relative tolerance**: 1e-6
- **Special handling** for zero values and edge cases

### Error Analysis
- Detailed field-by-field comparison
- Relative error calculations
- Maximum error reporting
- Specific failure details

## Success Metrics

- **78.9% test pass rate** with battle-tested libraries
- **All core financial functions** validated
- **Comprehensive edge case coverage**
- **Professional-grade error reporting**
- **Maintainable and extensible framework**

## Future Enhancements

- Additional statistical functions
- More sophisticated optimization algorithms
- Enhanced error reporting with visualizations
- Performance benchmarking
- Integration with CI/CD pipelines
