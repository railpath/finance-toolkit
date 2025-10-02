# Portfolio Performance Metrics

Detailed documentation of portfolio performance metrics in finlib-ts.

---

## Time-Weighted Return (TWR)

### What is TWR?

**Time-Weighted Return** measures portfolio performance independent of cash flows. It is the standard for evaluating portfolio managers, as it isolates pure investment performance.

### Mathematical Formula

```
TWR = ∏(1 + r_i) - 1

Where:
r_i = (V_i - V_{i-1} - CF_i) / (V_{i-1} + CF_i)
```

- `V_i` = Portfolio value at end of period i
- `CF_i` = Cash flow in period i (positive = deposit, negative = withdrawal)
- `r_i` = Return of period i

### Use Cases

1. **Portfolio Manager Performance**: Evaluation of pure investment skills
2. **Benchmark Comparison**: Comparison with market indices
3. **Fund Performance**: Mutual fund and ETF performance
4. **Institutional Reporting**: GIPS-compliant performance reports

### Code Example

```typescript
import { calculateTimeWeightedReturn } from 'finlib-ts';

// Portfolio with cash flows
const portfolioValues = [1000, 1100, 1200, 1150]; // Portfolio values
const cashFlows = [0, 100, 0, -50]; // Cash flows (deposit/withdrawal)

const twr = calculateTimeWeightedReturn({
  portfolioValues,
  cashFlows,
  annualizationFactor: 252 // Trading Days
});

console.log('TWR:', twr.twr); // 0.15 (15%)
console.log('Annualized TWR:', twr.annualizedTWR); // 0.15
console.log('Period Returns:', twr.periodReturns); // [0.1, 0.05, -0.04]
```

### Interpretation

- **TWR > 0**: Positive performance
- **TWR = 0**: Break-even
- **TWR < 0**: Negative performance

**Important**: TWR ignores the size and timing of cash flows, making it ideal for manager performance.

---

## Money-Weighted Return (MWR)

### What is MWR?

**Money-Weighted Return** is equivalent to **Internal Rate of Return (IRR)** and considers the size and timing of cash flows. It measures the actual performance from the investor's perspective.

### Mathematical Formula

```
NPV = 0 = CF_0 + CF_1/(1+r) + CF_2/(1+r)² + ... + CF_n/(1+r)^n

Where:
CF_i = Cash flow at time i
r = Money-Weighted Return (IRR)
```

### Newton-Raphson Method

The IRR is calculated using the Newton-Raphson method:

```typescript
function calculateIRR(cashFlows: number[], timePeriods: number[], maxIterations: number, tolerance: number): number {
  let rate = 0.1; // Initial guess

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(cashFlows, timePeriods, rate);
    const npvDerivative = calculateNPVDerivative(cashFlows, timePeriods, rate);

    if (Math.abs(npv) < tolerance) {
      return rate;
    }

    if (Math.abs(npvDerivative) < tolerance) {
      throw new Error('IRR calculation failed: derivative too small');
    }

    const newRate = rate - npv / npvDerivative;
    rate = Math.max(newRate, -0.99); // Prevent negative rates
  }

  throw new Error(`IRR calculation did not converge after ${maxIterations} iterations`);
}
```

### Use Cases

1. **Client Performance**: Actual performance for the investor
2. **Private Equity**: IRR-based performance measurement
3. **Real Estate**: Property investment performance
4. **Personal Finance**: Individual portfolio performance

### Code Example

```typescript
import { calculateMoneyWeightedReturn } from 'finlib-ts';

// Investment with cash flows
const cashFlows = [1000, 100, -50]; // Initial investment, additional investment, withdrawal
const dates = [
  new Date('2023-01-01'),
  new Date('2023-06-01'),
  new Date('2023-12-01')
];

const mwr = calculateMoneyWeightedReturn({
  cashFlows,
  dates,
  finalValue: 1150, // Final portfolio value
  initialValue: 0,
  maxIterations: 100,
  tolerance: 1e-6
});

console.log('MWR (IRR):', mwr.mwr); // 0.12 (12%)
console.log('Annualized MWR:', mwr.annualizedMWR); // 0.12
console.log('NPV:', mwr.npv); // ~0 (should be close to zero)
console.log('Iterations:', mwr.iterations); // Number of Newton-Raphson iterations
```

### Interpretation

- **MWR > TWR**: Cash flows were beneficial (e.g., deposits at low prices)
- **MWR < TWR**: Cash flows were detrimental (e.g., deposits at high prices)
- **MWR = TWR**: No cash flows or neutral timing

---

## TWR vs. MWR Comparison

### When to use TWR?

- **Portfolio Manager Performance**: Pure investment skills
- **Fund Performance**: Mutual fund and ETF performance
- **Benchmark Comparison**: Comparison with market indices
- **GIPS Reporting**: Institutional performance standards

### When to use MWR?

- **Client Performance**: Actual investor performance
- **Private Equity**: IRR-based measurement
- **Personal Finance**: Individual portfolio performance
- **Cash Flow Impact**: Analysis of cash flow effects

### Practical Example

```typescript
// Scenario: Investor buys at high prices
const portfolioValues = [1000, 1200, 1000, 1100];
const cashFlows = [0, 500, 0, 0]; // Deposit at high price

const twr = calculateTimeWeightedReturn({
  portfolioValues,
  cashFlows,
  annualizationFactor: 252
});

const mwr = calculateMoneyWeightedReturn({
  cashFlows: [1000, 500],
  dates: [new Date('2023-01-01'), new Date('2023-06-01')],
  finalValue: 1100,
  initialValue: 0
});

console.log('TWR:', twr.annualizedTWR); // 0.10 (10%) - Manager Performance
console.log('MWR:', mwr.annualizedMWR); // 0.05 (5%) - Client Performance

// MWR < TWR shows that cash flows were detrimental
```

---

## Performance Attribution

### Cash Flow Impact Analysis

```typescript
class PerformanceAttribution {
  analyzeCashFlowImpact(portfolioValues: number[], cashFlows: number[], dates: Date[]) {
    // TWR (Manager Performance)
    const twr = calculateTimeWeightedReturn({
      portfolioValues,
      cashFlows,
      annualizationFactor: 252
    });

    // MWR (Client Performance)
    const mwr = calculateMoneyWeightedReturn({
      cashFlows,
      dates,
      finalValue: portfolioValues[portfolioValues.length - 1],
      initialValue: 0
    });

    // Cash Flow Impact
    const cashFlowImpact = mwr.annualizedMWR - twr.annualizedTWR;

    return {
      managerPerformance: {
        twr: twr.annualizedTWR,
        description: 'Pure investment performance'
      },
      clientPerformance: {
        mwr: mwr.annualizedMWR,
        description: 'Actual client experience'
      },
      cashFlowImpact: {
        impact: cashFlowImpact,
        description: cashFlowImpact > 0 ? 'Positive cash flow timing' : 'Negative cash flow timing'
      }
    };
  }
}
```

---

## Best Practices

### 1. **Data Quality**

```typescript
// Input data validation
const validatePortfolioData = (values: number[], cashFlows: number[]): boolean => {
  // Same length
  if (values.length !== cashFlows.length) {
    throw new Error('Portfolio values and cash flows must have same length');
  }
  
  // Positive values
  if (values.some(v => v <= 0)) {
    throw new Error('Portfolio values must be positive');
  }
  
  // Final value after cash flows
  const finalValue = values[values.length - 1];
  const totalCashFlows = cashFlows.reduce((sum, cf) => sum + cf, 0);
  
  if (finalValue <= totalCashFlows) {
    throw new Error('Final portfolio value must exceed total cash flows');
  }
  
  return true;
};
```

### 2. **Performance Monitoring**

```typescript
class PerformanceMonitor {
  private portfolioData: any[] = [];
  
  updatePerformance(newValue: number, cashFlow: number, date: Date) {
    this.portfolioData.push({ value: newValue, cashFlow, date });
    
    // Real-time TWR
    const twr = this.calculateRealTimeTWR();
    
    // Performance Alerts
    if (twr.annualizedTWR < -0.1) {
      this.alertNegativePerformance();
    }
    
    return twr;
  }
  
  private calculateRealTimeTWR() {
    const values = this.portfolioData.map(d => d.value);
    const cashFlows = this.portfolioData.map(d => d.cashFlow);
    
    return calculateTimeWeightedReturn({
      portfolioValues: values,
      cashFlows,
      annualizationFactor: 252
    });
  }
}
```

### 3. **Reporting Integration**

```typescript
class PerformanceReporter {
  generateMonthlyReport(portfolioData: any) {
    const twr = calculateTimeWeightedReturn({
      portfolioValues: portfolioData.values,
      cashFlows: portfolioData.cashFlows,
      annualizationFactor: 252
    });
    
    const mwr = calculateMoneyWeightedReturn({
      cashFlows: portfolioData.cashFlows,
      dates: portfolioData.dates,
      finalValue: portfolioData.values[portfolioData.values.length - 1],
      initialValue: 0
    });
    
    return {
      period: this.getReportingPeriod(portfolioData.dates),
      performance: {
        twr: {
          value: twr.annualizedTWR,
          label: 'Time-Weighted Return',
          benchmark: 'Manager Performance'
        },
        mwr: {
          value: mwr.annualizedMWR,
          label: 'Money-Weighted Return',
          benchmark: 'Client Performance'
        }
      },
      analysis: this.generatePerformanceAnalysis(twr, mwr)
    };
  }
}
```

---

## Common Pitfalls

### 1. **Cash Flow Timing**

```typescript
// WRONG: Cash flow at end of period
const values = [1000, 1100]; // Value at end
const cashFlows = [0, 100]; // Cash flow at end

// CORRECT: Cash flow at beginning of period
const values = [1000, 1200]; // Value after cash flow
const cashFlows = [0, 100]; // Cash flow at beginning
```

### 2. **Timestamp Consistency**

```typescript
// All dates must have the same timestamp
const dates = [
  new Date('2023-01-01'), // Beginning
  new Date('2023-06-01'), // Middle
  new Date('2023-12-01')  // End
];
```

### 3. **Annualization**

```typescript
// Correct annualization
const annualizationFactor = 252; // Trading days
// OR
const annualizationFactor = 365; // Calendar days
```

---

## Advanced Use Cases

### 1. **Multi-Period Analysis**

```typescript
class MultiPeriodAnalyzer {
  analyzePeriods(portfolioData: any[]) {
    const results = [];
    
    for (let i = 0; i < portfolioData.length; i++) {
      const period = portfolioData[i];
      
      const twr = calculateTimeWeightedReturn({
        portfolioValues: period.values,
        cashFlows: period.cashFlows,
        annualizationFactor: 252
      });
      
      results.push({
        period: period.name,
        twr: twr.annualizedTWR,
        performance: this.categorizePerformance(twr.annualizedTWR)
      });
    }
    
    return results;
  }
}
```

### 2. **Benchmark Comparison**

```typescript
class BenchmarkAnalyzer {
  compareWithBenchmark(portfolioTWR: number, benchmarkReturn: number) {
    const excessReturn = portfolioTWR - benchmarkReturn;
    
    return {
      portfolioTWR,
      benchmarkReturn,
      excessReturn,
      outperformance: excessReturn > 0 ? 'Outperforming' : 'Underperforming',
      magnitude: Math.abs(excessReturn)
    };
  }
}
```
