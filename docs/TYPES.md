# TypeScript Types & Schemas

Complete documentation of all TypeScript types and Zod schemas in @railpath/finance-toolkit.

---

## 📊 Portfolio Performance Types

### Time-Weighted Return

```typescript
// Input Options
export type TimeWeightedReturnOptions = {
  portfolioValues: number[];        // Portfolio-Werte über Zeit
  cashFlows: number[];             // Cash Flows (positiv = Einzahlung)
  annualizationFactor?: number;    // Jährlichkeitsfaktor (Standard: 252)
};

// Output Result
export type TimeWeightedReturnResult = {
  twr: number;                     // Time-Weighted Return
  annualizedTWR: number;           // Annualisierter TWR
  periodReturns: number[];         // Perioden-Returns
};
```

### Money-Weighted Return

```typescript
// Input Options
export type MoneyWeightedReturnOptions = {
  cashFlows: number[];             // Cash Flows
  dates: Date[];                   // Zeitpunkte der Cash Flows
  finalValue: number;              // Endwert des Portfolios
  initialValue?: number;           // Anfangswert (Standard: 0)
  maxIterations?: number;          // Max. Newton-Raphson Iterationen
  tolerance?: number;              // Konvergenz-Toleranz
};

// Output Result
export type MoneyWeightedReturnResult = {
  mwr: number;                     // Money-Weighted Return (IRR)
  annualizedMWR: number;          // Annualisierter MWR
  cashFlowCount: number;           // Anzahl der Cash Flows
  timePeriodYears: number;         // Zeitraum in Jahren
  npv: number;                     // Net Present Value
  iterations: number;               // Anzahl der Iterationen
};
```

---

## ⚠️ Risk Metrics Types

### Value at Risk

```typescript
// Input Options
export type VaROptions = {
  returns: number[];               // Historische Returns
  confidenceLevel: number;         // Konfidenzniveau (0.95, 0.99)
  method: 'historical' | 'parametric' | 'monte-carlo'; // Berechnungsmethode
  annualizationFactor?: number;    // Jährlichkeitsfaktor
};

// Output Result
export type VaRResult = {
  var: number;                     // Value at Risk
  confidenceLevel: number;         // Verwendetes Konfidenzniveau
  method: string;                  // Verwendete Methode
};
```

### Expected Shortfall

```typescript
// Input Options
export type ExpectedShortfallOptions = {
  returns: number[];              // Historische Returns
  confidenceLevel: number;         // Konfidenzniveau
  method: 'historical' | 'parametric'; // Berechnungsmethode
  annualizationFactor?: number;    // Jährlichkeitsfaktor
};

// Output Result
export type ExpectedShortfallResult = {
  expectedShortfall: number;       // Expected Shortfall
  confidenceLevel: number;         // Konfidenzniveau
  method: string;                  // Methode
};
```

### Sharpe Ratio

```typescript
// Input Options
export type SharpeRatioOptions = {
  returns: number[];               // Portfolio Returns
  riskFreeRate: number;           // Risikofreier Zinssatz
  annualizationFactor?: number;   // Jährlichkeitsfaktor
};

// Output Result
export type SharpeRatioResult = {
  sharpeRatio: number;             // Sharpe Ratio
  annualizedSharpeRatio: number;   // Annualisiertes Sharpe Ratio
};
```

### Sortino Ratio

```typescript
// Input Options
export type SortinoRatioOptions = {
  returns: number[];              // Portfolio Returns
  riskFreeRate: number;           // Risikofreier Zinssatz
  annualizationFactor?: number;   // Jährlichkeitsfaktor
};

// Output Result
export type SortinoRatioResult = {
  sortinoRatio: number;            // Sortino Ratio
  annualizedSortinoRatio: number;  // Annualisiertes Sortino Ratio
};
```

### Maximum Drawdown

```typescript
// Input Options
export type MaxDrawdownOptions = {
  portfolioValues: number[];       // Portfolio-Werte über Zeit
  dates?: Date[];                // Optional: Zeitpunkte
  cashFlows?: number[];            // Optional: Cash Flows
};

// Output Result
export type MaxDrawdownResult = {
  maxDrawdown: number;             // Maximum Drawdown
  maxDrawdownPercent: number;      // Maximum Drawdown in Prozent
  startDate?: Date;                // Start des Drawdowns
  endDate?: Date;                  // Ende des Drawdowns
};
```

---

## 📈 Volatility Types

### Standard Volatility

```typescript
// Input Options
export type VolatilityOptions = {
  returns: number[];               // Returns
  annualizationFactor?: number;    // Jährlichkeitsfaktor
};

// Output Result
export type VolatilityResult = {
  volatility: number;               // Volatilität
  annualizedVolatility: number;     // Annualisierte Volatilität
};
```

### EWMA Volatility

```typescript
// Input Options
export type EWMAVolatilityOptions = {
  returns: number[];               // Returns
  lambda: number;                  // Decay-Faktor (0 < lambda < 1)
  annualizationFactor?: number;    // Jährlichkeitsfaktor
};

// Output Result
export type EWMAVolatilityResult = {
  volatility: number;               // EWMA Volatilität
  annualizedVolatility: number;     // Annualisierte Volatilität
};
```

### Parkinson Volatility

```typescript
// Input Options
export type ParkinsonVolatilityOptions = {
  high: number[];                  // High-Preise
  low: number[];                   // Low-Preise
  annualizationFactor?: number;     // Jährlichkeitsfaktor
};

// Output Result
export type ParkinsonVolatilityResult = {
  volatility: number;               // Parkinson Volatilität
  annualizedVolatility: number;     // Annualisierte Volatilität
};
```

### Garman-Klass Volatility

```typescript
// Input Options
export type GarmanKlassVolatilityOptions = {
  open: number[];                   // Open-Preise
  high: number[];                   // High-Preise
  low: number[];                    // Low-Preise
  close: number[];                  // Close-Preise
  annualizationFactor?: number;      // Jährlichkeitsfaktor
};

// Output Result
export type GarmanKlassVolatilityResult = {
  volatility: number;               // Garman-Klass Volatilität
  annualizedVolatility: number;     // Annualisierte Volatilität
};
```

---

## 🔗 Portfolio Analysis Types

### Correlation Matrix

```typescript
// Input Options
export type CorrelationMatrixOptions = {
  assetReturns: number[][];        // Returns für jedes Asset
  annualizationFactor?: number;     // Jährlichkeitsfaktor
};

// Output Result
export type CorrelationMatrixResult = {
  correlationMatrix: number[][];    // Korrelationsmatrix
  assetCount: number;              // Anzahl der Assets
};
```

### Covariance Matrix

```typescript
// Input Options
export type CovarianceMatrixOptions = {
  assetReturns: number[][];        // Returns für jedes Asset
  annualizationFactor?: number;     // Jährlichkeitsfaktor
};

// Output Result
export type CovarianceMatrixResult = {
  covarianceMatrix: number[][];    // Kovarianzmatrix
  assetCount: number;              // Anzahl der Assets
};
```

### Portfolio Volatility

```typescript
// Input Options
export type PortfolioVolatilityOptions = {
  weights: number[];               // Asset-Gewichtungen
  covarianceMatrix: number[][];    // Kovarianzmatrix
  annualizationFactor?: number;     // Jährlichkeitsfaktor
};

// Output Result
export type PortfolioVolatilityResult = {
  portfolioVolatility: number;     // Portfolio-Volatilität
  annualizedVolatility: number;     // Annualisierte Volatilität
};
```

---

## 🎯 Performance Metrics Types

### Alpha

```typescript
// Input Options
export type AlphaOptions = {
  assetReturns: number[];          // Asset Returns
  benchmarkReturns: number[];      // Benchmark Returns
  riskFreeRate: number;           // Risikofreier Zinssatz
  annualizationFactor?: number;    // Jährlichkeitsfaktor
};

// Output Result
export type AlphaResult = {
  alpha: number;                   // Alpha
  annualizedAlpha: number;         // Annualisiertes Alpha
};
```

### Beta

```typescript
// Input Options
export type BetaOptions = {
  assetReturns: number[];          // Asset Returns
  benchmarkReturns: number[];      // Benchmark Returns
  annualizationFactor?: number;    // Jährlichkeitsfaktor
};

// Output Result
export type BetaResult = {
  beta: number;                    // Beta
};
```

### Calmar Ratio

```typescript
// Input Options
export type CalmarRatioOptions = {
  returns: number[];               // Portfolio Returns
  portfolioValues: number[];       // Portfolio-Werte
  annualizationFactor?: number;    // Jährlichkeitsfaktor
};

// Output Result
export type CalmarRatioResult = {
  calmarRatio: number;            // Calmar Ratio
};
```

---

## 🔧 Zod Schemas

### Schema Validation

Alle Typen werden mit Zod-Schemas validiert:

```typescript
import { z } from 'zod';

// Time-Weighted Return Schema
export const TimeWeightedReturnOptionsSchema = z.object({
  portfolioValues: z.array(z.number().nonnegative()).min(2),
  cashFlows: z.array(z.number()).min(2),
  annualizationFactor: z.number().positive().optional().default(252),
});

// Money-Weighted Return Schema
export const MoneyWeightedReturnOptionsSchema = z.object({
  cashFlows: z.array(z.number()).min(1),
  dates: z.array(z.date()).min(1),
  finalValue: z.number().nonnegative(),
  initialValue: z.number().nonnegative().default(0),
  maxIterations: z.number().positive().optional().default(100),
  tolerance: z.number().positive().optional().default(1e-6),
});
```

### Schema Features

1. **Type Safety**: Vollständige TypeScript-Unterstützung
2. **Runtime Validation**: Zod-Validierung zur Laufzeit
3. **Default Values**: Automatische Standardwerte
4. **Error Messages**: Aussagekräftige Fehlermeldungen

---

## 🎯 Type Guards

### Runtime Type Checking

```typescript
// Type Guards für sichere Typenprüfung
export function isTimeWeightedReturnOptions(obj: any): obj is TimeWeightedReturnOptions {
  return TimeWeightedReturnOptionsSchema.safeParse(obj).success;
}

export function isMoneyWeightedReturnOptions(obj: any): obj is MoneyWeightedReturnOptions {
  return MoneyWeightedReturnOptionsSchema.safeParse(obj).success;
}

// Verwendung
if (isTimeWeightedReturnOptions(options)) {
  const result = calculateTimeWeightedReturn(options);
}
```

---

## 📊 Utility Types

### Generic Portfolio Types

```typescript
// Basis-Portfolio-Typ
export type PortfolioData = {
  values: number[];
  cashFlows: number[];
  dates: Date[];
};

// Erweiterte Portfolio-Typen
export type PortfolioWithBenchmark = PortfolioData & {
  benchmarkReturns: number[];
  benchmarkValues: number[];
};

export type MultiAssetPortfolio = {
  assetReturns: number[][];
  weights: number[];
  assetNames: string[];
};
```

### Risk Configuration Types

```typescript
// Risk Limits
export type RiskLimits = {
  dailyVaR: number;
  weeklyVaR: number;
  maxDrawdown: number;
  concentration: number;
};

// Risk Monitoring
export type RiskMetrics = {
  var: number;
  expectedShortfall: number;
  sharpe: number;
  maxDrawdown: number;
  volatility: number;
};

// Risk Alerts
export type RiskAlert = {
  type: 'VAR' | 'DRAWDOWN' | 'VOLATILITY' | 'CONCENTRATION';
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  timestamp: Date;
};
```

---

## 🎯 Advanced Types

### Generic Function Types

```typescript
// Generic Risk Function
export type RiskFunction<T extends VaROptions | ExpectedShortfallOptions> = (
  options: T
) => T extends VaROptions ? VaRResult : ExpectedShortfallResult;

// Generic Performance Function
export type PerformanceFunction<T extends TimeWeightedReturnOptions | MoneyWeightedReturnOptions> = (
  options: T
) => T extends TimeWeightedReturnOptions ? TimeWeightedReturnResult : MoneyWeightedReturnResult;
```

### Conditional Types

```typescript
// Conditional Return Types
export type ReturnType<T> = T extends { method: 'historical' } 
  ? VaRResult 
  : T extends { method: 'parametric' } 
  ? VaRResult 
  : T extends { method: 'monte-carlo' }
  ? VaRResult
  : never;

// Method-specific Options
export type MethodSpecificOptions<T> = T extends { method: 'monte-carlo' }
  ? VaROptions & { simulations: number }
  : T extends { method: 'parametric' }
  ? VaROptions & { distribution: 'normal' | 't' }
  : VaROptions;
```

---

## 🔧 Type Utilities

### Type Helpers

```typescript
// Extract Return Types
export type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract Options Types
export type ExtractOptionsType<T> = T extends (options: infer O) => any ? O : never;

// Union to Intersection
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Deep Partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### Type Constraints

```typescript
// Numeric Array Constraint
export type NumericArray<T extends number[]> = T;

// Date Array Constraint
export type DateArray<T extends Date[]> = T;

// Positive Number Constraint
export type PositiveNumber<T extends number> = T extends number 
  ? T extends 0 
    ? never 
    : T extends -1 
    ? never 
    : T 
  : never;
```

---

## 📝 Type Examples

### Complete Type Usage

```typescript
import type {
  TimeWeightedReturnOptions,
  TimeWeightedReturnResult,
  MoneyWeightedReturnOptions,
  MoneyWeightedReturnResult,
  VaROptions,
  VaRResult
} from '@railpath/finance-toolkit';

// Type-safe function calls
function analyzePortfolio(portfolioData: {
  values: number[];
  cashFlows: number[];
  dates: Date[];
  returns: number[];
}) {
  // TWR Analysis
  const twrOptions: TimeWeightedReturnOptions = {
    portfolioValues: portfolioData.values,
    cashFlows: portfolioData.cashFlows,
    annualizationFactor: 252
  };
  
  const twrResult: TimeWeightedReturnResult = calculateTimeWeightedReturn(twrOptions);
  
  // MWR Analysis
  const mwrOptions: MoneyWeightedReturnOptions = {
    cashFlows: portfolioData.cashFlows,
    dates: portfolioData.dates,
    finalValue: portfolioData.values[portfolioData.values.length - 1],
    initialValue: 0
  };
  
  const mwrResult: MoneyWeightedReturnResult = calculateMoneyWeightedReturn(mwrOptions);
  
  // VaR Analysis
  const varOptions: VaROptions = {
    returns: portfolioData.returns,
    confidenceLevel: 0.95,
    method: 'historical',
    annualizationFactor: 252
  };
  
  const varResult: VaRResult = calculateVaR(varOptions);
  
  return {
    twr: twrResult,
    mwr: mwrResult,
    var: varResult
  };
}
```

---

## ⚠️ Type Safety Best Practices

### 1. **Strict Type Checking**

```typescript
// Enable strict mode in tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. **Runtime Validation**

```typescript
// Always validate at runtime
function safeCalculateTWR(options: unknown): TimeWeightedReturnResult {
  const validatedOptions = TimeWeightedReturnOptionsSchema.parse(options);
  return calculateTimeWeightedReturn(validatedOptions);
}
```

### 3. **Type Guards**

```typescript
// Use type guards for runtime safety
function isVaROptions(obj: any): obj is VaROptions {
  return obj && 
         Array.isArray(obj.returns) && 
         typeof obj.confidenceLevel === 'number' &&
         ['historical', 'parametric', 'monte-carlo'].includes(obj.method);
}
```

---

**Made with ❤️ for TypeScript developers**
