/**
 * Regime Detection Example
 * 
 * Demonstrates how to use the HMM-based regime detection
 */

import { detectRegime } from '../src/ml/hmm/detectRegime';

// Generate synthetic price data with different regimes
function generatePriceData(): number[] {
  const prices: number[] = [100];
  
  // Regime 1: Bearish (200 points)
  for (let i = 0; i < 200; i++) {
    const change = (Math.random() - 0.6) * 2; // Downward bias
    prices.push(prices[prices.length - 1] * (1 + change / 100));
  }
  
  // Regime 2: Neutral/Consolidation (100 points)
  for (let i = 0; i < 100; i++) {
    const change = (Math.random() - 0.5) * 1; // Small movements
    prices.push(prices[prices.length - 1] * (1 + change / 100));
  }
  
  // Regime 3: Bullish (200 points)
  for (let i = 0; i < 200; i++) {
    const change = (Math.random() - 0.4) * 2; // Upward bias
    prices.push(prices[prices.length - 1] * (1 + change / 100));
  }
  
  return prices;
}

// Example 1: Basic Usage
console.log('=== Example 1: Basic Regime Detection ===\n');

const prices = generatePriceData();
console.log(`Generated ${prices.length} price points`);
console.log(`Price range: ${Math.min(...prices).toFixed(2)} - ${Math.max(...prices).toFixed(2)}`);

const result = detectRegime(prices);

console.log(`\nCurrent Regime: ${result.currentRegime}`);
console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
console.log(`Total observations after feature extraction: ${result.regimes.length}`);

// Count regime occurrences
const regimeCounts = result.regimes.reduce((acc, regime) => {
  acc[regime] = (acc[regime] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('\nRegime Distribution:');
for (const [regime, count] of Object.entries(regimeCounts)) {
  const percentage = (count / result.regimes.length * 100).toFixed(1);
  console.log(`  ${regime}: ${count} observations (${percentage}%)`);
}

// Example 2: Advanced with Multiple Features
console.log('\n\n=== Example 2: Advanced Features ===\n');

const advancedResult = detectRegime(prices, {
  numStates: 3,
  features: ['returns', 'volatility', 'rsi'],
  featureWindow: 20,
  maxIterations: 100,
});

console.log(`Current Regime: ${advancedResult.currentRegime}`);
console.log(`Confidence: ${(advancedResult.confidence * 100).toFixed(1)}%`);
console.log(`Model Features: ${advancedResult.model.numFeatures}`);
console.log(`Log-Likelihood: ${advancedResult.model.logLikelihood?.toFixed(2)}`);

// Example 3: 4-State Model
console.log('\n\n=== Example 3: 4-State Regime Detection ===\n');

const fourStateResult = detectRegime(prices, {
  numStates: 4,
  stateLabels: ['strong_bearish', 'weak_bearish', 'weak_bullish', 'strong_bullish'],
});

console.log(`Current Regime: ${fourStateResult.currentRegime}`);

const fourStateRegimeCounts = fourStateResult.regimes.reduce((acc, regime) => {
  acc[regime] = (acc[regime] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('\n4-State Regime Distribution:');
for (const [regime, count] of Object.entries(fourStateRegimeCounts)) {
  const percentage = (count / fourStateResult.regimes.length * 100).toFixed(1);
  console.log(`  ${regime}: ${count} observations (${percentage}%)`);
}

// Example 4: Analyze Regime Transitions
console.log('\n\n=== Example 4: Regime Transition Analysis ===\n');

const transitions: Array<{from: string, to: string, index: number}> = [];
for (let i = 1; i < result.regimes.length; i++) {
  if (result.regimes[i] !== result.regimes[i - 1]) {
    transitions.push({
      from: result.regimes[i - 1],
      to: result.regimes[i],
      index: i
    });
  }
}

console.log(`Total regime transitions: ${transitions.length}`);
console.log('\nRecent transitions:');
transitions.slice(-5).forEach(t => {
  console.log(`  Index ${t.index}: ${t.from} → ${t.to}`);
});

// Example 5: State Probabilities Analysis
console.log('\n\n=== Example 5: State Probability Analysis ===\n');

// Analyze last 10 observations
const lastN = 10;
const recentProbs = result.stateProbabilities.slice(-lastN);
const recentRegimes = result.regimes.slice(-lastN);

console.log('Last 10 observations:');
recentProbs.forEach((probs, idx) => {
  const actualIdx = result.stateProbabilities.length - lastN + idx;
  const maxProb = Math.max(...probs);
  
  console.log(`  [${actualIdx}] ${recentRegimes[idx]} (confidence: ${(maxProb * 100).toFixed(1)}%)`);
});

// Example 6: Model Parameters
console.log('\n\n=== Example 6: Model Parameters ===\n');

console.log('Transition Matrix:');
result.model.transitionMatrix.forEach((row, i) => {
  const rowStr = row.map(p => p.toFixed(3)).join(', ');
  console.log(`  State ${i}: [${rowStr}]`);
});

console.log('\nEmission Parameters (means):');
result.model.emissionParams.forEach((params, i) => {
  const meansStr = params.means.map(m => m.toFixed(3)).join(', ');
  console.log(`  State ${i}: [${meansStr}]`);
});

console.log('\n=== Examples Complete ===');

