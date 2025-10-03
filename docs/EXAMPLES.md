# Practical Examples

Real-world use cases and code examples for @railpath/finance-toolkit.

---

## Portfolio Manager Dashboard

### Performance Attribution Analysis

```typescript
import {
  calculateTimeWeightedReturn,
  calculateMoneyWeightedReturn,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateAlpha,
  calculateBeta
} from '@railpath/finance-toolkit';

// Portfolio Performance Dashboard
class PortfolioDashboard {
  private portfolioValues: number[] = [];
  private cashFlows: number[] = [];
  private dates: Date[] = [];
  private benchmarkReturns: number[] = [];
  private riskFreeRate = 0.02;

  // Portfolio Performance Metrics
  getPerformanceMetrics() {
    // Time-Weighted Return (Manager Performance)
    const twr = calculateTimeWeightedReturn({
      portfolioValues: this.portfolioValues,
      cashFlows: this.cashFlows,
      annualizationFactor: 252
    });

    // Money-Weighted Return (Client Performance)
    const mwr = calculateMoneyWeightedReturn({
      cashFlows: this.cashFlows,
      dates: this.dates,
      finalValue: this.portfolioValues[this.portfolioValues.length - 1],
      initialValue: 0
    });

    // Risk-Adjusted Returns
    const sharpe = calculateSharpeRatio({
      returns: this.calculateReturns(),
      riskFreeRate: this.riskFreeRate,
      annualizationFactor: 252
    });

    // Risk Metrics
    const maxDD = calculateMaxDrawdown({
      portfolioValues: this.portfolioValues
    });

    // Alpha & Beta vs. Benchmark
    const alpha = calculateAlpha({
      assetReturns: this.calculateReturns(),
      benchmarkReturns: this.benchmarkReturns,
      riskFreeRate: this.riskFreeRate,
      annualizationFactor: 252
    });

    const beta = calculateBeta({
      assetReturns: this.calculateReturns(),
      benchmarkReturns: this.benchmarkReturns,
      annualizationFactor: 252
    });

    return {
      performance: {
        twr: twr.annualizedTWR,
        mwr: mwr.annualizedMWR,
        sharpe: sharpe.annualizedSharpeRatio
      },
      risk: {
        maxDrawdown: maxDD.maxDrawdownPercent,
        alpha: alpha.alpha,
        beta: beta.beta
      }
    };
  }

  private calculateReturns(): number[] {
    const returns: number[] = [];
    for (let i = 1; i < this.portfolioValues.length; i++) {
      const return_ = (this.portfolioValues[i] - this.portfolioValues[i-1]) / this.portfolioValues[i-1];
      returns.push(return_);
    }
    return returns;
  }
}
```

---

## Risk Management System

### VaR Monitoring Dashboard

```typescript
import {
  calculateVaR,
  calculateExpectedShortfall,
  calculateHistoricalVaR,
  calculateParametricVaR,
  calculateMonteCarloVaR
} from '@railpath/finance-toolkit';

class RiskMonitoringSystem {
  private portfolioReturns: number[] = [];
  private confidenceLevels = [0.95, 0.99];

  // Comprehensive VaR Analysis
  getVaRAnalysis() {
    const results = {
      historical: {} as any,
      parametric: {} as any,
      monteCarlo: {} as any
    };

    // Historical VaR
    for (const confidence of this.confidenceLevels) {
      results.historical[confidence] = calculateHistoricalVaR({
        returns: this.portfolioReturns,
        confidenceLevel: confidence,
        annualizationFactor: 252
      });
    }

    // Parametric VaR (Normal Distribution)
    for (const confidence of this.confidenceLevels) {
      results.parametric[confidence] = calculateParametricVaR({
        returns: this.portfolioReturns,
        confidenceLevel: confidence,
        annualizationFactor: 252
      });
    }

    // Monte Carlo VaR
    for (const confidence of this.confidenceLevels) {
      results.monteCarlo[confidence] = calculateMonteCarloVaR({
        returns: this.portfolioReturns,
        confidenceLevel: confidence,
        simulations: 10000,
        annualizationFactor: 252
      });
    }

    return results;
  }

  // Expected Shortfall (Conditional VaR)
  getExpectedShortfall() {
    const es95 = calculateExpectedShortfall({
      returns: this.portfolioReturns,
      confidenceLevel: 0.95,
      method: 'historical',
      annualizationFactor: 252
    });

    const es99 = calculateExpectedShortfall({
      returns: this.portfolioReturns,
      confidenceLevel: 0.99,
      method: 'historical',
      annualizationFactor: 252
    });

    return {
      es95: es95.expectedShortfall,
      es99: es99.expectedShortfall
    };
  }

  // Risk Alerts
  checkRiskAlerts(currentValue: number) {
    const var95 = this.getVaRAnalysis().historical[0.95];
    const dailyVaR = currentValue * Math.abs(var95.var);
    
    return {
      dailyVaR95: dailyVaR,
      alert: dailyVaR > currentValue * 0.05 ? 'HIGH_RISK' : 'NORMAL'
    };
  }
}
```

---

## Multi-Asset Portfolio Analysis

### Asset Allocation & Correlation Analysis

```typescript
import {
  calculateCorrelationMatrix,
  calculateCovarianceMatrix,
  calculatePortfolioVolatility,
  calculateSharpeRatio,
  calculateSortinoRatio
} from '@railpath/finance-toolkit';

class MultiAssetPortfolio {
  private assetReturns: number[][] = [];
  private weights: number[] = [];
  private riskFreeRate = 0.02;

  // Portfolio Construction
  analyzePortfolio() {
    // Correlation Analysis
    const correlation = calculateCorrelationMatrix({
      assetReturns: this.assetReturns,
      annualizationFactor: 252
    });

    // Covariance Matrix
    const covariance = calculateCovarianceMatrix({
      assetReturns: this.assetReturns,
      annualizationFactor: 252
    });

    // Portfolio Volatility
    const portfolioVol = calculatePortfolioVolatility({
      weights: this.weights,
      covarianceMatrix: covariance.covarianceMatrix,
      annualizationFactor: 252
    });

    // Risk-Adjusted Returns
    const portfolioReturns = this.calculatePortfolioReturns();
    const sharpe = calculateSharpeRatio({
      returns: portfolioReturns,
      riskFreeRate: this.riskFreeRate,
      annualizationFactor: 252
    });

    const sortino = calculateSortinoRatio({
      returns: portfolioReturns,
      riskFreeRate: this.riskFreeRate,
      annualizationFactor: 252
    });

    return {
      correlation: correlation.correlationMatrix,
      volatility: portfolioVol.annualizedVolatility,
      sharpe: sharpe.annualizedSharpeRatio,
      sortino: sortino.annualizedSortinoRatio,
      diversification: this.calculateDiversificationRatio(correlation.correlationMatrix)
    };
  }

  // Diversification Ratio
  private calculateDiversificationRatio(correlationMatrix: number[][]): number {
    const avgCorrelation = this.calculateAverageCorrelation(correlationMatrix);
    return 1 / Math.sqrt(avgCorrelation);
  }

  private calculateAverageCorrelation(matrix: number[][]): number {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix[i].length; j++) {
        sum += Math.abs(matrix[i][j]);
        count++;
      }
    }
    return sum / count;
  }

  private calculatePortfolioReturns(): number[] {
    const portfolioReturns: number[] = [];
    const numPeriods = this.assetReturns[0].length;
    
    for (let t = 0; t < numPeriods; t++) {
      let portfolioReturn = 0;
      for (let i = 0; i < this.assetReturns.length; i++) {
        portfolioReturn += this.weights[i] * this.assetReturns[i][t];
      }
      portfolioReturns.push(portfolioReturn);
    }
    
    return portfolioReturns;
  }
}
```

---

## Volatility Analysis

### Advanced Volatility Models

```typescript
import {
  calculateVolatility,
  calculateEWMAVolatility,
  calculateParkinsonVolatility,
  calculateGarmanKlassVolatility
} from '@railpath/finance-toolkit';

class VolatilityAnalyzer {
  private returns: number[] = [];
  private ohlcData: { open: number[], high: number[], low: number[], close: number[] } = { open: [], high: [], low: [], close: [] };

  // Comprehensive Volatility Analysis
  analyzeVolatility() {
    // Standard Volatility
    const standard = calculateVolatility({
      returns: this.returns,
      annualizationFactor: 252
    });

    // EWMA Volatility (RiskMetrics)
    const ewma = calculateEWMAVolatility({
      returns: this.returns,
      lambda: 0.94, // RiskMetrics decay factor
      annualizationFactor: 252
    });

    // Parkinson Volatility (High-Low Range)
    const parkinson = calculateParkinsonVolatility({
      high: this.ohlcData.high,
      low: this.ohlcData.low,
      annualizationFactor: 252
    });

    // Garman-Klass Volatility (OHLC)
    const garmanKlass = calculateGarmanKlassVolatility({
      open: this.ohlcData.open,
      high: this.ohlcData.high,
      low: this.ohlcData.low,
      close: this.ohlcData.close,
      annualizationFactor: 252
    });

    return {
      standard: standard.annualizedVolatility,
      ewma: ewma.annualizedVolatility,
      parkinson: parkinson.annualizedVolatility,
      garmanKlass: garmanKlass.annualizedVolatility,
      volatilityClustering: this.detectVolatilityClustering()
    };
  }

  // Volatility Clustering Detection
  private detectVolatilityClustering(): boolean {
    const squaredReturns = this.returns.map(r => r * r);
    const autocorrelation = this.calculateAutocorrelation(squaredReturns, 1);
    return Math.abs(autocorrelation) > 0.1; // Significant clustering
  }

  private calculateAutocorrelation(data: number[], lag: number): number {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = lag; i < n; i++) {
      numerator += (data[i] - mean) * (data[i - lag] - mean);
    }
    
    for (let i = 0; i < n; i++) {
      denominator += Math.pow(data[i] - mean, 2);
    }
    
    return numerator / denominator;
  }
}
```

---

## Client Reporting System

### Automated Performance Reports

```typescript
import {
  calculateTimeWeightedReturn,
  calculateMoneyWeightedReturn,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateCalmarRatio
} from '@railpath/finance-toolkit';

class ClientReportGenerator {
  generatePerformanceReport(clientId: string, portfolioData: any) {
    // TWR for Manager Performance
    const twr = calculateTimeWeightedReturn({
      portfolioValues: portfolioData.values,
      cashFlows: portfolioData.cashFlows,
      annualizationFactor: 252
    });

    // MWR for Client Performance
    const mwr = calculateMoneyWeightedReturn({
      cashFlows: portfolioData.cashFlows,
      dates: portfolioData.dates,
      finalValue: portfolioData.values[portfolioData.values.length - 1],
      initialValue: 0
    });

    // Risk Metrics
    const sharpe = calculateSharpeRatio({
      returns: portfolioData.returns,
      riskFreeRate: 0.02,
      annualizationFactor: 252
    });

    const maxDD = calculateMaxDrawdown({
      portfolioValues: portfolioData.values
    });

    const calmar = calculateCalmarRatio({
      returns: portfolioData.returns,
      portfolioValues: portfolioData.values,
      annualizationFactor: 252
    });

    return {
      clientId,
      period: this.getReportingPeriod(portfolioData.dates),
      performance: {
        twr: {
          value: twr.annualizedTWR,
          label: 'Time-Weighted Return',
          description: 'Manager performance independent of cash flows'
        },
        mwr: {
          value: mwr.annualizedMWR,
          label: 'Money-Weighted Return',
          description: 'Client performance including cash flow timing'
        }
      },
      risk: {
        sharpe: {
          value: sharpe.annualizedSharpeRatio,
          label: 'Sharpe Ratio',
          description: 'Risk-adjusted return measure'
        },
        maxDrawdown: {
          value: maxDD.maxDrawdownPercent,
          label: 'Maximum Drawdown',
          description: 'Largest peak-to-trough decline'
        },
        calmar: {
          value: calmar.calmarRatio,
          label: 'Calmar Ratio',
          description: 'Return vs. maximum drawdown'
        }
      },
      summary: this.generateSummary(twr, mwr, sharpe, maxDD, calmar)
    };
  }

  private generateSummary(twr: any, mwr: any, sharpe: any, maxDD: any, calmar: any): string {
    const performance = twr.annualizedTWR > 0.1 ? 'Strong' : 'Moderate';
    const risk = sharpe.annualizedSharpeRatio > 1.0 ? 'Well-managed' : 'Elevated';
    const drawdown = maxDD.maxDrawdownPercent < 0.1 ? 'Controlled' : 'Significant';
    
    return `Portfolio shows ${performance} performance with ${risk} risk levels. ` +
           `Drawdown is ${drawdown} at ${(maxDD.maxDrawdownPercent * 100).toFixed(1)}%.`;
  }

  private getReportingPeriod(dates: Date[]): string {
    const start = dates[0];
    const end = dates[dates.length - 1];
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
}
```

---

## Real-Time Risk Monitoring

### Live Portfolio Risk Dashboard

```typescript
import {
  calculateVaR,
  calculateExpectedShortfall,
  calculateMaxDrawdown,
  calculateVolatility
} from '@railpath/finance-toolkit';

class LiveRiskDashboard {
  private portfolioData: any[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  startMonitoring() {
    this.updateInterval = setInterval(() => {
      this.updateRiskMetrics();
    }, 60000); // Update every minute
  }

  stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private updateRiskMetrics() {
    const returns = this.calculateReturns();
    
    // Real-time VaR
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

    // Current Volatility
    const volatility = calculateVolatility({
      returns,
      annualizationFactor: 252
    });

    // Maximum Drawdown
    const maxDD = calculateMaxDrawdown({
      portfolioValues: this.portfolioData.map(d => d.value)
    });

    this.broadcastRiskUpdate({
      timestamp: new Date(),
      var95: var95.var,
      var99: var99.var,
      expectedShortfall: es95.expectedShortfall,
      volatility: volatility.annualizedVolatility,
      maxDrawdown: maxDD.maxDrawdownPercent,
      riskLevel: this.calculateRiskLevel(var95.var, volatility.annualizedVolatility)
    });
  }

  private calculateRiskLevel(var95: number, volatility: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (Math.abs(var95) < 0.02 && volatility < 0.15) return 'LOW';
    if (Math.abs(var95) < 0.05 && volatility < 0.25) return 'MEDIUM';
    return 'HIGH';
  }

  private calculateReturns(): number[] {
    const returns: number[] = [];
    for (let i = 1; i < this.portfolioData.length; i++) {
      const return_ = (this.portfolioData[i].value - this.portfolioData[i-1].value) / this.portfolioData[i-1].value;
      returns.push(return_);
    }
    return returns;
  }

  private broadcastRiskUpdate(metrics: any) {
    // Implementation depends on your real-time system (WebSocket, SSE, etc.)
    console.log('Risk Update:', metrics);
  }
}
```

---

## Backtesting Framework

### Strategy Performance Analysis

```typescript
import {
  calculateTimeWeightedReturn,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateCalmarRatio,
  calculateAlpha,
  calculateBeta
} from '@railpath/finance-toolkit';

class StrategyBacktester {
  backtestStrategy(strategyReturns: number[], benchmarkReturns: number[], riskFreeRate: number) {
    // Strategy Performance
    const twr = calculateTimeWeightedReturn({
      portfolioValues: this.returnsToValues(strategyReturns),
      cashFlows: new Array(strategyReturns.length).fill(0),
      annualizationFactor: 252
    });

    const sharpe = calculateSharpeRatio({
      returns: strategyReturns,
      riskFreeRate,
      annualizationFactor: 252
    });

    const maxDD = calculateMaxDrawdown({
      portfolioValues: this.returnsToValues(strategyReturns)
    });

    const calmar = calculateCalmarRatio({
      returns: strategyReturns,
      portfolioValues: this.returnsToValues(strategyReturns),
      annualizationFactor: 252
    });

    // Benchmark Comparison
    const alpha = calculateAlpha({
      assetReturns: strategyReturns,
      benchmarkReturns,
      riskFreeRate,
      annualizationFactor: 252
    });

    const beta = calculateBeta({
      assetReturns: strategyReturns,
      benchmarkReturns,
      annualizationFactor: 252
    });

    return {
      performance: {
        totalReturn: twr.annualizedTWR,
        sharpe: sharpe.annualizedSharpeRatio,
        maxDrawdown: maxDD.maxDrawdownPercent,
        calmar: calmar.calmarRatio
      },
      benchmark: {
        alpha: alpha.alpha,
        beta: beta.beta,
        informationRatio: alpha.alpha / this.calculateTrackingError(strategyReturns, benchmarkReturns)
      },
      summary: this.generateBacktestSummary(twr, sharpe, maxDD, alpha)
    };
  }

  private returnsToValues(returns: number[]): number[] {
    const values = [1000]; // Starting value
    for (let i = 1; i < returns.length; i++) {
      values.push(values[i-1] * (1 + returns[i]));
    }
    return values;
  }

  private calculateTrackingError(strategyReturns: number[], benchmarkReturns: number[]): number {
    const differences = strategyReturns.map((r, i) => r - benchmarkReturns[i]);
    const mean = differences.reduce((a, b) => a + b, 0) / differences.length;
    const variance = differences.reduce((sum, diff) => sum + Math.pow(diff - mean, 2), 0) / differences.length;
    return Math.sqrt(variance);
  }

  private generateBacktestSummary(twr: any, sharpe: any, maxDD: any, alpha: any): string {
    const performance = twr.annualizedTWR > 0.1 ? 'Strong' : 'Moderate';
    const riskAdjusted = sharpe.annualizedSharpeRatio > 1.0 ? 'Excellent' : 'Good';
    const alphaPerformance = alpha.alpha > 0 ? 'Outperforming' : 'Underperforming';
    
    return `Strategy shows ${performance} performance with ${riskAdjusted} risk-adjusted returns. ` +
           `Alpha is ${alphaPerformance} benchmark with ${(alpha.alpha * 100).toFixed(2)}% excess return.`;
  }
}
```

---

## Best Practices

### 1. **Data Validation**
```typescript
// Always validate input data
const validateReturns = (returns: number[]): boolean => {
  return returns.length > 0 && returns.every(r => !isNaN(r) && isFinite(r));
};
```

### 2. **Error Handling**
```typescript
// Comprehensive error handling
try {
  const result = calculateVaR(options);
  return result;
} catch (error) {
  console.error('VaR calculation failed:', error);
  return { var: 0, confidenceLevel: 0, method: 'failed' };
}
```

### 3. **Performance Optimization**
```typescript
// Cache expensive calculations
const memoizedCorrelation = useMemo(() => 
  calculateCorrelationMatrix({ assetReturns }), 
  [assetReturns]
);
```

### 4. **Real-time Updates**
```typescript
// Efficient real-time updates
const updateRiskMetrics = debounce(() => {
  // Update risk metrics
}, 1000);
```

---

**Made for quantitative finance professionals**
