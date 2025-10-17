# Battle Testing Setup Guide

## Prerequisites

### Install Python Dependencies

Due to macOS externally-managed Python environment, you have several options:

### Option 1: Using Homebrew (Recommended)

```bash
brew install numpy scipy
```

### Option 2: Using pip with --break-system-packages

```bash
pip3 install --break-system-packages numpy scipy pandas
```

### Option 3: Using Virtual Environment

```bash
cd testing/battle-testing
python3 -m venv venv
source venv/bin/activate
pip install numpy scipy pandas
```

### Option 4: Check if already installed

```bash
python3 -c "import numpy, scipy, pandas; print('✅ All dependencies available')"
```

## Running Tests

### Standard Finance Functions (38 functions)

```bash
cd testing/battle-testing
python3 battle_tester.py
```

### HMM Functions (13+ tests)

```bash
cd testing/battle-testing

# First, ensure TypeScript is built
cd ../..
npm run build
cd testing/battle-testing

# Run HMM battle tests
python3 hmm_battle_tester.py
```

## Expected Test Output

### HMM Battle Tests

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
  ⚙️  empty_array: Edge case: empty array
  ✅ PASSED

📊 Testing normalizeRows
--------------------------------------------------------------------------------
  ⚙️  basic_normalization: Normalize 2x3 matrix rows
  ✅ PASSED
  ⚙️  zero_row: Handle zero row with uniform distribution
  ✅ PASSED

📊 Testing gaussianPDF
--------------------------------------------------------------------------------
  ⚙️  standard_normal_at_zero: Standard normal PDF at x=0
  ✅ PASSED
  ⚙️  shifted_gaussian: Gaussian with mean=1, var=0.5 at x=1
  ✅ PASSED

📊 Testing forwardAlgorithm
--------------------------------------------------------------------------------
  ⚙️  simple_2_state_hmm: Forward algorithm with 2 states, 3 observations
  ✅ PASSED

📊 Testing viterbiAlgorithm
--------------------------------------------------------------------------------
  ⚙️  simple_2_state_hmm: Viterbi algorithm finds most likely path
  ✅ PASSED

================================================================================
SUMMARY
================================================================================
Total Tests: 13
✅ Passed: 13 (100.0%)
❌ Failed: 0 (0.0%)
```

## Troubleshooting

### SSL Certificate Issues

If you get SSL errors during pip install:

```bash
# Install certificates (macOS)
/Applications/Python\ 3.*/Install\ Certificates.command

# Or use Homebrew (bypasses pip)
brew install scipy
```

### Module Not Found

If Python can't find modules:

```bash
# Check what's installed
pip3 list | grep -E "numpy|scipy|pandas"

# Check Python path
python3 -c "import sys; print('\n'.join(sys.path))"
```

### Virtual Environment Issues

```bash
# Remove and recreate venv
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install numpy scipy pandas
```

## Files Created

- `hmm_toolkit.py` - Python implementations with scipy/numpy
- `hmm_battle_tester.py` - Test runner
- `hmm_test_data.json` - Test cases
- `HMM_BATTLE_TESTING.md` - Documentation
- `SETUP.md` - This file

## Quick Start (After Dependencies Installed)

```bash
# From project root
npm run build

# Run HMM battle tests
cd testing/battle-testing
python3 hmm_battle_tester.py
```

## What Gets Tested

✅ Matrix Utils (logSumExp, normalize)  
✅ Statistical Functions (Gaussian PDF, standardize)  
✅ Forward Algorithm  
✅ Backward Algorithm  
✅ Viterbi Algorithm  
✅ Feature Extraction  

All tests compare TypeScript implementations against scipy/numpy (battle-tested libraries).

