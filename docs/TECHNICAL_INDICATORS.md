# Technical Indicators

## Overview

All technical indicators follow industry-standard implementations with complete transparency on calculation methods.

---

## Trend Indicators

### Simple Moving Average (SMA)

**Method**: Arithmetic mean over period

**Formula**:
```
SMA = (P₁ + P₂ + ... + Pₙ) / n
```

**Parameters**:
```typescript
calculateSMA({
  prices: number[];     // Price data
  period: number;       // Lookback period
})
```

**Output**:
- Array length: `prices.length - period + 1`
- First value at index `period - 1`

**Example**:
```typescript
const result = calculateSMA({
  prices: [10, 11, 12, 13, 14],
  period: 3
});
// result.sma = [11, 12, 13]  // 3 values
```

---

### Exponential Moving Average (EMA)

**Method**: Exponentially weighted moving average

**Formula**:
```
Multiplier = 2 / (period + 1)
EMA[0] = SMA(period)  // Initial value
EMA[t] = (Price[t] - EMA[t-1]) * Multiplier + EMA[t-1]
```

**Parameters**:
```typescript
calculateEMA({
  prices: number[];
  period: number;       // Default: 12
})
```

**Implementation Details**:
- **Initial value**: SMA of first `period` prices
- **Smoothing factor**: `2 / (period + 1)`
- More responsive to recent prices than SMA

**Example**:
```typescript
const result = calculateEMA({
  prices: [10, 11, 12, 13, 14, 15],
  period: 3
});
// First EMA = SMA([10, 11, 12]) = 11
// Subsequent EMAs use exponential smoothing
```

---

### Moving Average Convergence Divergence (MACD)

**Method**: Difference between two EMAs with signal line

**Formula**:
```
MACD Line = EMA(fast) - EMA(slow)
Signal Line = EMA(MACD, signal period)
Histogram = MACD Line - Signal Line
```

**Parameters**:
```typescript
calculateMACD({
  prices: number[];
  fastPeriod?: number;    // Default: 12
  slowPeriod?: number;    // Default: 26
  signalPeriod?: number;  // Default: 9
})
```

**Implementation Details**:
- **Fast EMA**: 12-period (default)
- **Slow EMA**: 26-period (default)
- **Signal Line**: 9-period **EMA** of MACD line (NOT SMA)
- **Minimum data**: `slowPeriod + signalPeriod - 1` prices required

**Output**:
```typescript
{
  macdLine: number[];      // Fast EMA - Slow EMA
  signalLine: number[];    // EMA of MACD line
  histogram: number[];     // MACD - Signal
  fastEMA: number[];       // Fast EMA values
  slowEMA: number[];       // Slow EMA values
}
```

**Example**:
```typescript
const result = calculateMACD({
  prices: dailyPrices,
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9
});

console.log(result.macdLine);    // Momentum indicator
console.log(result.signalLine);  // Trigger line
console.log(result.histogram);   // Divergence
```

---

## Momentum Indicators

### Relative Strength Index (RSI)

**Method**: Wilder's smoothing (modified EMA)

**Formula**:
```
RS = Average Gain / Average Loss
RSI = 100 - (100 / (1 + RS))
```

**First Average** (Wilder's Method):
```
First Avg Gain = SMA(gains, period)
First Avg Loss = SMA(losses, period)
```

**Subsequent Averages** (Wilder's Smoothing):
```
Avg Gain = ((Previous Avg Gain * (period-1)) + Current Gain) / period
Avg Loss = ((Previous Avg Loss * (period-1)) + Current Loss) / period
```

**Parameters**:
```typescript
calculateRSI({
  prices: number[];
  period: number;  // Default: 14
})
```

**Implementation Details**:
- **Method**: Wilder's smoothing (NOT standard EMA)
- **First value**: Uses SMA for initial average
- **Smoothing factor**: `1/period` (more conservative than EMA's `2/(period+1)`)
- **Range**: 0-100

**Interpretation**:
- **> 70**: Overbought
- **< 30**: Oversold
- **50**: Neutral

**Example**:
```typescript
const result = calculateRSI({
  prices: dailyPrices,
  period: 14
});

console.log(result.rsi);  // Array of RSI values (0-100)
```

---

### Stochastic Oscillator

**Type**: Full Stochastic

**Formula**:
```
%K = ((Close - Lowest Low) / (Highest High - Lowest Low)) * 100
%D = SMA(%K, dPeriod)
```

**Parameters**:
```typescript
calculateStochastic({
  high: number[];
  low: number[];
  close: number[];
  kPeriod?: number;  // Default: 14 (lookback for %K)
  dPeriod?: number;  // Default: 3 (smoothing for %D)
})
```

**Implementation Details**:
- **Type**: **Full Stochastic** (raw %K with SMA smoothing)
- **%K calculation**: Raw stochastic over kPeriod
- **%D calculation**: **SMA** of %K over dPeriod (NOT EMA)
- **Range**: 0-100

**Variants**:
- **Fast Stochastic**: %K (raw), %D = SMA(%K, 3)
- **Slow Stochastic**: %K = SMA(fast %K, 3), %D = SMA(%K, 3)
- **This implementation**: Full Stochastic (configurable smoothing)

**Interpretation**:
- **> 80**: Overbought
- **< 20**: Oversold
- **Crossover**: %K crossing %D signals trend change

**Example**:
```typescript
const result = calculateStochastic({
  high: dailyHighs,
  low: dailyLows,
  close: dailyCloses,
  kPeriod: 14,
  dPeriod: 3
});

console.log(result.percentK);  // %K values
console.log(result.percentD);  // %D values (signal line)
```

---

### Williams %R

**Method**: Inverted Stochastic

**Formula**:
```
%R = ((Highest High - Close) / (Highest High - Lowest Low)) * -100
```

**Parameters**:
```typescript
calculateWilliamsR({
  high: number[];
  low: number[];
  close: number[];
  period?: number;  // Default: 14
})
```

**Implementation Details**:
- **Range**: -100 to 0 (inverted from Stochastic)
- **Calculation**: Identical to Stochastic %K but inverted
- **No smoothing**: Direct calculation (unlike Stochastic with %D)

**Interpretation**:
- **> -20**: Overbought
- **< -80**: Oversold
- **-50**: Neutral

**Example**:
```typescript
const result = calculateWilliamsR({
  high: dailyHighs,
  low: dailyLows,
  close: dailyCloses,
  period: 14
});

console.log(result.williamsR);  // Values from -100 to 0
```

---

## Volatility Indicators

### Bollinger Bands

**Method**: SMA with standard deviation bands

**Formula**:
```
Middle Band = SMA(prices, period)
Upper Band = Middle Band + (stdDev * multiplier)
Lower Band = Middle Band - (stdDev * multiplier)

%B = (Price - Lower Band) / (Upper Band - Lower Band)
Bandwidth = (Upper Band - Lower Band) / Middle Band
```

**Parameters**:
```typescript
calculateBollingerBands({
  prices: number[];
  period?: number;           // Default: 20
  stdDevMultiplier?: number; // Default: 2
})
```

**Implementation Details**:
- **Middle band**: SMA over period
- **Standard deviation**: Population std dev (not sample)
- **Default**: 20-period, 2 standard deviations
- **%B**: Price position within bands (0-1)
- **Bandwidth**: Band width relative to middle band

**Interpretation**:
- **Price at upper band**: Overbought
- **Price at lower band**: Oversold
- **Band squeeze**: Low volatility (potential breakout)
- **Band expansion**: High volatility

**Example**:
```typescript
const result = calculateBollingerBands({
  prices: dailyPrices,
  period: 20,
  stdDevMultiplier: 2
});

console.log(result.upperBand);
console.log(result.middleBand);
console.log(result.lowerBand);
console.log(result.percentB);    // Price position
console.log(result.bandwidth);   // Volatility measure
```

---

### Average True Range (ATR)

**Method**: Wilder's smoothing of True Range

**Formula**:
```
True Range = max(
  High - Low,
  |High - Previous Close|,
  |Low - Previous Close|
)

First ATR = SMA(True Range, period)
Subsequent ATR = ((Previous ATR * (period-1)) + Current TR) / period
```

**Parameters**:
```typescript
calculateATR({
  high: number[];
  low: number[];
  close: number[];
  period?: number;  // Default: 14
})
```

**Implementation Details**:
- **True Range**: Maximum of three ranges
- **First value**: SMA of True Range
- **Smoothing**: Wilder's method (same as RSI)
- **Units**: Same as price (not percentage)

**Usage**:
- **Volatility measure**: Higher ATR = higher volatility
- **Stop-loss placement**: Set stops at N * ATR
- **Position sizing**: Adjust size based on ATR

**Example**:
```typescript
const result = calculateATR({
  high: dailyHighs,
  low: dailyLows,
  close: dailyCloses,
  period: 14
});

console.log(result.atr);         // ATR values
console.log(result.trueRange);   // Raw TR values
```

---

## Common Patterns

### Array Lengths

All indicators return arrays **shorter** than input:

```typescript
// SMA/EMA: prices.length - period + 1
calculateSMA({ prices: [1,2,3,4,5], period: 3 })
// → sma: [2, 3, 4]  (3 values)

// RSI: prices.length - period
calculateRSI({ prices: [1,2,3,4,5,6], period: 3 })
// → rsi: [50, 60, 70]  (3 values, needs price changes)
```

### Index Alignment

Indicators include `indices` array for alignment:

```typescript
const result = calculateSMA({
  prices: [10, 11, 12, 13, 14],
  period: 3
});

console.log(result.sma);      // [11, 12, 13]
console.log(result.indices);  // [2, 3, 4]
// Index 2 of prices corresponds to SMA[0]
```

### Default Periods

| Indicator | Default Period | Standard |
|-----------|---------------|----------|
| SMA | N/A (required) | 20, 50, 200 common |
| EMA | 12 | 12, 26 common |
| MACD | 12/26/9 | Industry standard |
| RSI | 14 | Wilder's original |
| Stochastic | 14/3 | Industry standard |
| Williams %R | 14 | Industry standard |
| Bollinger | 20 | Industry standard |
| ATR | 14 | Wilder's original |

---

## Best Practices

1. **Data Requirements**: Ensure sufficient history (3-4x indicator period minimum)
2. **Index Alignment**: Use returned `indices` to align with original price data
3. **Multiple Timeframes**: Calculate on different periods for confirmation
4. **Combine Indicators**: Use trend + momentum + volatility for robust signals
5. **Backtesting**: Always test indicator combinations before live use

---

## Related Functions

- `calculateVolatility` - Standard deviation based volatility
- `calculateEWMAVolatility` - Exponentially weighted volatility
- `calculateReturns` - Price returns for further analysis

