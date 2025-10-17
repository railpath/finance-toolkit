"""
HMM Battle Tester - Compare TypeScript vs Python HMM Implementations

Tests deterministic components of HMM algorithms:
- Matrix utilities (logSumExp, normalize)
- Statistical functions (Gaussian PDF)
- Forward/Backward/Viterbi algorithms (with fixed parameters)
- Feature extraction

Usage:
    python hmm_battle_tester.py
"""

import json
import subprocess
import sys
import os
from typing import Dict, List, Any
import numpy as np

# Import Python HMM implementations
from hmm_toolkit import (
    log_sum_exp, normalize_rows, normalize_array,
    gaussian_pdf, log_gaussian_pdf, multivariate_gaussian_pdf,
    log_multivariate_gaussian_pdf, standardize,
    forward_algorithm, backward_algorithm, viterbi_algorithm,
    extract_features_default
)


def load_test_data() -> Dict[str, Any]:
    """Load HMM test data."""
    with open('hmm_test_data.json', 'r') as f:
        return json.load(f)


def run_typescript_hmm_function(function_name: str, input_data: Dict[str, Any]) -> Any:
    """
    Run TypeScript HMM function and return result.
    
    Args:
        function_name: Name of the TypeScript function
        input_data: Input parameters
        
    Returns:
        Function result
    """
    # Map function names to module paths and function names
    function_map = {
        'logSumExp': ('ml/utils/matrixUtils', 'logSumExp'),
        'normalizeRows': ('ml/utils/matrixUtils', 'normalizeRows'),
        'normalizeArray': ('ml/utils/matrixUtils', 'normalizeArray'),
        'gaussianPDF': ('ml/utils/statisticsUtils', 'gaussianPDF'),
        'logGaussianPDF': ('ml/utils/statisticsUtils', 'logGaussianPDF'),
        'multivariateGaussianPDF': ('ml/utils/statisticsUtils', 'multivariateGaussianPDF'),
        'logMultivariateGaussianPDF': ('ml/utils/statisticsUtils', 'logMultivariateGaussianPDF'),
        'standardize': ('ml/utils/statisticsUtils', 'standardize'),
        'forwardAlgorithm': ('ml/hmm/algorithms/forward', 'forward'),
        'backwardAlgorithm': ('ml/hmm/algorithms/backward', 'backward'),
        'viterbiAlgorithm': ('ml/hmm/algorithms/viterbi', 'viterbi'),
        'extractFeaturesDefault': ('ml/hmm/core/extractFeatures', 'extractFeatures'),
    }
    
    if function_name not in function_map:
        raise ValueError(f"Unknown function: {function_name}")
    
    module_path, func_name = function_map[function_name]
    
    # Build import statement (absolute path with .js extension)
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
    import_stmt = f"import {{ {func_name} }} from '{project_root}/dist/{module_path}.js';"
    
    # Build function call based on function type
    if function_name == 'logSumExp':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['logValues'])});"
    elif function_name == 'normalizeRows':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['matrix'])});"
    elif function_name == 'normalizeArray':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['array'])});"
    elif function_name == 'gaussianPDF':
        call_stmt = f"const result = {func_name}({input_data['x']}, {input_data['mean']}, {input_data['variance']});"
    elif function_name == 'logGaussianPDF':
        call_stmt = f"const result = {func_name}({input_data['x']}, {input_data['mean']}, {input_data['variance']});"
    elif function_name == 'multivariateGaussianPDF':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['x'])}, {json.dumps(input_data['means'])}, {json.dumps(input_data['variances'])});"
    elif function_name == 'logMultivariateGaussianPDF':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['x'])}, {json.dumps(input_data['means'])}, {json.dumps(input_data['variances'])});"
    elif function_name == 'standardize':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['values'])});"
    elif function_name == 'forwardAlgorithm':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['observations'])}, {json.dumps(input_data['transitionMatrix'])}, {json.dumps(input_data['emissionParams'])}, {json.dumps(input_data['initialProbs'])});"
    elif function_name == 'backwardAlgorithm':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['observations'])}, {json.dumps(input_data['transitionMatrix'])}, {json.dumps(input_data['emissionParams'])}, {json.dumps(input_data['scalingFactors'])});"
    elif function_name == 'viterbiAlgorithm':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['observations'])}, {json.dumps(input_data['transitionMatrix'])}, {json.dumps(input_data['emissionParams'])}, {json.dumps(input_data['initialProbs'])});"
    elif function_name == 'extractFeaturesDefault':
        call_stmt = f"const result = {func_name}({json.dumps(input_data['prices'])}, {{ features: 'default', window: {input_data['window']} }});"
    else:
        call_stmt = f"const result = {func_name}({json.dumps(input_data)});"
    
    test_content = f"""
{import_stmt}
{call_stmt}
console.log(JSON.stringify(result));
"""
    
    # Write temporary test file
    test_file = '/tmp/hmm_ts_test.js'
    with open(test_file, 'w') as f:
        f.write(test_content)
    
    try:
        # Run from project root
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
        result = subprocess.run(
            ['node', test_file],
            capture_output=True,
            text=True,
            cwd=project_root
        )
        
        if result.returncode != 0:
            print(f"TypeScript Error: {result.stderr}")
            return None
        
        return json.loads(result.stdout.strip())
    except Exception as e:
        print(f"Error running TypeScript: {e}")
        return None


def run_python_hmm_function(function_name: str, input_data: Dict[str, Any]) -> Any:
    """Run Python HMM function and return result."""
    try:
        if function_name == 'logSumExp':
            return log_sum_exp(input_data['logValues'])
        elif function_name == 'normalizeRows':
            return normalize_rows(input_data['matrix'])
        elif function_name == 'normalizeArray':
            return normalize_array(input_data['array'])
        elif function_name == 'gaussianPDF':
            return gaussian_pdf(input_data['x'], input_data['mean'], input_data['variance'])
        elif function_name == 'logGaussianPDF':
            return log_gaussian_pdf(input_data['x'], input_data['mean'], input_data['variance'])
        elif function_name == 'multivariateGaussianPDF':
            return multivariate_gaussian_pdf(input_data['x'], input_data['means'], input_data['variances'])
        elif function_name == 'logMultivariateGaussianPDF':
            return log_multivariate_gaussian_pdf(input_data['x'], input_data['means'], input_data['variances'])
        elif function_name == 'standardize':
            return standardize(input_data['values'])
        elif function_name == 'forwardAlgorithm':
            return forward_algorithm(
                input_data['observations'],
                input_data['transitionMatrix'],
                input_data['emissionParams'],
                input_data['initialProbs']
            )
        elif function_name == 'backwardAlgorithm':
            return backward_algorithm(
                input_data['observations'],
                input_data['transitionMatrix'],
                input_data['emissionParams'],
                input_data['scalingFactors']
            )
        elif function_name == 'viterbiAlgorithm':
            return viterbi_algorithm(
                input_data['observations'],
                input_data['transitionMatrix'],
                input_data['emissionParams'],
                input_data['initialProbs']
            )
        elif function_name == 'extractFeaturesDefault':
            return extract_features_default(input_data['prices'], input_data['window'])
        else:
            raise ValueError(f"Unknown function: {function_name}")
    except Exception as e:
        print(f"Python Error in {function_name}: {e}")
        return None


def compare_results(ts_result: Any, py_result: Any, expected: Dict[str, Any], 
                   function_name: str) -> Dict[str, Any]:
    """
    Compare TypeScript and Python results.
    
    Returns:
        Dictionary with comparison results
    """
    if ts_result is None or py_result is None:
        return {'passed': False, 'error': 'One or both results are None'}
    
    atol = 1e-10
    rtol = 1e-6
    
    try:
        # Handle different result types
        if function_name in ['logSumExp', 'gaussianPDF', 'logGaussianPDF', 'multivariateGaussianPDF', 'logMultivariateGaussianPDF']:
            # Single number result
            # Handle -Infinity case
            if ts_result is None and py_result is not None:
                return {'passed': False, 'error': 'TypeScript returned None'}
            
            if isinstance(ts_result, str):
                if ts_result == "-Infinity" or ts_result == "Infinity":
                    return {'passed': False, 'error': f'TypeScript returned string: {ts_result}'}
            
            ts_is_neginf = (isinstance(ts_result, float) and ts_result == float('-inf')) or (isinstance(ts_result, str) and ts_result == '-Infinity')
            py_is_neginf = (isinstance(py_result, float) and py_result == float('-inf'))
            
            if ts_is_neginf and py_is_neginf:
                return {'passed': True, 'difference': 0}
            
            diff = abs(ts_result - py_result)
            rel_diff = diff / (abs(py_result) + 1e-10)
            
            passed = diff < atol or rel_diff < rtol
            
            return {
                'passed': passed,
                'ts_result': ts_result,
                'py_result': py_result,
                'difference': diff,
                'relative_difference': rel_diff
            }
        
        elif function_name in ['normalizeRows', 'normalizeArray', 'standardize', 'extractFeaturesDefault']:
            # Array/matrix result
            ts_arr = np.array(ts_result)
            py_arr = np.array(py_result)
            
            if ts_arr.shape != py_arr.shape:
                return {
                    'passed': False,
                    'error': f'Shape mismatch: TS {ts_arr.shape} vs PY {py_arr.shape}'
                }
            
            diff = np.abs(ts_arr - py_arr)
            max_diff = np.max(diff)
            mean_diff = np.mean(diff)
            
            passed = np.allclose(ts_arr, py_arr, atol=atol, rtol=rtol)
            
            return {
                'passed': passed,
                'max_difference': float(max_diff),
                'mean_difference': float(mean_diff),
                'shape': list(ts_arr.shape)
            }
        
        elif function_name == 'forwardAlgorithm':
            # Check alpha shape
            ts_alpha = np.array(ts_result['alpha'])
            py_alpha = np.array(py_result['alpha'])
            
            alpha_match = np.allclose(ts_alpha, py_alpha, atol=atol, rtol=rtol)
            
            # Check log-likelihood
            ll_diff = abs(ts_result['logLikelihood'] - py_result['logLikelihood'])
            ll_match = ll_diff < atol or ll_diff / (abs(py_result['logLikelihood']) + 1e-10) < rtol
            
            passed = alpha_match and ll_match
            
            return {
                'passed': passed,
                'alpha_max_diff': float(np.max(np.abs(ts_alpha - py_alpha))),
                'logLikelihood_diff': float(ll_diff),
                'ts_logLikelihood': ts_result['logLikelihood'],
                'py_logLikelihood': py_result['logLikelihood']
            }
        
        elif function_name == 'backwardAlgorithm':
            ts_beta = np.array(ts_result['beta'])
            py_beta = np.array(py_result['beta'])
            
            passed = np.allclose(ts_beta, py_beta, atol=atol, rtol=rtol)
            
            return {
                'passed': passed,
                'beta_max_diff': float(np.max(np.abs(ts_beta - py_beta))),
                'shape': list(ts_beta.shape)
            }
        
        elif function_name == 'viterbiAlgorithm':
            # Check path
            path_match = ts_result['path'] == py_result['path']
            
            # Check log probability
            ll_diff = abs(ts_result['logProbability'] - py_result['logProbability'])
            ll_match = ll_diff < atol or ll_diff / (abs(py_result['logProbability']) + 1e-10) < rtol
            
            passed = path_match and ll_match
            
            return {
                'passed': passed,
                'path_match': path_match,
                'logProbability_diff': float(ll_diff),
                'ts_path': ts_result['path'],
                'py_path': py_result['path']
            }
        
        else:
            return {'passed': False, 'error': 'Unknown comparison type'}
    
    except Exception as e:
        return {'passed': False, 'error': str(e)}


def run_tests():
    """Run all HMM battle tests."""
    print("=" * 80)
    print("HMM BATTLE TESTING - TypeScript vs Python (scipy/numpy)")
    print("=" * 80)
    print()
    
    test_data = load_test_data()
    
    total_tests = 0
    passed_tests = 0
    failed_tests = []
    
    for function_name, test_cases in test_data['test_cases'].items():
        print(f"\n📊 Testing {function_name}")
        print("-" * 80)
        
        for test_case in test_cases:
            total_tests += 1
            test_name = test_case['test_name']
            description = test_case['description']
            input_data = test_case['input']
            expected = test_case['expected']
            
            print(f"  ⚙️  {test_name}: {description}")
            
            # Run TypeScript
            ts_result = run_typescript_hmm_function(function_name, input_data)
            
            # Run Python
            py_result = run_python_hmm_function(function_name, input_data)
            
            # Compare
            comparison = compare_results(ts_result, py_result, expected, function_name)
            
            if comparison['passed']:
                print(f"  ✅ PASSED")
                passed_tests += 1
            else:
                print(f"  ❌ FAILED")
                print(f"     Error: {comparison.get('error', 'Results do not match')}")
                if 'difference' in comparison:
                    print(f"     Difference: {comparison['difference']:.2e}")
                if 'max_difference' in comparison:
                    print(f"     Max Difference: {comparison['max_difference']:.2e}")
                
                failed_tests.append({
                    'function': function_name,
                    'test': test_name,
                    'comparison': comparison
                })
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total Tests: {total_tests}")
    print(f"✅ Passed: {passed_tests} ({passed_tests/total_tests*100:.1f}%)")
    print(f"❌ Failed: {len(failed_tests)} ({len(failed_tests)/total_tests*100:.1f}%)")
    
    if failed_tests:
        print("\n" + "=" * 80)
        print("FAILED TESTS DETAILS")
        print("=" * 80)
        for failed in failed_tests:
            print(f"\n{failed['function']} - {failed['test']}")
            print(f"  {failed['comparison']}")
    
    return passed_tests == total_tests


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)

