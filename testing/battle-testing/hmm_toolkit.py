"""
Python HMM Toolkit - Battle Testing Equivalents

Provides Python implementations of HMM algorithms using numpy/scipy
for battle testing against TypeScript implementations.

Tests focus on deterministic components:
- Matrix utilities (logSumExp, normalize)
- Statistical functions (Gaussian PDF)
- Forward algorithm (with fixed parameters)
- Backward algorithm (with fixed parameters)
- Viterbi algorithm (with fixed parameters)
- Feature extraction (deterministic transformations)

Non-deterministic components (Baum-Welch training) are tested
for output structure and reasonableness, not exact values.
"""

import numpy as np
from scipy import stats
from typing import Dict, List, Tuple, Any


# ============================================================================
# Matrix Utilities
# ============================================================================

def log_sum_exp(log_values: List[float]) -> float:
    """
    Log-Sum-Exp trick for numerical stability.
    
    Uses numpy's logsumexp which is battle-tested and optimized.
    
    Args:
        log_values: Array of log values
        
    Returns:
        log(sum(exp(log_values)))
    """
    if len(log_values) == 0:
        return float('-inf')
    
    log_values = np.array(log_values)
    
    # Use scipy's logsumexp for battle-tested implementation
    from scipy.special import logsumexp
    return logsumexp(log_values)


def normalize_rows(matrix: List[List[float]]) -> List[List[float]]:
    """
    Normalize matrix rows to sum to 1.
    
    Args:
        matrix: Input matrix
        
    Returns:
        Matrix with normalized rows
    """
    result = []
    for row in matrix:
        row = np.array(row)
        row_sum = row.sum()
        
        if row_sum == 0 or not np.isfinite(row_sum):
            # Uniform distribution for zero rows (maximum entropy)
            result.append([1.0 / len(row)] * len(row))
        else:
            result.append((row / row_sum).tolist())
    
    return result


def normalize_array(arr: List[float]) -> List[float]:
    """
    Normalize array to sum to 1.
    
    Args:
        arr: Input array
        
    Returns:
        Normalized array
    """
    arr = np.array(arr)
    total = arr.sum()
    
    if total == 0:
        return [1.0 / len(arr)] * len(arr)
    
    normalized = arr / total
    return normalized.tolist()


# ============================================================================
# Statistical Functions
# ============================================================================

def gaussian_pdf(x: float, mean: float, variance: float) -> float:
    """
    Gaussian probability density function.
    
    Uses scipy.stats.norm which is battle-tested.
    
    Args:
        x: Value to evaluate
        mean: Mean of the Gaussian
        variance: Variance of the Gaussian
        
    Returns:
        PDF value
    """
    if variance <= 0:
        raise ValueError('Variance must be positive')
    
    std_dev = np.sqrt(variance)
    return stats.norm.pdf(x, loc=mean, scale=std_dev)


def log_gaussian_pdf(x: float, mean: float, variance: float) -> float:
    """
    Log of Gaussian PDF for numerical stability.
    
    Args:
        x: Value to evaluate
        mean: Mean of the Gaussian
        variance: Variance of the Gaussian
        
    Returns:
        Log PDF value
    """
    if variance <= 0:
        raise ValueError('Variance must be positive')
    
    std_dev = np.sqrt(variance)
    return stats.norm.logpdf(x, loc=mean, scale=std_dev)


def multivariate_gaussian_pdf(x: List[float], means: List[float], 
                               variances: List[float]) -> float:
    """
    Multivariate Gaussian PDF with independent features.
    
    Args:
        x: Feature vector
        means: Mean for each feature
        variances: Variance for each feature
        
    Returns:
        PDF value
    """
    if len(x) != len(means) or len(x) != len(variances):
        raise ValueError('Dimension mismatch')
    
    product = 1.0
    for i in range(len(x)):
        product *= gaussian_pdf(x[i], means[i], variances[i])
    
    return product


def log_multivariate_gaussian_pdf(x: List[float], means: List[float],
                                   variances: List[float]) -> float:
    """
    Log of multivariate Gaussian PDF.
    
    Args:
        x: Feature vector
        means: Mean for each feature
        variances: Variance for each feature
        
    Returns:
        Log PDF value
    """
    if len(x) != len(means) or len(x) != len(variances):
        raise ValueError('Dimension mismatch')
    
    log_sum = 0.0
    for i in range(len(x)):
        log_sum += log_gaussian_pdf(x[i], means[i], variances[i])
    
    return log_sum


def standardize(values: List[float]) -> List[float]:
    """
    Standardize values (z-score normalization).
    
    Uses numpy for battle-tested implementation.
    
    Args:
        values: Array of numbers
        
    Returns:
        Standardized values
    """
    if len(values) == 0:
        return []
    
    values = np.array(values)
    mean = np.mean(values)
    std = np.std(values, ddof=0)  # Population std like TypeScript
    
    if std == 0:
        return [0.0] * len(values)
    
    standardized = (values - mean) / std
    return standardized.tolist()


# ============================================================================
# HMM Algorithms
# ============================================================================

def forward_algorithm(observations: List[List[float]], 
                     transition_matrix: List[List[float]],
                     emission_params: List[Dict[str, List[float]]],
                     initial_probs: List[float]) -> Dict[str, Any]:
    """
    Forward algorithm with scaling.
    
    Args:
        observations: T x D matrix of observations
        transition_matrix: N x N transition probability matrix
        emission_params: List of emission parameters (means, variances) for each state
        initial_probs: Initial state probabilities
        
    Returns:
        Dictionary with alpha, scaling_factors, and log_likelihood
    """
    T = len(observations)
    N = len(initial_probs)
    
    # Initialize
    alpha = np.zeros((T, N))
    scaling_factors = np.zeros(T)
    
    # t = 0: Initialize
    for i in range(N):
        emission_prob = np.exp(log_multivariate_gaussian_pdf(
            observations[0],
            emission_params[i]['means'],
            emission_params[i]['variances']
        ))
        alpha[0, i] = initial_probs[i] * emission_prob
    
    # Scale
    scaling_factors[0] = alpha[0].sum()
    if scaling_factors[0] > 0:
        alpha[0] /= scaling_factors[0]
    
    # t = 1..T-1: Recursion
    for t in range(1, T):
        for j in range(N):
            sum_val = 0.0
            for i in range(N):
                sum_val += alpha[t-1, i] * transition_matrix[i][j]
            
            emission_prob = np.exp(log_multivariate_gaussian_pdf(
                observations[t],
                emission_params[j]['means'],
                emission_params[j]['variances']
            ))
            
            alpha[t, j] = sum_val * emission_prob
        
        # Scale
        scaling_factors[t] = alpha[t].sum()
        if scaling_factors[t] > 0:
            alpha[t] /= scaling_factors[t]
    
    # Calculate log-likelihood
    log_likelihood = np.sum(np.log(scaling_factors[scaling_factors > 0]))
    
    return {
        'alpha': alpha.tolist(),
        'scalingFactors': scaling_factors.tolist(),
        'logLikelihood': float(log_likelihood)
    }


def backward_algorithm(observations: List[List[float]],
                      transition_matrix: List[List[float]],
                      emission_params: List[Dict[str, List[float]]],
                      scaling_factors: List[float]) -> Dict[str, Any]:
    """
    Backward algorithm with scaling.
    
    Args:
        observations: T x D matrix of observations
        transition_matrix: N x N transition probability matrix
        emission_params: List of emission parameters for each state
        scaling_factors: Scaling factors from forward algorithm
        
    Returns:
        Dictionary with beta values
    """
    T = len(observations)
    N = len(transition_matrix)
    
    # Initialize
    beta = np.zeros((T, N))
    
    # t = T-1: Initialize
    beta[T-1] = 1.0
    
    # Scale
    if scaling_factors[T-1] > 0:
        beta[T-1] /= scaling_factors[T-1]
    
    # t = T-2..0: Recursion (backward)
    for t in range(T-2, -1, -1):
        for i in range(N):
            sum_val = 0.0
            for j in range(N):
                emission_prob = np.exp(log_multivariate_gaussian_pdf(
                    observations[t+1],
                    emission_params[j]['means'],
                    emission_params[j]['variances']
                ))
                sum_val += transition_matrix[i][j] * emission_prob * beta[t+1, j]
            
            beta[t, i] = sum_val
        
        # Scale
        if scaling_factors[t] > 0:
            beta[t] /= scaling_factors[t]
    
    return {
        'beta': beta.tolist()
    }


def viterbi_algorithm(observations: List[List[float]],
                     transition_matrix: List[List[float]],
                     emission_params: List[Dict[str, List[float]]],
                     initial_probs: List[float]) -> Dict[str, Any]:
    """
    Viterbi algorithm in log-space.
    
    Args:
        observations: T x D matrix of observations
        transition_matrix: N x N transition probability matrix
        emission_params: List of emission parameters for each state
        initial_probs: Initial state probabilities
        
    Returns:
        Dictionary with path and log_probability
    """
    T = len(observations)
    N = len(initial_probs)
    
    # Convert to log probabilities
    log_initial = np.log(np.maximum(initial_probs, 1e-300))
    log_transition = np.log(np.maximum(transition_matrix, 1e-300))
    
    # Initialize
    delta = np.full((T, N), -np.inf)
    psi = np.zeros((T, N), dtype=int)
    
    # t = 0: Initialize
    for i in range(N):
        log_emission = log_multivariate_gaussian_pdf(
            observations[0],
            emission_params[i]['means'],
            emission_params[i]['variances']
        )
        delta[0, i] = log_initial[i] + log_emission
    
    # t = 1..T-1: Recursion
    for t in range(1, T):
        for j in range(N):
            max_prob = -np.inf
            max_state = 0
            
            for i in range(N):
                prob = delta[t-1, i] + log_transition[i][j]
                if prob > max_prob:
                    max_prob = prob
                    max_state = i
            
            log_emission = log_multivariate_gaussian_pdf(
                observations[t],
                emission_params[j]['means'],
                emission_params[j]['variances']
            )
            
            delta[t, j] = max_prob + log_emission
            psi[t, j] = max_state
    
    # Termination: Find best final state
    max_prob = -np.inf
    best_final_state = 0
    for i in range(N):
        if delta[T-1, i] > max_prob:
            max_prob = delta[T-1, i]
            best_final_state = i
    
    # Backtrack
    path = [0] * T
    path[T-1] = best_final_state
    
    for t in range(T-2, -1, -1):
        path[t] = psi[t+1, path[t+1]]
    
    return {
        'path': path,
        'logProbability': float(max_prob)
    }


# ============================================================================
# Feature Extraction
# ============================================================================

def calculate_returns(prices: List[float]) -> List[float]:
    """Calculate simple returns."""
    prices = np.array(prices)
    returns = (prices[1:] - prices[:-1]) / prices[:-1]
    return returns.tolist()


def calculate_rolling_volatility(prices: List[float], window: int) -> List[float]:
    """Calculate rolling volatility."""
    returns = calculate_returns(prices)
    returns = np.array(returns)
    
    volatilities = []
    for i in range(window-1, len(returns)):
        window_returns = returns[i-window+1:i+1]
        vol = np.std(window_returns, ddof=0)  # Population std
        volatilities.append(vol)
    
    return volatilities


def extract_features_default(prices: List[float], window: int = 20) -> List[List[float]]:
    """
    Extract default features (returns + volatility).
    
    Args:
        prices: Array of prices
        window: Window size for rolling volatility
        
    Returns:
        T x 2 matrix of standardized features
    """
    returns = calculate_returns(prices)
    volatilities = calculate_rolling_volatility(prices, window)
    
    # Align lengths
    min_length = len(volatilities)
    returns_aligned = returns[-min_length:]
    
    # Stack features
    features = np.column_stack([returns_aligned, volatilities])
    
    # Standardize each column
    for col in range(features.shape[1]):
        mean = np.mean(features[:, col])
        std = np.std(features[:, col], ddof=0)
        if std > 0:
            features[:, col] = (features[:, col] - mean) / std
        else:
            features[:, col] = 0
    
    return features.tolist()

