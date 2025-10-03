# Risk Metrics & VaR Calculations

Comprehensive documentation of risk metrics and Value at Risk (VaR) calculations in @railpath/finance-toolkit.

---

## Value at Risk (VaR)

### What is VaR?

**Value at Risk (VaR)** is a statistical measure of the maximum loss risk of a portfolio over a given time period with a given confidence level.

### Mathematical Definition

```
VaR_α = -F⁻¹(α) × σ × √t

Where:
α = Confidence level (e.g. 0.95 for 95%)
F⁻¹ = Inverse distribution function
σ = Volatility
t = Time period
```

### VaR Methods

#### 1. **Historical VaR**

Based on historical returns and uses empirical quantiles.

```typescript
import { calculateHistoricalVaR } from '@railpath/finance-toolkit';

const historicalVaR = calculateHistoricalVaR({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01],
  confidenceLevel: 0.95,
  annualizationFactor: 252
});

console.log('Historical VaR (95%):', historicalVaR.var); // -0.05 (5% loss)
```

**Advantages**:
- No distribution assumptions
- Considers fat tails
- Easy to understand

**Disadvantages**:
- Dependent on historical data
- Can be misleading during structural changes

#### 2. **Parametric VaR**

Based on normal distribution assumption.

```typescript
import { calculateParametricVaR } from '@railpath/finance-toolkit';

const parametricVaR = calculateParametricVaR({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  confidenceLevel: 0.95,
  annualizationFactor: 252
});

console.log('Parametric VaR (95%):', parametricVaR.var);
```

**Formula**:
```
VaR = -μ - z_α × σ

Where:
μ = Expected value of returns
z_α = Z-Score for confidence level α
σ = Standard deviation of returns
```

**Advantages**:
- Fast to calculate
- Analytically solvable
- Good for large portfolios

**Disadvantages**:
- Normal distribution assumption
- Underestimates extreme events

#### 3. **Monte Carlo VaR**

Simulates future scenarios based on historical parameters.

```typescript
import { calculateMonteCarloVaR } from '@railpath/finance-toolkit';

const monteCarloVaR = calculateMonteCarloVaR({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  confidenceLevel: 0.95,
  simulations: 10000,
  annualizationFactor: 252
});

console.log('Monte Carlo VaR (95%):', monteCarloVaR.var);
```

**Advantages**:
- Flexible for complex distributions
- Considers correlations
- Can include stress scenarios

**Disadvantages**:
- Computationally intensive
- Dependent on model assumptions

---

## Expected Shortfall (CVaR)

### What is Expected Shortfall?

**Expected Shortfall (ES)** or **Conditional Value at Risk (CVaR)** is the expected loss when VaR is exceeded.

### Mathematical Definition

```
ES_α = E[R | R ≤ -VaR_α]

Where:
R = Portfolio return
α = Confidence level
```

### Code Example

```typescript
import { calculateExpectedShortfall } from '@railpath/finance-toolkit';

const expectedShortfall = calculateExpectedShortfall({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01],
  confidenceLevel: 0.95,
  method: 'historical',
  annualizationFactor: 252
});

console.log('Expected Shortfall (95%):', expectedShortfall.expectedShortfall);
```

### Interpretation

- **ES > VaR**: Expected loss is higher than VaR
- **ES = VaR**: Symmetric distribution
- **ES < VaR**: Rare, in very skewed distributions

---

## Risk-Adjusted Returns

### Sharpe Ratio

Measures the excess return per unit of risk.

```typescript
import { calculateSharpeRatio } from '@railpath/finance-toolkit';

const sharpe = calculateSharpeRatio({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  riskFreeRate: 0.02,
  annualizationFactor: 252
});

console.log('Sharpe Ratio:', sharpe.annualizedSharpeRatio);
```

**Formula**:
```
Sharpe = (R_p - R_f) / σ_p

Where:
R_p = Portfolio return
R_f = Risk-free rate
σ_p = Portfolio volatility
```

**Interpretation**:
- **Sharpe > 1**: Excellent risk-adjusted returns
- **Sharpe > 0.5**: Good risk-adjusted returns
- **Sharpe < 0**: Negative risk-adjusted returns

### Sortino Ratio

Ähnlich wie Sharpe Ratio, aber nur für downside risk.

```typescript
import { calculateSortinoRatio } from '@railpath/finance-toolkit';

const sortino = calculateSortinoRatio({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  riskFreeRate: 0.02,
  annualizationFactor: 252
});

console.log('Sortino Ratio:', sortino.annualizedSortinoRatio);
```

**Formula**:
```
Sortino = (R_p - R_f) / σ_down

Where:
σ_down = Downside deviation
```

---

## Maximum Drawdown

### What is Maximum Drawdown?

**Maximum Drawdown** is the largest loss from a peak to a trough.

### Code Example

```typescript
import { calculateMaxDrawdown } from '@railpath/finance-toolkit';

const maxDD = calculateMaxDrawdown({
  portfolioValues: [1000, 1100, 1050, 1200, 1150, 1000, 1100]
});

console.log('Max Drawdown:', maxDD.maxDrawdown); // -200
console.log('Max Drawdown %:', maxDD.maxDrawdownPercent); // -0.1667 (16.67%)
```

### Calmar Ratio

Return vs. Maximum Drawdown.

```typescript
import { calculateCalmarRatio } from '@railpath/finance-toolkit';

const calmar = calculateCalmarRatio({
  returns: [0.01, 0.02, -0.01, 0.03, -0.02],
  portfolioValues: [1000, 1100, 1050, 1200, 1150],
  annualizationFactor: 252
});

console.log('Calmar Ratio:', calmar.calmarRatio);
```

---

## Portfolio Risk Analysis

### Correlation Matrix

```typescript
import { calculateCorrelationMatrix } from '@railpath/finance-toolkit';

const correlation = calculateCorrelationMatrix({
  assetReturns: [
    [0.01, 0.02, -0.01], // Asset 1
    [0.015, 0.025, -0.005], // Asset 2
    [0.005, 0.01, 0.02] // Asset 3
  ],
  annualizationFactor: 252
});

console.log('Correlation Matrix:', correlation.correlationMatrix);
```

### Portfolio Volatility

```typescript
import { calculatePortfolioVolatility } from '@railpath/finance-toolkit';

const portfolioVol = calculatePortfolioVolatility({
  weights: [0.4, 0.3, 0.3], // Asset weights
  covarianceMatrix: [
    [0.04, 0.02, 0.01], // Covariance matrix
    [0.02, 0.09, 0.03],
    [0.01, 0.03, 0.16]
  ],
  annualizationFactor: 252
});

console.log('Portfolio Volatility:', portfolioVol.annualizedVolatility);
```

---

## Risk Management Dashboard

### Comprehensive Risk Analysis

```typescript
class RiskDashboard {
  analyzePortfolioRisk(returns: number[], portfolioValues: number[], benchmarkReturns: number[]) {
    // VaR Analysis
    const var95 = calculateVaR({
      returns,
      confidenceLevel: 0.95,
      method: 'historical',
      annualizationFactor: 252
    });

    const var99 = calculateVaR({
      returns,
      confidenceLevel: 0.99,
      method: 'historical',
      annualizationFactor: 252
    });

    // Expected Shortfall
    const es95 = calculateExpectedShortfall({
      returns,
      confidenceLevel: 0.95,
      method: 'historical',
      annualizationFactor: 252
    });

    // Risk-Adjusted Returns
    const sharpe = calculateSharpeRatio({
      returns,
      riskFreeRate: 0.02,
      annualizationFactor: 252
    });

    const sortino = calculateSortinoRatio({
      returns,
      riskFreeRate: 0.02,
      annualizationFactor: 252
    });

    // Drawdown Analysis
    const maxDD = calculateMaxDrawdown({
      portfolioValues
    });

    const calmar = calculateCalmarRatio({
      returns,
      portfolioValues,
      annualizationFactor: 252
    });

    // Alpha & Beta
    const alpha = calculateAlpha({
      assetReturns: returns,
      benchmarkReturns,
      riskFreeRate: 0.02,
      annualizationFactor: 252
    });

    const beta = calculateBeta({
      assetReturns: returns,
      benchmarkReturns,
      annualizationFactor: 252
    });

    return {
      var: {
        var95: var95.var,
        var99: var99.var,
        expectedShortfall: es95.expectedShortfall
      },
      riskAdjusted: {
        sharpe: sharpe.annualizedSharpeRatio,
        sortino: sortino.annualizedSortinoRatio,
        calmar: calmar.calmarRatio
      },
      drawdown: {
        maxDrawdown: maxDD.maxDrawdownPercent,
        startDate: maxDD.startDate,
        endDate: maxDD.endDate
      },
      benchmark: {
        alpha: alpha.alpha,
        beta: beta.beta
      },
      riskLevel: this.calculateRiskLevel(var95.var, sharpe.annualizedSharpeRatio)
    };
  }

  private calculateRiskLevel(var95: number, sharpe: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (Math.abs(var95) < 0.02 && sharpe > 1.0) return 'LOW';
    if (Math.abs(var95) < 0.05 && sharpe > 0.5) return 'MEDIUM';
    return 'HIGH';
  }
}
```

---

## Risk Alerts & Monitoring

### Real-time Risk Monitoring

```typescript
class RiskMonitor {
  private portfolioData: any[] = [];
  private riskThresholds = {
    var95: 0.05, // 5% daily VaR limit
    maxDrawdown: 0.15, // 15% max drawdown limit
    sharpe: 0.5 // Minimum Sharpe ratio
  };

  updateRiskMetrics(newValue: number, date: Date) {
    this.portfolioData.push({ value: newValue, date });
    
    if (this.portfolioData.length < 30) return; // Need minimum data
    
    const returns = this.calculateReturns();
    
    // Check VaR
    const var95 = calculateVaR({
      returns,
      confidenceLevel: 0.95,
      method: 'historical',
      annualizationFactor: 252
    });

    // Check Drawdown
    const maxDD = calculateMaxDrawdown({
      portfolioValues: this.portfolioData.map(d => d.value)
    });

    // Check Sharpe Ratio
    const sharpe = calculateSharpeRatio({
      returns,
      riskFreeRate: 0.02,
      annualizationFactor: 252
    });

    // Risk Alerts
    this.checkRiskAlerts(var95, maxDD, sharpe);
  }

  private checkRiskAlerts(var95: any, maxDD: any, sharpe: any) {
    if (Math.abs(var95.var) > this.riskThresholds.var95) {
      this.alert('HIGH_VAR', `VaR exceeds threshold: ${Math.abs(var95.var)}`);
    }

    if (maxDD.maxDrawdownPercent < -this.riskThresholds.maxDrawdown) {
      this.alert('HIGH_DRAWDOWN', `Max drawdown exceeds threshold: ${maxDD.maxDrawdownPercent}`);
    }

    if (sharpe.annualizedSharpeRatio < this.riskThresholds.sharpe) {
      this.alert('LOW_SHARPE', `Sharpe ratio below threshold: ${sharpe.annualizedSharpeRatio}`);
    }
  }

  private alert(type: string, message: string) {
    console.warn(`RISK ALERT [${type}]: ${message}`);
    // Implement alert system (email, SMS, dashboard notification)
  }
}
```

---

## Stress Testing

### Scenario Analysis

```typescript
class StressTester {
  stressTestPortfolio(returns: number[], scenarios: any[]) {
    const results = [];

    for (const scenario of scenarios) {
      // Apply stress scenario
      const stressedReturns = this.applyStressScenario(returns, scenario);
      
      // Calculate stressed VaR
      const stressedVaR = calculateVaR({
        returns: stressedReturns,
        confidenceLevel: 0.95,
        method: 'historical',
        annualizationFactor: 252
      });

      results.push({
        scenario: scenario.name,
        var: stressedVaR.var,
        impact: stressedVaR.var - this.calculateBaseVaR(returns)
      });
    }

    return results;
  }

  private applyStressScenario(returns: number[], scenario: any): number[] {
    return returns.map(r => r * scenario.multiplier + scenario.shift);
  }

  private calculateBaseVaR(returns: number[]): number {
    const baseVaR = calculateVaR({
      returns,
      confidenceLevel: 0.95,
      method: 'historical',
      annualizationFactor: 252
    });
    return baseVaR.var;
  }
}
```

---

## Best Practices

### 1. **VaR Model Validation**

```typescript
class VaRValidator {
  validateVaRModel(returns: number[], model: string) {
    // Backtesting
    const backtestResults = this.backtestVaR(returns, model);
    
    // Kupiec Test
    const kupiecTest = this.kupiecTest(returns, backtestResults);
    
    // Christoffersen Test
    const christoffersenTest = this.christoffersenTest(returns, backtestResults);
    
    return {
      backtest: backtestResults,
      kupiec: kupiecTest,
      christoffersen: christoffersenTest,
      isValid: kupiecTest.pValue > 0.05 && christoffersenTest.pValue > 0.05
    };
  }
}
```

### 2. **Risk Limits Management**

```typescript
class RiskLimits {
  private limits = {
    dailyVaR: 0.05, // 5% daily VaR limit
    weeklyVaR: 0.10, // 10% weekly VaR limit
    maxDrawdown: 0.20, // 20% max drawdown limit
    concentration: 0.10 // 10% max single asset weight
  };

  checkLimits(portfolioData: any): boolean {
    const dailyVaR = this.calculateDailyVaR(portfolioData);
    const maxDD = this.calculateMaxDrawdown(portfolioData);
    const concentration = this.calculateConcentration(portfolioData);

    return (
      dailyVaR <= this.limits.dailyVaR &&
      maxDD <= this.limits.maxDrawdown &&
      concentration <= this.limits.concentration
    );
  }
}
```

### 3. **Risk Reporting**

```typescript
class RiskReporter {
  generateRiskReport(portfolioData: any) {
    const riskMetrics = this.calculateAllRiskMetrics(portfolioData);
    
    return {
      summary: {
        riskLevel: this.categorizeRisk(riskMetrics),
        keyMetrics: this.getKeyMetrics(riskMetrics)
      },
      details: {
        var: riskMetrics.var,
        expectedShortfall: riskMetrics.expectedShortfall,
        sharpe: riskMetrics.sharpe,
        maxDrawdown: riskMetrics.maxDrawdown
      },
      recommendations: this.generateRecommendations(riskMetrics)
    };
  }
}
```

---

## Common Pitfalls

### 1. **VaR Model Risk**

- **Problem**: Incorrect distribution assumptions
- **Solution**: Compare multiple models, backtesting

### 2. **Liquidity Risk**

- **Problem**: VaR ignores liquidity risk
- **Solution**: Liquidity-adjusted VaR

### 3. **Correlation Breakdown**

- **Problem**: Correlations change during crises
- **Solution**: Stress testing, regime-switching models

### 4. **Fat Tails**

- **Problem**: Normal distribution underestimates extremes
- **Solution**: Historical VaR, Extreme Value Theory
