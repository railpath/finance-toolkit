# HMM Battle Testing

Battle testing for Hidden Markov Model implementations - comparing TypeScript against Python (numpy/scipy).

## Overview

This framework tests the **mathematical correctness** of HMM algorithms by comparing TypeScript implementations against battle-tested Python libraries (scipy, numpy).

## What We Test

### ✅ Deterministic Components

These components produce identical results given the same inputs:

#### 1. **Matrix Utilities**
- `logSumExp` - Numerically stable log-sum-exp
- `normalizeRows` - Row-wise matrix normalization
- `normalizeArray` - Array normalization

#### 2. **Statistical Functions**
- `gaussianPDF` - Gaussian probability density function
- `logGaussianPDF` - Log of Gaussian PDF
- `multivariateGaussianPDF` - Independent multivariate Gaussian
- `logMultivariateGaussianPDF` - Log version
- `standardize` - Z-score normalization

#### 3. **HMM Algorithms (with fixed parameters)**
- `forwardAlgorithm` - Forward probabilities with scaling
- `backwardAlgorithm` - Backward probabilities with scaling
- `viterbiAlgorithm` - Most likely state sequence (log-space)

#### 4. **Feature Extraction**
- `extractFeaturesDefault` - Returns + volatility extraction and standardization

### ⚠️ Non-Deterministic Components

These are **NOT tested** for exact values because they involve random initialization:

- **Baum-Welch Training** - EM algorithm with random initialization
- **detectRegime** - Full pipeline including training

For these, we only test:
- Output structure is correct
- Results are reasonable (e.g., probabilities sum to 1)
- No errors or crashes

## Python Implementation

Uses battle-tested libraries:

```python
import numpy as np           # Array operations
from scipy import stats      # Statistical functions (norm.pdf, norm.logpdf)
from scipy.special import logsumexp  # Numerically stable log-sum-exp
```

All mathematical operations leverage scipy/numpy implementations that are:
- ✅ **Battle-tested** across millions of users
- ✅ **Optimized** for performance and stability
- ✅ **Verified** against mathematical definitions

## Test Data Structure

Located in `hmm_test_data.json`:

```json
{
  "functionName": [
    {
      "test_name": "descriptive_name",
      "description": "What this tests",
      "input": {
        "param1": value1,
        "param2": value2
      },
      "expected": {
        "result": expectedValue
      }
    }
  ]
}
```

## Running Tests

### Prerequisites

```bash
# Install Python dependencies
pip install -r requirements.txt

# Build TypeScript project
cd ../.. && npm run build && cd testing/battle-testing
```

### Run HMM Battle Tests

```bash
python hmm_battle_tester.py
```

### Expected Output

```
================================================================================
HMM BATTLE TESTING - TypeScript vs Python (scipy/numpy)
================================================================================

📊 Testing logSumExp
--------------------------------------------------------------------------------
  ⚙️  basic_log_sum_exp: Basic log-sum-exp calculation
  ✅ PASSED
  ⚙️  large_negative_values: Numerically challenging large negative values
  ✅ PASSED

📊 Testing gaussianPDF
--------------------------------------------------------------------------------
  ⚙️  standard_normal_at_zero: Standard normal PDF at x=0
  ✅ PASSED

...

================================================================================
SUMMARY
================================================================================
Total Tests: 15
✅ Passed: 15 (100.0%)
❌ Failed: 0 (0.0%)
```

## Tolerance Levels

- **Absolute Tolerance**: `1e-10` (0.0000000001)
- **Relative Tolerance**: `1e-6` (0.000001)

These tolerances account for:
- Floating-point precision differences
- Different numerical algorithms (e.g., log-sum-exp implementations)
- Compiler optimizations

## Test Coverage

| Component | Tests | Status |
|-----------|-------|--------|
| Matrix Utils | 4 | ✅ |
| Statistical Functions | 5 | ✅ |
| Forward Algorithm | 1 | ✅ |
| Backward Algorithm | 1 | ✅ |
| Viterbi Algorithm | 1 | ✅ |
| Feature Extraction | 1 | ✅ |
| **Total** | **13+** | **✅** |

## Why Battle Testing Matters

### Mathematical Correctness
Battle testing ensures our TypeScript implementations:
1. Match scipy/numpy's mathematically verified algorithms
2. Handle edge cases correctly (empty arrays, zero values, etc.)
3. Maintain numerical stability

### Confidence in Results
When TypeScript matches Python:
- ✅ Algorithms are implemented correctly
- ✅ Mathematical formulas are accurate
- ✅ Numerical stability is maintained

### Catching Bugs Early
Battle testing catches:
- Implementation errors
- Numerical precision issues
- Edge case handling problems
- Algorithm logic mistakes

## Files

```
testing/battle-testing/
├── hmm_toolkit.py              # Python implementations (scipy/numpy)
├── hmm_battle_tester.py        # Test runner
├── hmm_test_data.json          # Test cases
├── HMM_BATTLE_TESTING.md       # This file
└── requirements.txt            # numpy, scipy, pandas
```

## Adding New Tests

1. **Add test case** to `hmm_test_data.json`:
```json
{
  "functionName": [{
    "test_name": "my_test",
    "description": "Tests X",
    "input": {...},
    "expected": {...}
  }]
}
```

2. **Implement Python version** in `hmm_toolkit.py` (if new function)

3. **Update function maps** in `hmm_battle_tester.py`

4. **Run tests**: `python hmm_battle_tester.py`

## Limitations

### Not Testing
- **Non-deterministic algorithms**: Baum-Welch, full regime detection
- **Performance**: Only correctness, not speed
- **Integration**: Only individual components

### Why?
- HMM training involves random initialization → different local optima
- We test mathematical correctness, not convergence behavior
- For non-deterministic parts: unit tests verify structure/reasonableness

## Success Criteria

✅ **All deterministic components pass** with < 1e-6 relative error  
✅ **Forward/Backward match** scipy's numerical stability  
✅ **Viterbi paths match** for same parameters  
✅ **Feature extraction matches** numpy's standardization  

## Future Enhancements

- [ ] Test more edge cases (NaN, Inf handling)
- [ ] Add stress tests (large matrices, many states)
- [ ] Performance benchmarking
- [ ] Convergence analysis for Baum-Welch
- [ ] Integration tests with real market data

