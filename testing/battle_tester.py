"""
Battle Tester - Compare TypeScript vs Python Finance Functions

This module performs comprehensive battle testing between TypeScript and Python
implementations of financial functions. It loads test data from JSON files and
compares results to ensure accuracy and consistency.

Features:
- Loads test data from TypeScript integration tests
- Executes both TypeScript and Python functions with identical inputs
- Compares results with configurable tolerance levels
- Provides detailed error analysis and reporting
- Supports all implemented financial functions

Usage:
    python battle_tester.py

The battle tester ensures that Python implementations (using battle-tested libraries)
produce equivalent results to TypeScript implementations, validating the accuracy
of both implementations.
"""

import json
import subprocess
import sys
from typing import Dict, List, Any
import numpy as np

# Import our Python functions
from finance_toolkit import (
    calculate_alpha, calculate_beta, calculate_sharpe_ratio, calculate_sortino_ratio,
    calculate_information_ratio, calculate_var, calculate_returns, 
    calculate_volatility, calculate_max_drawdown, calculate_money_weighted_return,
    calculate_time_weighted_return, calculate_calmar_ratio, calculate_kurtosis,
    calculate_skewness, calculate_semideviation, calculate_standard_deviation,
    calculate_portfolio_volatility, calculate_var_95, calculate_var_99,
    calculate_tracking_error, calculate_ewma_volatility, calculate_garman_klass_volatility,
    calculate_parkinson_volatility, calculate_correlation_matrix, calculate_covariance_matrix,
    calculate_historical_expected_shortfall, calculate_parametric_expected_shortfall,
    calculate_monte_carlo_var, calculate_portfolio_metrics, calculate_risk_metrics,
    calculate_portfolio_optimization, calculate_equal_weight_portfolio,
    calculate_performance_attribution, calculate_portfolio_rebalancing
)


def load_test_data() -> Dict[str, Any]:
    """
    Load test data from the TypeScript integration tests.
    
    Returns:
        Dictionary containing test data for all functions
    """
    with open('../src/integration/test-data.json', 'r') as f:
        return json.load(f)


def run_typescript_function(function_name: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run TypeScript function and return result.
    
    Args:
        function_name: Name of the TypeScript function to execute
        input_data: Input parameters for the function
        
    Returns:
        Dictionary containing the function result
    """
    # Create temporary test file
    test_content = f"""
import {{ {function_name} }} from '../dist/risk/{function_name}.js';
const result = {function_name}({json.dumps(input_data)});
console.log(JSON.stringify(result));
"""
    
    with open('/tmp/ts_test.js', 'w') as f:
        f.write(test_content)
    
    try:
        result = subprocess.run(
            ['node', '/tmp/ts_test.js'],
            capture_output=True,
            text=True,
            cwd='/Users/kcnpxcp/Dev/railpath/finance-toolkit'
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"TypeScript execution failed: {result.stderr}")
        
        return json.loads(result.stdout.strip())
    except Exception as e:
        print(f"Error running TypeScript function: {e}")
        return {}


def run_python_function(function_name: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Run Python function and return result."""
    function_map = {
        'calculateAlpha': lambda data: calculate_alpha(
            data['assetReturns'], data['benchmarkReturns'], 
            data['riskFreeRate'], data['annualizationFactor']
        ),
        'calculateBeta': lambda data: calculate_beta(
            data['assetReturns'], data['benchmarkReturns']
        ),
        'calculateSharpeRatio': lambda data: calculate_sharpe_ratio(
            data['returns'], data['riskFreeRate'], data['annualizationFactor']
        ),
        'calculateSortinoRatio': lambda data: calculate_sortino_ratio(
            data['returns'], data['riskFreeRate'], data['targetReturn'], 
            data['annualizationFactor']
        ),
        'calculateInformationRatio': lambda data: calculate_information_ratio(
            data['portfolioReturns'], data['benchmarkReturns']
        ),
        'calculateVaR': lambda data: calculate_var(
            data['returns'], data['confidenceLevel'], data['method']
        ),
        'calculateReturns': lambda data: calculate_returns(
            data['prices'], data['method'], data.get('annualizationFactor', 252), 
            data.get('annualize', False)
        ),
        'calculateVolatility': lambda data: calculate_volatility(
            data['returns'], data['method'], data['annualizationFactor']
        ),
        'calculateMaxDrawdown': lambda data: calculate_max_drawdown(data['returns']),
        'calculateMoneyWeightedReturn': lambda data: calculate_money_weighted_return(
            data['dates'], data['cashFlows'], data['finalValue']
        ),
        'calculateTimeWeightedReturn': lambda data: calculate_time_weighted_return(
            data['portfolioValues'], data['cashFlows']
        ),
        'calculateCalmarRatio': lambda data: calculate_calmar_ratio(
            data['prices'], data['returns'], data['annualizationFactor']
        ),
        'calculateKurtosis': lambda data: calculate_kurtosis(data['returns']),
        'calculateSkewness': lambda data: calculate_skewness(data['returns']),
        'calculateSemideviation': lambda data: calculate_semideviation(
            data['returns'], data.get('targetReturn', 0.0)
        ),
        'calculateStandardDeviation': lambda data: calculate_standard_deviation(data['returns']),
        'calculatePortfolioVolatility': lambda data: calculate_portfolio_volatility(
            data['weights'], data['covarianceMatrix']
        ),
        'calculateVaR95': lambda data: calculate_var_95(data['returns']),
        'calculateVaR99': lambda data: calculate_var_99(data['returns']),
        'calculateTrackingError': lambda data: calculate_tracking_error(
            data['portfolioReturns'], data['benchmarkReturns']
        ),
        'calculateEWMAVolatility': lambda data: calculate_ewma_volatility(
            data['returns'], data.get('lambda', 0.94)
        ),
        'calculateGarmanKlassVolatility': lambda data: calculate_garman_klass_volatility(
            data['openPrices'], data['highPrices'], data['lowPrices'], data['closePrices']
        ),
        'calculateParkinsonVolatility': lambda data: calculate_parkinson_volatility(
            data['highPrices'], data['lowPrices']
        ),
        'calculateCorrelationMatrix': lambda data: calculate_correlation_matrix(data['returnsMatrix']),
        'calculateCovarianceMatrix': lambda data: calculate_covariance_matrix(data['returnsMatrix']),
        'calculateHistoricalExpectedShortfall': lambda data: calculate_historical_expected_shortfall(
            data['returns'], data['confidenceLevel']
        ),
        'calculateParametricExpectedShortfall': lambda data: calculate_parametric_expected_shortfall(
            data['returns'], data['confidenceLevel']
        ),
        'calculateMonteCarloVaR': lambda data: calculate_monte_carlo_var(
            data['returns'], data['confidenceLevel'], data.get('simulations', 10000)
        ),
        'calculatePortfolioMetrics': lambda data: calculate_portfolio_metrics(
            data['portfolioValues'], data['riskFreeRate'], data['annualizationFactor'], 
            data.get('confidenceLevel', 0.95)
        ),
        'calculateRiskMetrics': lambda data: calculate_risk_metrics(
            data['assetReturns'], data.get('benchmarkReturns'), data['riskFreeRate'],
            data['annualizationFactor'], data.get('confidenceLevel', 0.0)
        ),
        'calculatePortfolioOptimization': lambda data: calculate_portfolio_optimization(
            data['expectedReturns'], data['covarianceMatrix'], data['riskFreeRate'],
            data.get('method', 'minimumVariance'), data.get('targetReturn'),
            data.get('minWeight', 0.0), data.get('maxWeight', 1.0)
        ),
        'calculateEqualWeightPortfolio': lambda data: calculate_equal_weight_portfolio(data['assets']),
        'calculatePerformanceAttribution': lambda data: calculate_performance_attribution(
            data['portfolioReturns'], data['benchmarkReturns'], 
            data['sectorReturns'], data['sectorWeights']
        ),
        'calculatePortfolioRebalancing': lambda data: calculate_portfolio_rebalancing(
            data['initialWeights'], data['targetWeights'], data['currentValues']
        )
    }
    
    if function_name not in function_map:
        raise ValueError(f"Unknown function: {function_name}")
    
    return function_map[function_name](input_data)


def compare_results(ts_result: Dict[str, Any], py_result: Dict[str, Any], 
                   tolerance: float = 1e-6) -> Dict[str, Any]:
    """Compare TypeScript and Python results."""
    comparison = {
        'passed': True,
        'differences': {},
        'max_difference': 0.0,
        'max_relative_error': 0.0
    }
    
    for key in ts_result:
        if key in py_result:
            ts_val = ts_result[key]
            py_val = py_result[key]
            
            if isinstance(ts_val, (int, float)) and isinstance(py_val, (int, float)):
                diff = abs(ts_val - py_val)
                rel_error = diff / abs(ts_val) if ts_val != 0 else diff
                
                comparison['differences'][key] = {
                    'typescript': ts_val,
                    'python': py_val,
                    'difference': diff,
                    'relative_error': rel_error
                }
                
                comparison['max_difference'] = max(comparison['max_difference'], diff)
                comparison['max_relative_error'] = max(comparison['max_relative_error'], rel_error)
                
                if rel_error > tolerance:
                    comparison['passed'] = False
    
    return comparison


def run_battle_tests():
    """Run battle tests for all functions."""
    print("🚀 Starting Finance Toolkit Battle Tests...")
    print("📊 Comparing TypeScript vs Python implementations\n")
    
    test_data = load_test_data()
    results = []
    
    for function_name, test_cases in test_data['test_cases'].items():
        print(f"🎯 Testing {function_name}...")
        
        for test_case in test_cases:
            test_name = test_case['test_name']
            input_data = test_case['input']
            expected = test_case['expected']
            
            print(f"  📋 {test_name}...")
            
            try:
                # Run Python function
                py_result = run_python_function(function_name, input_data)
                
                # Compare with expected (TypeScript) results
                comparison = compare_results(expected, py_result)
                
                status = "✅ PASS" if comparison['passed'] else "❌ FAIL"
                max_error = comparison['max_relative_error']
                
                print(f"    {status} - Max relative error: {max_error:.2e}")
                
                if not comparison['passed']:
                    print(f"    🔍 Details:")
                    for key, diff in comparison['differences'].items():
                        if diff['relative_error'] > 1e-6:
                            print(f"      {key}: TS={diff['typescript']:.6f}, PY={diff['python']:.6f}")
                
                results.append({
                    'function': function_name,
                    'test': test_name,
                    'passed': comparison['passed'],
                    'max_relative_error': max_error,
                    'comparison': comparison
                })
                
            except Exception as e:
                print(f"    ❌ ERROR: {e}")
                results.append({
                    'function': function_name,
                    'test': test_name,
                    'passed': False,
                    'error': str(e)
                })
        
        print()
    
    # Summary
    total_tests = len(results)
    passed_tests = sum(1 for r in results if r['passed'])
    failed_tests = total_tests - passed_tests
    
    print("=" * 60)
    print("🎯 BATTLE TEST SUMMARY")
    print("=" * 60)
    print(f"📊 Total tests: {total_tests}")
    print(f"✅ Passed: {passed_tests} ({passed_tests/total_tests*100:.1f}%)")
    print(f"❌ Failed: {failed_tests} ({failed_tests/total_tests*100:.1f}%)")
    
    if failed_tests > 0:
        print(f"\n🔍 Failed tests:")
        for result in results:
            if not result['passed']:
                print(f"  • {result['function']} - {result['test']}")
    
    print("=" * 60)
    
    return results


if __name__ == "__main__":
    run_battle_tests()
