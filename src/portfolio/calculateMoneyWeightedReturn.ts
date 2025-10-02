import { MoneyWeightedReturnOptions, MoneyWeightedReturnOptionsSchema } from '../schemas/MoneyWeightedReturnOptionsSchema';
import { MoneyWeightedReturnResult, MoneyWeightedReturnResultSchema } from '../schemas/MoneyWeightedReturnResultSchema';

/**
 * Calculate Money-Weighted Return (MWR) using Internal Rate of Return (IRR)
 * 
 * MWR measures the actual return earned by an investor based on their
 * specific cash flow timing and amounts. It's also known as Internal Rate of Return.
 * 
 * The MWR is the discount rate that makes the NPV of all cash flows equal to zero:
 * NPV = CF₀ + CF₁/(1+r) + CF₂/(1+r)² + ... + CFₙ/(1+r)ⁿ = 0
 * 
 * @param options - Cash flows, dates, final value, and IRR calculation parameters
 * @returns MWR result with period and annualized returns
 * 
 * @example
 * ```typescript
 * const mwr = calculateMoneyWeightedReturn({
 *   cashFlows: [-1000, 100, -50],
 *   dates: [new Date('2023-01-01'), new Date('2023-06-01'), new Date('2023-12-01')],
 *   finalValue: 1200,
 *   initialValue: 0
 * });
 * ```
 */
export function calculateMoneyWeightedReturn(
  options: MoneyWeightedReturnOptions
): MoneyWeightedReturnResult {
  const { 
    cashFlows, 
    dates, 
    finalValue, 
    initialValue, 
    maxIterations, 
    tolerance 
  } = MoneyWeightedReturnOptionsSchema.parse(options);

  if (cashFlows.length !== dates.length) {
    throw new Error('Cash flows and dates must have same length');
  }

  if (cashFlows.length < 2) {
    throw new Error('At least 2 cash flows required for MWR calculation');
  }

  // Create all cash flows including initial and final values
  const allCashFlows: number[] = [];
  const allDates: Date[] = [];

  // Add initial value if provided
  if (initialValue > 0) {
    allCashFlows.push(-initialValue); // Negative for initial investment
    allDates.push(dates[0]); // Use first date as initial date
  }

  // Add intermediate cash flows
  for (let i = 0; i < cashFlows.length; i++) {
    allCashFlows.push(cashFlows[i]);
    allDates.push(dates[i]);
  }

  // Add final value as positive cash flow
  allCashFlows.push(finalValue);
  allDates.push(dates[dates.length - 1]); // Use last date for final value

  // Calculate time periods in years from first date
  const startDate = allDates[0];
  const timePeriods: number[] = allDates.map(date => {
    const diffTime = date.getTime() - startDate.getTime();
    return diffTime / (1000 * 60 * 60 * 24 * 365.25); // Convert to years
  });

  // Calculate IRR using Newton-Raphson method
  const mwr = calculateIRR(allCashFlows, timePeriods, maxIterations, tolerance);
  
  // Calculate total time period
  const totalTimeYears = timePeriods[timePeriods.length - 1];
  
  // Annualize MWR
  const annualizedMWR = Math.pow(1 + mwr, 1 / totalTimeYears) - 1;
  
  // Calculate NPV at the found rate
  const npv = calculateNPV(allCashFlows, timePeriods, mwr);
  
  return MoneyWeightedReturnResultSchema.parse({
    mwr,
    annualizedMWR,
    cashFlowCount: allCashFlows.length,
    timePeriodYears: totalTimeYears,
    npv,
    iterations: maxIterations, // We'll track actual iterations in a future version
  });
}

/**
 * Calculate Internal Rate of Return using Newton-Raphson method
 */
function calculateIRR(
  cashFlows: number[], 
  timePeriods: number[], 
  maxIterations: number, 
  tolerance: number
): number {
  let rate = 0.1; // Initial guess
  
  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(cashFlows, timePeriods, rate);
    const npvDerivative = calculateNPVDerivative(cashFlows, timePeriods, rate);
    
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    
    if (Math.abs(npvDerivative) < tolerance) {
      throw new Error('IRR calculation failed: derivative too small');
    }
    
    const newRate = rate - npv / npvDerivative;
    
    // Check for convergence before updating rate
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }
    
    // Prevent negative rates that would cause issues
    if (newRate < -0.99) {
      rate = -0.99;
    } else {
      rate = newRate;
    }
  }
  
  throw new Error(`IRR calculation did not converge after ${maxIterations} iterations`);
}

/**
 * Calculate Net Present Value
 */
function calculateNPV(cashFlows: number[], timePeriods: number[], rate: number): number {
  return cashFlows.reduce((sum, cf, index) => {
    return sum + cf / Math.pow(1 + rate, timePeriods[index]);
  }, 0);
}

/**
 * Calculate derivative of NPV for Newton-Raphson method
 */
function calculateNPVDerivative(cashFlows: number[], timePeriods: number[], rate: number): number {
  return cashFlows.reduce((sum, cf, index) => {
    const time = timePeriods[index];
    return sum - (cf * time) / Math.pow(1 + rate, time + 1);
  }, 0);
}
