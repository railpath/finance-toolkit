# Documentation

Comprehensive technical documentation for @railpath/finance-toolkit.

## Contents

### Implementation Details

- **[Portfolio Optimization](PORTFOLIO_OPTIMIZATION.md)** - Mean-Variance optimization, constraints, solver details
- **[VaR Methods](VAR_METHODS.md)** - Historical, Parametric, and Monte Carlo VaR specifications
- **[Technical Indicators](TECHNICAL_INDICATORS.md)** - Calculation methods and implementation details

## Quick Links

### Portfolio Optimization

**Topics covered:**
- Optimization method (Mean-Variance)
- Quadratic programming solver (Active Set Method)
- Supported constraints (long-only, weight bounds, target return)
- Risk-free rate treatment
- Mathematical formulation

[→ Read full documentation](PORTFOLIO_OPTIMIZATION.md)

---

### VaR Methods

**Topics covered:**
- Historical VaR (empirical distribution)
- Parametric VaR (normal distribution assumption)
- Monte Carlo VaR (simulation parameters)
- Time horizon handling
- Expected Shortfall (CVaR)
- Method selection guidelines

[→ Read full documentation](VAR_METHODS.md)

---

### Technical Indicators

**Topics covered:**
- **Trend**: SMA, EMA, MACD calculation methods
- **Momentum**: RSI (Wilder's smoothing), Stochastic (Full vs Fast vs Slow), Williams %R
- **Volatility**: Bollinger Bands, ATR (True Range calculation)
- Array indexing and alignment
- Default periods and standards

[→ Read full documentation](TECHNICAL_INDICATORS.md)

---

## Contributing

Found an error or unclear explanation? Please open an issue or PR on GitHub.

## Related Resources

- [Main README](../README.md) - Quick start and API overview
- [Testing Documentation](../testing/README.md) - Testing framework and battle-testing

