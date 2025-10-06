# Testing Framework

This directory contains comprehensive testing tools for the @railpath/finance-toolkit.

## Directory Structure

### [Integration Tests](integration/)
- **TypeScript validation** - Tests all functions with comprehensive test data
- **Ground truth establishment** - Creates reference results for battle testing
- **Test data foundation** - JSON test cases used by both TypeScript and Python

### [Battle Testing](battle-testing/)
- **Python vs TypeScript comparison** - Ensures accuracy by comparing implementations
- **Battle-tested libraries** - Uses numpy, scipy, pandas as ground truth
- **Comprehensive validation** - Tests all 38+ functions across different scenarios

### [Performance Testing](performance/)
- **Benchmark Suite** - Performance testing for different dataset sizes
- **Memory Profiling** - Resource usage analysis
- **Regression Detection** - Performance monitoring across versions

## Quick Start

### Integration Tests
```bash
npm run test:integration
```

### Battle Testing
```bash
cd battle-testing
pip install -r requirements.txt
python battle_tester.py
```

### Performance Testing
```bash
npm run test:performance
```

## Test Coverage

- **Unit Tests**: 1160 tests across 53 test files (in `src/`)
- **Integration Tests**: Comprehensive function validation
- **Battle Tests**: Python vs TypeScript accuracy verification
- **Performance Tests**: Speed and memory benchmarks

## Configuration

Each testing framework has its own configuration and documentation in its respective directory.

## Results

Test results are automatically generated and stored in respective `results/` directories for analysis and tracking over time.
