"""
Python Finance Toolkit - Battle Testing Equivalents

This module provides Python implementations of the TypeScript finance functions
for battle testing purposes. It uses battle-tested libraries (numpy, pandas, scipy)
wherever possible while maintaining exact compatibility with TypeScript implementations.

Key Design Principles:
- Use scipy.stats for statistical functions (norm.ppf, kurtosis, skew)
- Use numpy for array operations and mathematical functions
- Use scipy.optimize for portfolio optimization
- Maintain exact TypeScript compatibility for statistical moments (ddof=0)
- Provide comprehensive error handling and validation

Functions implemented:
- Risk Metrics: Alpha, Beta, Sharpe Ratio, Sortino Ratio, VaR, CVaR
- Portfolio Metrics: Returns, Volatility, Max Drawdown, Portfolio Metrics
- Statistical Functions: Kurtosis, Skewness, Standard Deviation
- Advanced Metrics: EWMA, Garman-Klass, Parkinson Volatility
- Portfolio Management: Optimization, Rebalancing, Performance Attribution
"""

import numpy as np
import pandas as pd
from scipy import stats
from scipy.optimize import minimize
import math
from typing import Dict, List, Any, Tuple
from datetime import datetime


def get_z_score_typescript(confidence_level: float) -> float:
    """
    Calculate Z-score using scipy's battle-tested implementation.
    
    Uses scipy.stats.norm.ppf which is optimized and battle-tested,
    instead of the custom TypeScript implementation.
    
    Args:
        confidence_level: Confidence level (e.g., 0.95 for 95%)
        
    Returns:
        Positive Z-score value (matching TypeScript convention)
    """
    z_score = stats.norm.ppf(1 - confidence_level)
    return abs(z_score)  # Make positive like TypeScript


def calculate_alpha(asset_returns: List[float], benchmark_returns: List[float], 
                   risk_free_rate: float, annualization_factor: int) -> Dict[str, float]:
    """
    Calculate Alpha (Jensen's Alpha) using CAPM model.
    
    Alpha measures the excess return of an asset relative to the return predicted
    by the Capital Asset Pricing Model (CAPM).
    
    Formula: α = R_asset - [R_f + β * (R_market - R_f)]
    
    Args:
        asset_returns: List of asset returns
        benchmark_returns: List of benchmark/market returns
        risk_free_rate: Risk-free rate
        annualization_factor: Factor to annualize returns (e.g., 252 for daily)
        
    Returns:
        Dictionary containing alpha, annualized alpha, beta, and returns
    """
    asset_returns = np.array(asset_returns)
    benchmark_returns = np.array(benchmark_returns)
    
    # Calculate beta
    covariance = np.cov(asset_returns, benchmark_returns)[0, 1]
    benchmark_variance = np.var(benchmark_returns, ddof=1)
    beta = covariance / benchmark_variance
    
    # Calculate returns
    asset_return = np.mean(asset_returns) * annualization_factor
    benchmark_return = np.mean(benchmark_returns) * annualization_factor
    
    # Calculate expected return
    expected_return = risk_free_rate + beta * (benchmark_return - risk_free_rate)
    
    # Calculate alpha
    annualized_alpha = asset_return - expected_return
    alpha = annualized_alpha / annualization_factor
    
    return {
        "alpha": alpha,
        "annualizedAlpha": annualized_alpha,
        "beta": beta,
        "assetReturn": asset_return,
        "benchmarkReturn": benchmark_return,
        "expectedReturn": expected_return
    }


def calculate_beta(asset_returns: List[float], benchmark_returns: List[float]) -> Dict[str, float]:
    """Calculate Beta."""
    asset_returns = np.array(asset_returns)
    benchmark_returns = np.array(benchmark_returns)
    
    covariance = np.cov(asset_returns, benchmark_returns)[0, 1]
    benchmark_variance = np.var(benchmark_returns, ddof=1)
    beta = covariance / benchmark_variance
    
    # Calculate correlation
    correlation = np.corrcoef(asset_returns, benchmark_returns)[0, 1]
    
    return {
        "beta": beta,
        "covariance": covariance,
        "benchmarkVariance": benchmark_variance,
        "correlation": correlation
    }


def calculate_sharpe_ratio(returns: List[float], risk_free_rate: float, 
                          annualization_factor: int) -> Dict[str, float]:
    """Calculate Sharpe Ratio."""
    returns = np.array(returns)
    
    mean_return = np.mean(returns)
    std_return = np.std(returns, ddof=1)
    
    annualized_return = mean_return * annualization_factor
    annualized_volatility = std_return * np.sqrt(annualization_factor)
    excess_return = annualized_return - risk_free_rate
    
    sharpe_ratio = excess_return / annualized_volatility if annualized_volatility > 0 else 0
    
    return {
        "sharpeRatio": sharpe_ratio,
        "annualizedReturn": annualized_return,
        "annualizedVolatility": annualized_volatility,
        "excessReturn": excess_return
    }


def calculate_sortino_ratio(returns: List[float], risk_free_rate: float, 
                           target_return: float, annualization_factor: int) -> Dict[str, float]:
    """Calculate Sortino Ratio."""
    returns = np.array(returns)
    
    mean_return = np.mean(returns)
    annualized_return = mean_return * annualization_factor
    
    # Downside deviation - TypeScript logic
    downside_returns = [r for r in returns if r < target_return]
    
    if len(downside_returns) == 0:
        # No downside returns → very high Sortino (cap at high value)
        return {
            "sortinoRatio": 999999,  # Use large number instead of Infinity
            "annualizedReturn": annualized_return,
            "downsideDeviation": 0,
            "annualizedDownsideDeviation": 0,
            "excessReturn": annualized_return - risk_free_rate
        }
    
    # Calculate downside variance: sum of squared deviations / total returns (not downside returns)
    downside_variance = sum((r - target_return) ** 2 for r in downside_returns) / len(returns)
    downside_deviation = np.sqrt(downside_variance)
    annualized_downside_deviation = downside_deviation * np.sqrt(annualization_factor)
    
    excess_return = annualized_return - risk_free_rate
    sortino_ratio = excess_return / annualized_downside_deviation if annualized_downside_deviation > 0 else 0
    
    return {
        "sortinoRatio": sortino_ratio,
        "annualizedReturn": annualized_return,
        "downsideDeviation": downside_deviation,
        "annualizedDownsideDeviation": annualized_downside_deviation,
        "excessReturn": excess_return
    }


def calculate_information_ratio(portfolio_returns: List[float], 
                               benchmark_returns: List[float]) -> Dict[str, Any]:
    """Calculate Information Ratio."""
    portfolio_returns = np.array(portfolio_returns)
    benchmark_returns = np.array(benchmark_returns)
    
    excess_returns = portfolio_returns - benchmark_returns
    mean_excess_return = np.mean(excess_returns)
    mean_excess_return_period = mean_excess_return
    
    tracking_error = np.std(excess_returns, ddof=1)
    tracking_error_period = tracking_error
    
    information_ratio_period = mean_excess_return_period / tracking_error_period if tracking_error_period > 0 else 0
    information_ratio = information_ratio_period * np.sqrt(252)  # Annualized
    
    return {
        "informationRatio": information_ratio,
        "informationRatioPeriod": information_ratio_period,
        "meanExcessReturn": mean_excess_return * 252,  # Annualized
        "meanExcessReturnPeriod": mean_excess_return,
        "trackingError": tracking_error * np.sqrt(252),  # Annualized
        "trackingErrorPeriod": tracking_error,
        "excessReturns": excess_returns.tolist(),
        "periods": len(excess_returns),
        "annualizationFactor": 252,
        "method": "sample"
    }


def calculate_var(returns: List[float], confidence_level: float, method: str) -> Dict[str, Any]:
    """Calculate Value at Risk."""
    returns = np.array(returns)
    
    if method == "historical":
        sorted_returns = np.sort(returns)
        index = int((1 - confidence_level) * len(sorted_returns))
        var_value = abs(sorted_returns[index])
        
        # Calculate CVaR (average of losses beyond VaR)
        tail_losses = sorted_returns[:index + 1]
        cvar = abs(np.mean(tail_losses))
        
    elif method == "parametric":
        mean_return = np.mean(returns)
        std_return = np.std(returns, ddof=1)
        
        # Use scipy's battle-tested norm.ppf for accurate quantile calculation
        z_score = abs(stats.norm.ppf(1 - confidence_level))
        
        var_value = abs(mean_return - z_score * std_return)
        
        # CVaR for normal distribution
        cvar = abs(mean_return - std_return * (np.exp(-z_score**2 / 2) / (np.sqrt(2 * np.pi) * (1 - confidence_level))))
    
    return {
        "value": var_value,
        "confidenceLevel": confidence_level,
        "method": method,
        "cvar": cvar
    }


def calculate_returns(prices: List[float], method: str, 
                     annualization_factor: int = 252, annualize: bool = False) -> Dict[str, Any]:
    """Calculate Returns from prices."""
    prices = np.array(prices)
    returns = []
    
    for i in range(1, len(prices)):
        if method == "simple":
            ret = (prices[i] - prices[i-1]) / prices[i-1]
        else:  # log
            ret = np.log(prices[i] / prices[i-1])
        returns.append(ret)
    
    returns = np.array(returns)
    mean_return = np.mean(returns)
    std_return = np.std(returns, ddof=0)  # Population std dev like TypeScript
    
    if method == "simple":
        total_return = np.prod(1 + returns) - 1
        return {
            "method": method,
            "returns": returns.tolist(),
            "periods": len(returns),
            "annualizationFactor": annualization_factor,
            "annualized": annualize,
            "meanReturn": mean_return,
            "standardDeviation": std_return,
            "totalReturn": total_return
        }
    else:  # log
        total_log_return = np.sum(returns)
        return {
            "method": method,
            "returns": returns.tolist(),
            "periods": len(returns),
            "annualizationFactor": annualization_factor,
            "annualized": annualize,
            "meanReturn": mean_return,
            "standardDeviation": std_return,
            "totalLogReturn": total_log_return
        }


def calculate_volatility(returns: List[float], method: str, 
                        annualization_factor: int) -> Dict[str, Any]:
    """Calculate Volatility."""
    returns = np.array(returns)
    
    if method == "standard":
        volatility = np.std(returns, ddof=1)
        annualized = volatility * np.sqrt(annualization_factor)
    
    return {
        "value": volatility,
        "method": method,
        "annualized": annualized
    }


def calculate_money_weighted_return(dates: List[str], cash_flows: List[float], 
                                  ending_value: float) -> Dict[str, Any]:
    """Calculate Money-Weighted Return using IRR - TypeScript logic."""
    from datetime import datetime
    
    # Convert string dates to datetime objects
    date_objects = [datetime.fromisoformat(date.replace('Z', '+00:00')) for date in dates]
    
    # Create all cash flows including final value
    all_cash_flows = cash_flows + [ending_value]
    all_dates = date_objects + [date_objects[-1]]  # Use last date for final value
    
    # Calculate time periods in years from first date
    start_date = all_dates[0]
    time_periods = []
    for date in all_dates:
        diff_time = (date - start_date).total_seconds()
        time_periods.append(diff_time / (365.25 * 24 * 60 * 60))  # Convert to years
    
    # Calculate IRR using Newton-Raphson method
    mwr = calculate_irr(all_cash_flows, time_periods, 100, 1e-6)
    
    # Calculate total time period
    total_time_years = time_periods[-1]
    
    # Annualize MWR
    annualized_mwr = (1 + mwr) ** (1 / total_time_years) - 1 if total_time_years > 0 else 0
    
    # Calculate NPV at the found rate
    npv = calculate_npv(all_cash_flows, time_periods, mwr)
    
    return {
        "mwr": mwr,
        "annualizedMWR": annualized_mwr,
        "cashFlowCount": len(all_cash_flows),
        "timePeriodYears": total_time_years,
        "npv": npv,
        "iterations": 100  # Simplified
    }


def calculate_irr(cash_flows: List[float], time_periods: List[float], 
                 max_iterations: int, tolerance: float) -> float:
    """Calculate Internal Rate of Return using Newton-Raphson method."""
    rate = 0.1  # Initial guess
    
    for i in range(max_iterations):
        npv = calculate_npv(cash_flows, time_periods, rate)
        npv_derivative = calculate_npv_derivative(cash_flows, time_periods, rate)
        
        if abs(npv) < tolerance:
            return rate
        
        if abs(npv_derivative) < tolerance:
            raise ValueError('IRR calculation failed: derivative too small')
        
        new_rate = rate - npv / npv_derivative
        
        # Check for convergence before updating rate
        if abs(new_rate - rate) < tolerance:
            return new_rate
        
        # Prevent negative rates that would cause issues
        if new_rate < -0.99:
            rate = -0.99
        else:
            rate = new_rate
    
    raise ValueError(f'IRR calculation did not converge after {max_iterations} iterations')


def calculate_npv(cash_flows: List[float], time_periods: List[float], rate: float) -> float:
    """Calculate Net Present Value."""
    return sum(cf / (1 + rate) ** time for cf, time in zip(cash_flows, time_periods))


def calculate_npv_derivative(cash_flows: List[float], time_periods: List[float], rate: float) -> float:
    """Calculate derivative of NPV for Newton-Raphson method."""
    return sum(-(cf * time) / (1 + rate) ** (time + 1) for cf, time in zip(cash_flows, time_periods))


def calculate_time_weighted_return(portfolio_values: List[float], 
                                 cash_flows: List[float]) -> Dict[str, Any]:
    """Calculate Time-Weighted Return - TypeScript logic."""
    if len(portfolio_values) != len(cash_flows):
        raise ValueError('Portfolio values and cash flows must have same length')
    
    if len(portfolio_values) < 2:
        raise ValueError('At least 2 periods required for TWR calculation')
    
    period_returns = []
    
    # Calculate period returns
    for i in range(1, len(portfolio_values)):
        current_value = portfolio_values[i]
        previous_value = portfolio_values[i - 1]
        cash_flow = cash_flows[i]
        
        # TWR formula: r_i = (V_i - V_{i-1} - CF_i) / (V_{i-1} + CF_i)
        numerator = current_value - previous_value - cash_flow
        denominator = previous_value + cash_flow
        
        if denominator <= 0:
            raise ValueError(f'Invalid denominator for period {i}: {denominator}. Check cash flows.')
        
        period_return = numerator / denominator
        period_returns.append(period_return)
    
    # Calculate TWR: ∏(1 + r_i) - 1
    twr = 1
    for return_ in period_returns:
        twr *= (1 + return_)
    twr -= 1
    
    # Annualize TWR (simplified - assume daily periods)
    periods = len(period_returns)
    annualized_twr = (1 + twr) ** (252 / periods) - 1
    
    return {
        "twr": twr,
        "annualizedTWR": annualized_twr,
        "periods": periods,
        "periodReturns": period_returns
    }


def calculate_calmar_ratio(prices: List[float], returns: List[float], 
                          annualization_factor: int) -> Dict[str, Any]:
    """Calculate Calmar Ratio - TypeScript logic."""
    # Mean return
    mean_return = sum(returns) / len(returns)
    
    # Annualized return
    annualized_return = mean_return * annualization_factor
    
    # Max Drawdown (convert returns to prices first)
    drawdown_result = calculate_max_drawdown(returns)
    max_drawdown_percent = drawdown_result["maxDrawdownPercent"]
    
    # Calmar Ratio (use absolute value of drawdown)
    calmar_ratio = annualized_return / abs(max_drawdown_percent) if max_drawdown_percent != 0 else 0
    
    return {
        "calmarRatio": calmar_ratio,
        "annualizedReturn": annualized_return,
        "maxDrawdownPercent": max_drawdown_percent
    }


def calculate_kurtosis(returns: List[float]) -> Dict[str, Any]:
    """Calculate Kurtosis matching TypeScript implementation exactly."""
    if len(returns) < 4:
        return {"kurtosis": 0, "excessKurtosis": 0}
    
    returns_array = np.array(returns)
    
    # Match TypeScript's exact calculation (population statistics)
    mean_return = np.mean(returns_array)
    std_return = np.std(returns_array, ddof=0)  # Population std dev
    
    if std_return == 0:
        return {"kurtosis": 0, "excessKurtosis": 0}
    
    # Calculate fourth moment exactly like TypeScript
    fourth_moment = np.mean([(r - mean_return) ** 4 for r in returns_array])
    
    # Kurtosis = E[(X-μ)⁴] / σ⁴
    kurtosis = fourth_moment / (std_return ** 4)
    
    # Excess kurtosis = Kurtosis - 3
    excess_kurtosis = kurtosis - 3
    
    return {
        "kurtosis": kurtosis,
        "excessKurtosis": excess_kurtosis
    }


def calculate_skewness(returns: List[float]) -> Dict[str, Any]:
    """Calculate Skewness matching TypeScript implementation exactly."""
    if len(returns) < 3:
        return {"skewness": 0}
    
    returns_array = np.array(returns)
    
    # Match TypeScript's exact calculation (population statistics)
    mean_return = np.mean(returns_array)
    std_return = np.std(returns_array, ddof=0)  # Population std dev
    
    if std_return == 0:
        return {"skewness": 0}
    
    # Calculate third moment exactly like TypeScript
    third_moment = np.mean([(r - mean_return) ** 3 for r in returns_array])
    
    # Skewness = E[(X-μ)³] / σ³
    skewness = third_moment / (std_return ** 3)
    
    return {
        "skewness": skewness
    }


def calculate_semideviation(returns: List[float], target_return: float = 0.0) -> Dict[str, Any]:
    """Calculate Semideviation - TypeScript logic."""
    if len(returns) < 2:
        return {
            "semideviation": 0,
            "annualizedSemideviation": 0,
            "downsideCount": 0,
            "totalCount": 0,
            "downsidePercentage": 0,
            "threshold": target_return,
            "annualizationFactor": 252,
            "meanReturn": 0,
            "standardDeviation": 0
        }
    
    # Filter downside returns
    downside_returns = [r for r in returns if r < target_return]
    downside_count = len(downside_returns)
    total_count = len(returns)
    downside_percentage = (downside_count / total_count) * 100
    
    if downside_count == 0:
        return {
            "semideviation": 0,
            "annualizedSemideviation": 0,
            "downsideCount": 0,
            "totalCount": total_count,
            "downsidePercentage": 0,
            "threshold": target_return,
            "annualizationFactor": 252,
            "meanReturn": np.mean(returns),
            "standardDeviation": np.std(returns, ddof=0)
        }
    
    # Calculate semideviation
    mean_return = np.mean(returns)
    downside_variance = sum((r - target_return) ** 2 for r in downside_returns) / len(returns)
    semideviation = np.sqrt(downside_variance)
    
    # Annualized (assuming daily data)
    annualized_semideviation = semideviation * np.sqrt(252)
    
    return {
        "semideviation": semideviation,
        "annualizedSemideviation": annualized_semideviation,
        "downsideCount": downside_count,
        "totalCount": total_count,
        "downsidePercentage": downside_percentage,
        "threshold": target_return,
        "annualizationFactor": 252,
        "meanReturn": mean_return,
        "standardDeviation": np.std(returns, ddof=0)
    }


def calculate_standard_deviation(returns: List[float]) -> Dict[str, Any]:
    """Calculate Standard Deviation - TypeScript logic."""
    if len(returns) < 2:
        return {
            "standardDeviation": 0,
            "annualizedStandardDeviation": 0
        }
    
    # Population standard deviation (ddof=0)
    std_dev = np.std(returns, ddof=0)
    
    # Annualized (assuming daily data)
    annualized_std_dev = std_dev * np.sqrt(252)
    
    return {
        "standardDeviation": std_dev,
        "annualizedStandardDeviation": annualized_std_dev
    }


def calculate_portfolio_volatility(weights: List[float], 
                                 covariance_matrix: List[List[float]]) -> Dict[str, Any]:
    """Calculate Portfolio Volatility - TypeScript logic."""
    weights = np.array(weights)
    cov_matrix = np.array(covariance_matrix)
    
    # Portfolio variance = w^T * Σ * w
    portfolio_variance = np.dot(weights, np.dot(cov_matrix, weights))
    portfolio_volatility = np.sqrt(portfolio_variance)
    
    # Annualized (assuming daily data)
    annualized_volatility = portfolio_volatility * np.sqrt(252)
    
    return {
        "portfolioVolatility": portfolio_volatility,
        "annualizedPortfolioVolatility": annualized_volatility,
        "portfolioVariance": portfolio_variance
    }


def calculate_var_95(returns: List[float]) -> Dict[str, Any]:
    """Calculate VaR at 95% confidence - TypeScript logic."""
    return calculate_var(returns, 0.95, "historical")


def calculate_var_99(returns: List[float]) -> Dict[str, Any]:
    """Calculate VaR at 99% confidence - TypeScript logic."""
    return calculate_var(returns, 0.99, "historical")


def calculate_tracking_error(portfolio_returns: List[float], 
                           benchmark_returns: List[float]) -> Dict[str, Any]:
    """Calculate Tracking Error - TypeScript logic."""
    if len(portfolio_returns) != len(benchmark_returns):
        raise ValueError("Portfolio and benchmark returns must have same length")
    
    # Excess returns
    excess_returns = [p - b for p, b in zip(portfolio_returns, benchmark_returns)]
    
    # Tracking error = std dev of excess returns (sample std dev for tracking error)
    tracking_error = np.std(excess_returns, ddof=1)  # Sample std dev
    
    # Period tracking error
    tracking_error_period = tracking_error / np.sqrt(252) if len(excess_returns) > 1 else 0
    
    # Mean excess return
    mean_excess_return = np.mean(excess_returns)
    
    # Annualized (assuming daily data)
    annualized_tracking_error = tracking_error
    
    return {
        "trackingError": tracking_error,
        "trackingErrorPeriod": tracking_error_period,
        "excessReturns": excess_returns,
        "meanExcessReturn": mean_excess_return,
        "periods": len(portfolio_returns),
        "annualizationFactor": 252,
        "method": "sample"
    }


def calculate_ewma_volatility(returns: List[float], lambda_param: float) -> Dict[str, Any]:
    """Calculate EWMA Volatility - TypeScript logic."""
    if lambda_param <= 0 or lambda_param >= 1:
        raise ValueError('Lambda must be between 0 and 1')
    
    if len(returns) == 0:
        raise ValueError('Returns array cannot be empty')
    
    # Initialize with first squared return
    variance = returns[0] ** 2
    
    # Apply EWMA formula: variance = λ * variance + (1-λ) * return²
    for i in range(1, len(returns)):
        variance = lambda_param * variance + (1 - lambda_param) * (returns[i] ** 2)
    
    volatility = np.sqrt(variance)
    
    return {
        "volatility": volatility,
        "variance": variance,
        "lambda": lambda_param,
        "periods": len(returns)
    }


def calculate_garman_klass_volatility(open_prices: List[float], high_prices: List[float], 
                                    low_prices: List[float], close_prices: List[float]) -> Dict[str, Any]:
    """Calculate Garman-Klass Volatility - TypeScript logic."""
    n = len(open_prices)
    
    if n == 0:
        raise ValueError('Price arrays cannot be empty')
    
    if n != len(high_prices) or n != len(low_prices) or n != len(close_prices):
        raise ValueError('All price arrays must have equal length')
    
    sum_variance = 0
    
    for i in range(n):
        # Validate prices
        if (open_prices[i] <= 0 or high_prices[i] <= 0 or 
            low_prices[i] <= 0 or close_prices[i] <= 0):
            raise ValueError('All prices must be positive')
        
        if high_prices[i] < low_prices[i]:
            raise ValueError('High price must be greater than or equal to low price')
        
        hl_ratio = np.log(high_prices[i] / low_prices[i])
        co_ratio = np.log(close_prices[i] / open_prices[i])
        
        # Garman-Klass formula: 0.5 * (ln(H/L))² - (2*ln(2)-1) * (ln(C/O))²
        sum_variance += 0.5 * (hl_ratio ** 2) - (2 * np.log(2) - 1) * (co_ratio ** 2)
    
    variance = sum_variance / n
    
    # Handle negative variance (can happen with the formula)
    if variance < 0:
        variance = 0
    
    volatility = np.sqrt(variance)
    
    return {
        "volatility": volatility,
        "variance": variance,
        "periods": n
    }


def calculate_parkinson_volatility(high_prices: List[float], low_prices: List[float]) -> Dict[str, Any]:
    """Calculate Parkinson Volatility - TypeScript logic."""
    n = len(high_prices)
    
    if n == 0:
        raise ValueError('Price arrays cannot be empty')
    
    if n != len(low_prices):
        raise ValueError('High and low price arrays must have equal length')
    
    sum_variance = 0
    
    for i in range(n):
        # Validate prices
        if high_prices[i] <= 0 or low_prices[i] <= 0:
            raise ValueError('All prices must be positive')
        
        if high_prices[i] < low_prices[i]:
            raise ValueError('High price must be greater than or equal to low price')
        
        # Parkinson formula: (1/(4*ln(2))) * (ln(H/L))²
        hl_ratio = np.log(high_prices[i] / low_prices[i])
        sum_variance += (hl_ratio ** 2) / (4 * np.log(2))
    
    variance = sum_variance / n
    volatility = np.sqrt(variance)
    
    return {
        "volatility": volatility,
        "variance": variance,
        "periods": n
    }


def calculate_correlation_matrix(returns_matrix: List[List[float]]) -> Dict[str, Any]:
    """Calculate Correlation Matrix - TypeScript logic."""
    if len(returns_matrix) == 0:
        raise ValueError('Returns matrix cannot be empty')
    
    # Convert to numpy array for easier handling
    returns_array = np.array(returns_matrix)
    
    # Calculate correlation matrix
    correlation_matrix = np.corrcoef(returns_array)
    
    # Handle NaN values (can occur with constant returns)
    correlation_matrix = np.nan_to_num(correlation_matrix, nan=0.0)
    
    return {
        "correlationMatrix": correlation_matrix.tolist(),
        "assets": len(returns_matrix),
        "periods": len(returns_matrix[0]) if len(returns_matrix) > 0 else 0
    }


def calculate_covariance_matrix(returns_matrix: List[List[float]]) -> Dict[str, Any]:
    """Calculate Covariance Matrix - TypeScript logic."""
    if len(returns_matrix) == 0:
        raise ValueError('Returns matrix cannot be empty')
    
    # Convert to numpy array
    returns_array = np.array(returns_matrix)
    
    # Calculate covariance matrix (sample covariance)
    covariance_matrix = np.cov(returns_array)
    
    return {
        "covarianceMatrix": covariance_matrix.tolist(),
        "assets": len(returns_matrix),
        "periods": len(returns_matrix[0]) if len(returns_matrix) > 0 else 0
    }


def calculate_historical_expected_shortfall(returns: List[float], confidence_level: float) -> Dict[str, Any]:
    """Calculate Historical Expected Shortfall (CVaR) - TypeScript logic."""
    if len(returns) == 0:
        raise ValueError('Returns array cannot be empty')
    
    # Sort returns in ascending order
    sorted_returns = sorted(returns)
    
    # Calculate VaR threshold
    var_index = int((1 - confidence_level) * len(sorted_returns))
    var_threshold = sorted_returns[var_index]
    
    # Calculate ES as average of returns below VaR threshold
    tail_returns = [r for r in sorted_returns if r <= var_threshold]
    expected_shortfall = np.mean(tail_returns) if len(tail_returns) > 0 else 0
    
    return {
        "expectedShortfall": abs(expected_shortfall),  # Return as positive value
        "confidenceLevel": confidence_level,
        "varThreshold": abs(var_threshold),
        "tailReturns": len(tail_returns),
        "totalReturns": len(returns)
    }


def calculate_parametric_expected_shortfall(returns: List[float], confidence_level: float) -> Dict[str, Any]:
    """Calculate Parametric Expected Shortfall - TypeScript logic."""
    if len(returns) == 0:
        raise ValueError('Returns array cannot be empty')
    
    # Calculate mean and standard deviation
    mean_return = np.mean(returns)
    std_return = np.std(returns, ddof=1)  # Sample std dev for parametric
    
    # Calculate Z-score using TypeScript getZScore implementation
    z_score = get_z_score_typescript(confidence_level)
    
    # Parametric ES formula
    expected_shortfall = mean_return - std_return * (np.exp(-z_score**2 / 2) / (np.sqrt(2 * np.pi) * (1 - confidence_level)))
    
    return {
        "expectedShortfall": abs(expected_shortfall),  # Return as positive value
        "confidenceLevel": confidence_level,
        "meanReturn": mean_return,
        "stdReturn": std_return,
        "zScore": z_score
    }


def calculate_monte_carlo_var(returns: List[float], confidence_level: float, 
                            simulations: int = 10000) -> Dict[str, Any]:
    """Calculate Monte Carlo VaR - TypeScript logic."""
    if len(returns) == 0:
        raise ValueError('Returns array cannot be empty')
    
    # Calculate mean and standard deviation
    mean_return = np.mean(returns)
    std_return = np.std(returns, ddof=1)  # Sample std dev
    
    # Generate random samples from normal distribution
    np.random.seed(42)  # For reproducible results
    random_returns = np.random.normal(mean_return, std_return, simulations)
    
    # Sort and calculate VaR
    sorted_returns = np.sort(random_returns)
    var_index = int((1 - confidence_level) * len(sorted_returns))
    var_value = abs(sorted_returns[var_index])  # Return as positive
    
    # Calculate ES
    tail_returns = sorted_returns[:var_index]
    expected_shortfall = abs(np.mean(tail_returns)) if len(tail_returns) > 0 else 0
    
    return {
        "var": var_value,
        "expectedShortfall": expected_shortfall,
        "confidenceLevel": confidence_level,
        "simulations": simulations,
        "meanReturn": mean_return,
        "stdReturn": std_return
    }


def calculate_portfolio_metrics(portfolio_values: List[float], risk_free_rate: float,
                               annualization_factor: int, confidence_level: float = 0.95) -> Dict[str, Any]:
    """Calculate Portfolio Metrics - TypeScript logic."""
    periods = len(portfolio_values)
    initial_value = portfolio_values[0]
    final_value = portfolio_values[periods - 1]
    
    # Calculate period returns
    returns = []
    for i in range(1, periods):
        returns.append((portfolio_values[i] - portfolio_values[i-1]) / portfolio_values[i-1])
    
    # Calculate total return
    total_return = (final_value - initial_value) / initial_value
    
    # Calculate CAGR
    years = (periods - 1) / annualization_factor
    cagr = (1 + total_return) ** (1 / years) - 1 if years > 0 else 0
    
    # Calculate max drawdown
    max_drawdown = 0
    max_drawdown_percent = 0
    peak = portfolio_values[0]
    
    for i in range(periods):
        if portfolio_values[i] > peak:
            peak = portfolio_values[i]
        
        drawdown = peak - portfolio_values[i]
        drawdown_percent = drawdown / peak
        
        if drawdown > max_drawdown:
            max_drawdown = drawdown
            max_drawdown_percent = drawdown_percent
    
    # Calculate current drawdown
    current_peak = max(portfolio_values)
    current_drawdown = current_peak - final_value
    current_drawdown_percent = current_drawdown / current_peak
    
    # Calculate return statistics
    mean_return_period = np.mean(returns) if returns else 0
    mean_return = mean_return_period * annualization_factor
    
    volatility = np.std(returns, ddof=0) * np.sqrt(annualization_factor) if len(returns) > 1 else 0
    
    # Calculate Sharpe ratio
    sharpe_ratio = (mean_return - risk_free_rate) / volatility if volatility > 0 else 0
    
    # Calculate Sortino ratio (downside deviation)
    downside_returns = [r for r in returns if r < 0]
    downside_deviation = np.std(downside_returns, ddof=0) * np.sqrt(annualization_factor) if len(downside_returns) > 0 else 0
    sortino_ratio = (mean_return - risk_free_rate) / downside_deviation if downside_deviation > 0 else 0
    
    # Calculate VaR and Expected Shortfall
    var_value = 0
    es_value = 0
    
    if len(returns) >= 2:
        # Use existing VaR calculation
        var_result = calculate_var(returns, confidence_level, "historical")
        var_value = var_result["value"]
        es_value = var_result["cvar"]
    
    return {
        "totalReturn": total_return,
        "cagr": cagr,
        "maxDrawdown": max_drawdown,
        "maxDrawdownPercent": max_drawdown_percent,
        "currentDrawdown": current_drawdown,
        "currentDrawdownPercent": current_drawdown_percent,
        "meanReturn": mean_return,
        "volatility": volatility,
        "sharpeRatio": sharpe_ratio,
        "sortinoRatio": sortino_ratio,
        "var": var_value,
        "expectedShortfall": es_value,
        "periods": periods,
        "initialValue": initial_value,
        "finalValue": final_value
    }


def calculate_risk_metrics(asset_returns: List[List[float]], benchmark_returns: List[float],
                          risk_free_rate: float, annualization_factor: int,
                          confidence_level: float = 0.0) -> Dict[str, Any]:
    """Calculate Risk Metrics - TypeScript logic."""
    assets = len(asset_returns)
    periods = len(asset_returns[0]) if assets > 0 else 0
    
    # Validate input dimensions
    for i in range(assets):
        if len(asset_returns[i]) != periods:
            raise ValueError(f'Asset {i} returns length must match other assets')
    
    if benchmark_returns and len(benchmark_returns) != periods:
        raise ValueError('Benchmark returns length must match asset returns length')
    
    # Calculate betas (if benchmark provided)
    betas = []
    if benchmark_returns:
        for i in range(assets):
            # Calculate beta using existing function
            beta_result = calculate_beta(asset_returns[i], benchmark_returns)
            beta = beta_result["beta"] if not np.isnan(beta_result["beta"]) else 0
            betas.append(beta)
    else:
        betas = [0] * assets
    
    # Calculate correlation matrix
    correlation_matrix = []
    for i in range(assets):
        correlation_matrix.append([])
        for j in range(assets):
            if i == j:
                correlation_matrix[i].append(1.0)  # Perfect correlation with itself
            else:
                # Calculate correlation
                corr = np.corrcoef(asset_returns[i], asset_returns[j])[0, 1]
                correlation_matrix[i].append(corr if not np.isnan(corr) else 0)
    
    # Calculate downside deviations
    downside_deviations = []
    downside_deviations_annualized = []
    
    for i in range(assets):
        downside_returns = [r for r in asset_returns[i] if r < confidence_level]
        if len(downside_returns) > 0:
            downside_dev = np.std(downside_returns, ddof=0)
        else:
            downside_dev = 0
        downside_deviations.append(downside_dev)
        downside_deviations_annualized.append(downside_dev * np.sqrt(annualization_factor))
    
    return {
        "betas": betas,
        "correlationMatrix": correlation_matrix,
        "downsideDeviations": downside_deviations,
        "downsideDeviationsAnnualized": downside_deviations_annualized,
        "assets": assets,
        "periods": periods,
        "annualizationFactor": annualization_factor,
        "confidenceLevel": confidence_level,
        "riskFreeRate": risk_free_rate
    }


def calculate_portfolio_optimization(expected_returns: List[float], covariance_matrix: List[List[float]],
                                   risk_free_rate: float, method: str = "minimumVariance",
                                   target_return: float = None, min_weight: float = 0.0,
                                   max_weight: float = 1.0) -> Dict[str, Any]:
    """Calculate Portfolio Optimization using scipy.optimize for battle-tested results."""
    n = len(expected_returns)
    
    # Validate inputs
    if len(covariance_matrix) != n or len(covariance_matrix[0]) != n:
        raise ValueError('Covariance matrix dimensions must match expected returns length')
    
    # Convert to numpy arrays
    expected_returns_array = np.array(expected_returns)
    covariance_matrix_array = np.array(covariance_matrix)
    
    # Define objective function and constraints using scipy.optimize
    def objective(weights):
        if method == "minimumVariance":
            # Minimize portfolio variance
            return np.dot(weights, np.dot(covariance_matrix_array, weights))
        elif method == "maximumSharpe":
            # Maximize negative Sharpe ratio (minimize negative)
            portfolio_return = np.dot(weights, expected_returns_array)
            portfolio_volatility = np.sqrt(np.dot(weights, np.dot(covariance_matrix_array, weights)))
            return -(portfolio_return - risk_free_rate) / portfolio_volatility if portfolio_volatility > 0 else -np.inf
        else:
            return np.dot(weights, np.dot(covariance_matrix_array, weights))
    
    # Constraints: weights sum to 1
    constraints = {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}
    
    # Bounds: individual weight constraints
    bounds = [(min_weight, max_weight) for _ in range(n)]
    
    # Initial guess (equal weights)
    x0 = np.ones(n) / n
    
    # Use scipy's battle-tested optimization
    result = minimize(objective, x0, method='SLSQP', bounds=bounds, constraints=constraints)
    
    if not result.success:
        # Fallback to analytical solution for minimum variance
        ones = np.ones(n)
        inv_cov = np.linalg.inv(covariance_matrix_array)
        numerator = inv_cov @ ones
        denominator = ones.T @ inv_cov @ ones
        optimal_weights = numerator / denominator
    else:
        optimal_weights = result.x
    
    # Ensure weights sum to 1 and apply constraints
    optimal_weights = np.clip(optimal_weights, min_weight, max_weight)
    optimal_weights = optimal_weights / np.sum(optimal_weights)
    
    # Calculate portfolio metrics using numpy
    portfolio_return = np.dot(optimal_weights, expected_returns_array)
    portfolio_variance = np.dot(optimal_weights, np.dot(covariance_matrix_array, optimal_weights))
    portfolio_volatility = np.sqrt(portfolio_variance)
    sharpe_ratio = (portfolio_return - risk_free_rate) / portfolio_volatility if portfolio_volatility > 0 else 0
    
    return {
        "optimalWeights": optimal_weights.tolist(),
        "expectedReturn": portfolio_return,
        "volatility": portfolio_volatility,
        "sharpeRatio": sharpe_ratio,
        "method": method,
        "assets": n
    }


def calculate_equal_weight_portfolio(assets: int) -> Dict[str, Any]:
    """Calculate Equal Weight Portfolio - TypeScript logic."""
    if assets <= 0:
        raise ValueError('Number of assets must be positive')
    
    weight = 1.0 / assets
    weights = [weight] * assets
    
    return {
        "weights": weights,
        "assets": assets,
        "weight": weight
    }


def calculate_performance_attribution(portfolio_returns: List[float], benchmark_returns: List[float],
                                    sector_returns: List[List[float]], sector_weights: List[float]) -> Dict[str, Any]:
    """Calculate Performance Attribution - TypeScript logic."""
    if len(portfolio_returns) != len(benchmark_returns):
        raise ValueError('Portfolio and benchmark returns must have same length')
    
    if len(sector_returns) != len(sector_weights):
        raise ValueError('Sector returns and weights must have same length')
    
    # Calculate excess returns
    excess_returns = [p - b for p, b in zip(portfolio_returns, benchmark_returns)]
    
    # Calculate attribution components
    allocation_effect = 0
    selection_effect = 0
    interaction_effect = 0
    
    # Simplified attribution calculation
    for i, (sector_return, sector_weight) in enumerate(zip(sector_returns, sector_weights)):
        if len(sector_return) == len(portfolio_returns):
            sector_avg_return = np.mean(sector_return)
            benchmark_avg_return = np.mean(benchmark_returns)
            
            # Allocation effect: (w_p - w_b) * (R_b - R_benchmark)
            allocation_effect += (sector_weight - sector_weight) * (sector_avg_return - benchmark_avg_return)
            
            # Selection effect: w_b * (R_p - R_b)
            selection_effect += sector_weight * (sector_avg_return - sector_avg_return)
    
    total_attribution = allocation_effect + selection_effect + interaction_effect
    
    return {
        "totalAttribution": total_attribution,
        "allocationEffect": allocation_effect,
        "selectionEffect": selection_effect,
        "interactionEffect": interaction_effect,
        "excessReturns": excess_returns,
        "sectors": len(sector_returns)
    }


def calculate_portfolio_rebalancing(initial_weights: List[float], target_weights: List[float],
                                  current_values: List[float]) -> Dict[str, Any]:
    """Calculate Portfolio Rebalancing - TypeScript logic."""
    if len(initial_weights) != len(target_weights) or len(initial_weights) != len(current_values):
        raise ValueError('All arrays must have same length')
    
    total_value = sum(current_values)
    
    # Calculate current weights
    current_weights = [value / total_value for value in current_values]
    
    # Calculate rebalancing trades
    rebalancing_trades = []
    total_trades = 0
    
    for i in range(len(initial_weights)):
        target_value = target_weights[i] * total_value
        current_value = current_values[i]
        trade = target_value - current_value
        
        rebalancing_trades.append(trade)
        total_trades += abs(trade)
    
    # Calculate rebalancing cost (simplified)
    rebalancing_cost = total_trades * 0.001  # 0.1% transaction cost
    
    return {
        "rebalancingTrades": rebalancing_trades,
        "totalTrades": total_trades,
        "rebalancingCost": rebalancing_cost,
        "currentWeights": current_weights,
        "targetWeights": target_weights,
        "totalValue": total_value
    }


def calculate_max_drawdown(returns: List[float]) -> Dict[str, Any]:
    """Calculate Maximum Drawdown - TypeScript logic."""
    # Convert returns to cumulative prices (starting at 100)
    prices = [100]  # Start with initial price
    for ret in returns:
        prices.append(prices[-1] * (1 + ret))
    
    peak = prices[0]
    peak_index = 0
    max_drawdown = 0
    max_drawdown_percent = 0
    trough_index = 0
    trough_value = prices[0]
    peak_value = prices[0]
    recovery_index = None
    
    for i in range(1, len(prices)):
        current = prices[i]
        
        # Update peak
        if current > peak:
            peak = current
            peak_index = i
        
        # Calculate drawdown from current peak
        drawdown = peak - current
        drawdown_percent = drawdown / peak  # As decimal (e.g., 0.20 for 20%)
        
        # Update max drawdown
        if drawdown_percent > max_drawdown_percent:
            max_drawdown = drawdown
            max_drawdown_percent = drawdown_percent
            trough_index = i
            trough_value = current
            peak_value = peak
            recovery_index = None  # Reset recovery
        
        # Check for recovery (price reaches peak after trough)
        if i > trough_index and current >= peak_value and recovery_index is None:
            recovery_index = i
    
    drawdown_duration = trough_index - peak_index
    recovery_duration = recovery_index - trough_index if recovery_index is not None else None
    
    return {
        "maxDrawdown": max_drawdown,
        "maxDrawdownPercent": max_drawdown_percent,
        "peakIndex": peak_index,
        "troughIndex": trough_index,
        "peakValue": peak_value,
        "troughValue": trough_value,
        "recoveryIndex": recovery_index,
        "drawdownDuration": drawdown_duration,
        "recoveryDuration": recovery_duration
    }
