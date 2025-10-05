/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

// Import all the functions we want to test
import { calculateAlpha } from '../risk/calculateAlpha';
import { calculateBeta } from '../risk/calculateBeta';
import { calculateInformationRatio } from '../portfolio/calculateInformationRatio';
import { calculateMaxDrawdown } from '../risk/calculateMaxDrawdown';
import { calculateMoneyWeightedReturn } from '../portfolio/calculateMoneyWeightedReturn';
import { calculateReturns } from '../portfolio/calculateReturns';
import { calculateSharpeRatio } from '../risk/calculateSharpeRatio';
import { calculateSortinoRatio } from '../risk/calculateSortinoRatio';
import { calculateTimeWeightedReturn } from '../portfolio/calculateTimeWeightedReturn';
import { calculateVaR } from '../risk/calculateVaR';
import { calculateVolatility } from '../risk/calculateVolatility';
import testData from './test-data.json';

describe('Working Integration Tests - All Functions', () => {
  describe('calculateAlpha', () => {
    testData.test_cases.calculateAlpha.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateAlpha(testCase.input);
        
        expect(result.alpha).toBeCloseTo(testCase.expected.alpha, 10);
        expect(result.annualizedAlpha).toBeCloseTo(testCase.expected.annualizedAlpha, 10);
        expect(result.beta).toBeCloseTo(testCase.expected.beta, 10);
        expect(result.assetReturn).toBeCloseTo(testCase.expected.assetReturn, 10);
        expect(result.benchmarkReturn).toBeCloseTo(testCase.expected.benchmarkReturn, 10);
        expect(result.expectedReturn).toBeCloseTo(testCase.expected.expectedReturn, 10);
      });
    });
  });

  describe('calculateBeta', () => {
    testData.test_cases.calculateBeta.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateBeta(testCase.input);
        
        expect(result.beta).toBeCloseTo(testCase.expected.beta, 10);
        expect(result.covariance).toBeCloseTo(testCase.expected.covariance, 10);
        expect(result.benchmarkVariance).toBeCloseTo(testCase.expected.benchmarkVariance, 10);
        expect(result.correlation).toBeCloseTo(testCase.expected.correlation, 10);
      });
    });
  });

  describe('calculateSharpeRatio', () => {
    testData.test_cases.calculateSharpeRatio.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateSharpeRatio(testCase.input);
        
        expect(result.sharpeRatio).toBeCloseTo(testCase.expected.sharpeRatio, 10);
        expect(result.annualizedReturn).toBeCloseTo(testCase.expected.annualizedReturn, 10);
        expect(result.annualizedVolatility).toBeCloseTo(testCase.expected.annualizedVolatility, 10);
        expect(result.excessReturn).toBeCloseTo(testCase.expected.excessReturn, 10);
      });
    });
  });

  describe('calculateSortinoRatio', () => {
    testData.test_cases.calculateSortinoRatio.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateSortinoRatio(testCase.input);
        
        expect(result.sortinoRatio).toBeCloseTo(testCase.expected.sortinoRatio, 10);
        expect(result.annualizedReturn).toBeCloseTo(testCase.expected.annualizedReturn, 10);
        expect(result.downsideDeviation).toBeCloseTo(testCase.expected.downsideDeviation, 10);
        expect(result.annualizedDownsideDeviation).toBeCloseTo(testCase.expected.annualizedDownsideDeviation, 10);
        expect(result.excessReturn).toBeCloseTo(testCase.expected.excessReturn, 10);
      });
    });
  });

  describe('calculateInformationRatio', () => {
    testData.test_cases.calculateInformationRatio.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateInformationRatio(testCase.input);
        
        expect(result.informationRatio).toBeCloseTo(testCase.expected.informationRatio, 10);
        expect(result.informationRatioPeriod).toBeCloseTo(testCase.expected.informationRatioPeriod, 10);
        expect(result.meanExcessReturn).toBeCloseTo(testCase.expected.meanExcessReturn, 10);
        expect(result.meanExcessReturnPeriod).toBeCloseTo(testCase.expected.meanExcessReturnPeriod, 10);
        expect(result.trackingError).toBeCloseTo(testCase.expected.trackingError, 10);
        expect(result.trackingErrorPeriod).toBeCloseTo(testCase.expected.trackingErrorPeriod, 10);
        expect(result.periods).toBe(testCase.expected.periods);
        expect(result.annualizationFactor).toBe(testCase.expected.annualizationFactor);
        expect(result.method).toBe(testCase.expected.method);
        
        // Check excess returns array
        for (let i = 0; i < testCase.expected.excessReturns.length; i++) {
          expect(result.excessReturns[i]).toBeCloseTo(testCase.expected.excessReturns[i], 10);
        }
      });
    });
  });

  describe('calculateMoneyWeightedReturn', () => {
    testData.test_cases.calculateMoneyWeightedReturn.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        // Convert string dates to Date objects
        const input = {
          ...testCase.input,
          dates: testCase.input.dates.map((dateStr: string) => new Date(dateStr))
        };
        const result = calculateMoneyWeightedReturn(input);
        
        expect(result.mwr).toBeCloseTo(testCase.expected.mwr, 10);
        expect(result.annualizedMWR).toBeCloseTo(testCase.expected.annualizedMWR, 10);
        expect(result.cashFlowCount).toBe(testCase.expected.cashFlowCount);
        expect(result.timePeriodYears).toBeCloseTo(testCase.expected.timePeriodYears, 10);
        expect(result.npv).toBeCloseTo(testCase.expected.npv, 10);
        expect(result.iterations).toBe(testCase.expected.iterations);
      });
    });
  });

  describe('calculateTimeWeightedReturn', () => {
    testData.test_cases.calculateTimeWeightedReturn.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateTimeWeightedReturn(testCase.input);
        
        expect(result.twr).toBeCloseTo(testCase.expected.twr, 10);
        expect(result.annualizedTWR).toBeCloseTo(testCase.expected.annualizedTWR, 10);
        expect(result.periods).toBe(testCase.expected.periods);
        
        // Check period returns array
        for (let i = 0; i < testCase.expected.periodReturns.length; i++) {
          expect(result.periodReturns[i]).toBeCloseTo(testCase.expected.periodReturns[i], 10);
        }
      });
    });
  });

  describe('calculateVaR', () => {
    testData.test_cases.calculateVaR.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateVaR(testCase.input.returns, {
          confidenceLevel: testCase.input.confidenceLevel,
          method: testCase.input.method as any
        });
        
        expect(result.value).toBeCloseTo(testCase.expected.value, 10);
        expect(result.confidenceLevel).toBe(testCase.expected.confidenceLevel);
        expect(result.method).toBe(testCase.expected.method);
        expect(result.cvar).toBeCloseTo(testCase.expected.cvar, 10);
      });
    });
  });

  describe('calculateReturns', () => {
    testData.test_cases.calculateReturns.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateReturns({
          prices: testCase.input.prices,
          method: testCase.input.method as any,
          annualizationFactor: testCase.input.annualizationFactor || 252,
          annualize: testCase.input.annualize || false
        });
        
        expect(result.method).toBe(testCase.expected.method);
        expect(result.returns).toHaveLength(testCase.expected.returns.length);
        expect(result.periods).toBe(testCase.expected.periods);
        expect(result.annualized).toBe(testCase.expected.annualized);
        if (testCase.expected.totalReturn !== undefined) {
          expect(result.totalReturn).toBeCloseTo(testCase.expected.totalReturn, 10);
        }
        if (testCase.expected.totalLogReturn !== undefined) {
          expect(result.totalLogReturn).toBeCloseTo(testCase.expected.totalLogReturn, 10);
        }
        expect(result.meanReturn).toBeCloseTo(testCase.expected.meanReturn, 10);
        expect(result.standardDeviation).toBeCloseTo(testCase.expected.standardDeviation, 10);
        
        // Check individual returns
        for (let i = 0; i < testCase.expected.returns.length; i++) {
          expect(result.returns[i]).toBeCloseTo(testCase.expected.returns[i], 10);
        }
      });
    });
  });

  describe('calculateVolatility', () => {
    testData.test_cases.calculateVolatility.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateVolatility(testCase.input.returns, {
          method: testCase.input.method as any,
          annualizationFactor: testCase.input.annualizationFactor
        });
        
        expect(result.value).toBeCloseTo(testCase.expected.value, 10);
        expect(result.method).toBe(testCase.expected.method);
        expect(result.annualized).toBe(testCase.expected.annualized);
      });
    });
  });

  describe('calculateMaxDrawdown', () => {
    testData.test_cases.calculateMaxDrawdown.forEach((testCase: any) => {
      it(`should handle ${testCase.test_name}`, () => {
        const result = calculateMaxDrawdown({ prices: testCase.input.returns });
        
        expect(result.maxDrawdown).toBeCloseTo(testCase.expected.maxDrawdown, 4);
        expect(result.maxDrawdownPercent).toBeCloseTo(testCase.expected.maxDrawdownPercent, 4);
        expect(result.peakIndex).toBe(testCase.expected.peakIndex);
        expect(result.troughIndex).toBe(testCase.expected.troughIndex);
      });
    });
  });
});
