# Regime Detection with Hidden Markov Models

The Finance Toolkit Library provides a complete Hidden Markov Model (HMM) implementation for market regime detection.

## Overview

Hidden Markov Models can be used to identify different market phases (regimes) such as bullish, bearish, or neutral markets.

## Features

- ✅ **Zero Runtime Dependencies** - Pure TypeScript implementation
- ✅ **Numerically Stable** - Forward/Backward with scaling, Viterbi in log-space
- ✅ **Flexible Features** - Default (Returns + Volatility), Advanced (RSI, MACD, EMA) or Custom
- ✅ **Configurable States** - 2-5+ states with custom labels
- ✅ **Production-Ready** - Fully tested with Zod validation

## Quick Start

### Simple Example (3 States: bearish, neutral, bullish)

```typescript
import { detectRegime } from '@railpath/finance-toolkit';

const prices = [100, 102, 105, 103, 107, 110, 108, 112, 115, ...];

const result = detectRegime(prices);

console.log(result.currentRegime); // 'bullish'
console.log(result.confidence); // 0.85
console.log(result.regimes); // ['neutral', 'neutral', 'bullish', 'bullish', ...]
```

### Advanced Configuration

```typescript
const result = detectRegime(prices, {
  numStates: 4,
  features: ['returns', 'volatility', 'rsi'],
  featureWindow: 20,
  maxIterations: 100,
  convergenceTolerance: 1e-6,
  stateLabels: ['strong_bearish', 'weak_bearish', 'weak_bullish', 'strong_bullish']
});
```

### Custom Features

```typescript
// Pass your own feature matrix
const customFeatures = [
  [0.01, 0.15, 45],  // [return, volatility, rsi] for t=0
  [0.02, 0.14, 52],  // for t=1
  [-0.01, 0.18, 38], // for t=2
  // ...
];

const result = detectRegime(prices, {
  features: customFeatures,
  numStates: 3
});
```

## API Reference

### High-Level API

#### `detectRegime(prices, options?)`

Main function for regime detection.

**Parameters:**
- `prices: number[]` - Array of prices (minimum 2 prices)
- `options?: RegimeDetectionOptions` - Optional configuration

**Returns:** `RegimeDetectionResult`

**Options:**
```typescript
{
  numStates?: number;              // Default: 3
  features?: 'default' | string[] | number[][];
  featureWindow?: number;          // Default: 20
  maxIterations?: number;          // Default: 100
  convergenceTolerance?: number;   // Default: 1e-6
  stateLabels?: string[];          // Default: ['bearish', 'neutral', 'bullish']
}
```

**Result:**
```typescript
{
  currentRegime: string;           // Current regime
  regimes: string[];               // Regime for each time point
  stateSequence: number[];         // Raw state indices (Viterbi path)
  stateProbabilities: number[][];  // P(state|observations) for each time point
  model: HMMModel;                 // Trained model
  confidence: number;              // Average confidence (0-1)
}
```

### Low-Level API (for Advanced Users)

#### `trainHMM(features, options)`

Trains an HMM on a feature matrix.

```typescript
import { trainHMM, extractFeatures } from '@railpath/finance-toolkit';

// Extract features
const features = extractFeatures(prices, {
  features: 'default',
  window: 20
});

// Train model
const model = trainHMM(features, {
  numStates: 3,
  maxIterations: 100,
  convergenceTolerance: 1e-6
});
```

#### `extractFeatures(prices, options)`

Extracts features from price data.

```typescript
import { extractFeatures } from '@railpath/finance-toolkit';

const features = extractFeatures(prices, {
  features: ['returns', 'volatility', 'rsi', 'macd'],
  window: 20
});
// Returns: T x D matrix (standardized)
```

#### HMM Algorithms

```typescript
import { 
  forward, 
  backward, 
  viterbi, 
  baumWelch,
  initializeHMM 
} from '@railpath/finance-toolkit';

// Forward-Backward for probabilities
const forwardResult = forward(observations, transitionMatrix, emissionParams, initialProbs);
const backwardResult = backward(observations, transitionMatrix, emissionParams, forwardResult.scalingFactors);

// Viterbi for most likely path
const viterbiResult = viterbi(observations, transitionMatrix, emissionParams, initialProbs);

// Baum-Welch for EM training
const model = baumWelch(observations, numStates, {
  maxIterations: 100,
  convergenceTolerance: 1e-6
});
```

### ML Utilities (for Power Users)

```typescript
import { 
  // Matrix Operations
  logSumExp, 
  normalizeRows, 
  normalizeArray,
  
  // Statistical Functions
  gaussianPDF,
  logGaussianPDF,
  multivariateGaussianPDF,
  calculateMean,
  calculateVariance,
  standardize,
  
  // Validation
  validatePriceArray,
  validateFeatureMatrix,
  validateHMMParameters
} from '@railpath/finance-toolkit';
```

## Feature Types

### Default Features
- **Returns**: Simple returns `(p[t] - p[t-1]) / p[t-1]`
- **Volatility**: Rolling standard deviation of returns

### Advanced Features
- **RSI**: Relative Strength Index (14 periods)
- **MACD**: Moving Average Convergence Divergence
- **EMA**: Exponential Moving Average

All features are automatically standardized using z-score (mean=0, std=1).

## State Mapping

States are automatically sorted by their mean return and mapped to labels:
- Lowest mean return → First label (e.g., 'bearish')
- Highest mean return → Last label (e.g., 'bullish')

**Example with 2 States:**
```typescript
['bearish', 'bullish']
```

**Example with 3 States:**
```typescript
['bearish', 'neutral', 'bullish']
```

**Example with 4 States:**
```typescript
['strong_bearish', 'weak_bearish', 'weak_bullish', 'strong_bullish']
```

## Implementation Details

### Algorithms
- **Forward Algorithm**: With scaling for numerical stability
- **Backward Algorithm**: With the same scaling factors
- **Viterbi Algorithm**: In log-space for numerical stability
- **Baum-Welch EM**: Iterative parameter estimation

### Numerical Stability
- Forward/Backward use scaling factors
- Viterbi operates in log-space
- Gaussian PDF uses log-PDF with safe exponential
- Log-Sum-Exp trick for stable calculations

### Model Initialization
- K-means-like clustering for initial state assignment
- Transition matrix with noise for symmetry breaking
- Gaussian emission parameters estimated from state segments

## Best Practices

### Data Recommendations
- **Minimum**: 50-100 observations
- **Recommended**: 200+ observations for stable estimates
- **Number of States**: 2-4 states for typical use cases

⚠️ **Feature Dimensionality**: 
- **2-3 Features**: Optimal
- **4-5 Features**: Good with >500 observations
- **6+ Features**: Only with >1000 observations

### Convergence
- Default `maxIterations: 100` is sufficient for most cases
- If not converging: Try more iterations or fewer states
- `convergenceTolerance: 1e-6` is a good default value

### Feature Selection
- Start with default features (Returns + Volatility)
- Add additional indicators as needed
- Too many features can lead to overfitting

## Examples

### Example 1: Simple Regime Detection

```typescript
import { detectRegime } from '@railpath/finance-toolkit';

// Price data (e.g., from an API)
const prices = [/* ... */];

// Simplest usage with defaults
const result = detectRegime(prices);

// Output current market sentiment
console.log(`Current Market Regime: ${result.currentRegime}`);
console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
```

### Example 2: Multi-State Analysis

```typescript
import { detectRegime } from '@railpath/finance-toolkit';

const result = detectRegime(prices, {
  numStates: 4,
  stateLabels: [
    'crash',      // Very negative trend
    'bearish',    // Negative trend
    'bullish',    // Positive trend
    'rally'       // Very positive trend
  ]
});

// Identify regime changes
for (let i = 1; i < result.regimes.length; i++) {
  if (result.regimes[i] !== result.regimes[i-1]) {
    console.log(`Regime changed from ${result.regimes[i-1]} to ${result.regimes[i]} at index ${i}`);
  }
}
```

### Example 3: With Technical Indicators

```typescript
import { detectRegime } from '@railpath/finance-toolkit';

const result = detectRegime(prices, {
  numStates: 3,
  features: ['returns', 'volatility', 'rsi', 'macd'],
  featureWindow: 20
});

// Save model for analysis
const model = result.model;
console.log('Transition Matrix:', model.transitionMatrix);
console.log('Emission Parameters:', model.emissionParams);
```

### Example 4: Advanced - Custom Pipeline

```typescript
import { 
  extractFeatures, 
  trainHMM, 
  viterbi 
} from '@railpath/finance-toolkit';

// Step 1: Extract features
const features = extractFeatures(prices, {
  features: ['returns', 'volatility', 'rsi'],
  window: 20
});

// Step 2: Train model
const model = trainHMM(features, {
  numStates: 3,
  maxIterations: 100
});

// Step 3: Find most likely state sequence
const viterbiResult = viterbi(
  features,
  model.transitionMatrix,
  model.emissionParams,
  model.initialProbs
);

console.log('State sequence:', viterbiResult.path);
console.log('Log probability:', viterbiResult.logProbability);
```

## Troubleshooting

### Problem: "Not enough observations"
**Solution**: Use more data or reduce `numStates`

### Problem: Poor convergence
**Solutions**:
- Increase `maxIterations`
- Reduce `numStates`
- Try different features

### Problem: Unrealistic regimes
**Solutions**:
- Adjust `featureWindow` (larger = smoother)
- Use less volatile features
- Use more training data

## Performance

- **Training**: O(T × N² × D) where T=timesteps, N=states, D=features
- **Inference**: O(T × N²)
- **Memory**: O(T × N)

Typical performance:
- 1000 timesteps, 3 states, 2 features: ~10-50ms training
- 1000 timesteps, 3 states, 5 features: ~20-100ms training

## Further Resources

- [Hidden Markov Models (Wikipedia)](https://en.wikipedia.org/wiki/Hidden_Markov_model)
- [Baum-Welch Algorithm](https://en.wikipedia.org/wiki/Baum%E2%80%93Welch_algorithm)
- [Viterbi Algorithm](https://en.wikipedia.org/wiki/Viterbi_algorithm)
- [Regime Detection in Finance](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1343002)
