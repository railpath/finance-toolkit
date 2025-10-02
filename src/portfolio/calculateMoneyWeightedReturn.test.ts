import { calculateMoneyWeightedReturn } from './calculateMoneyWeightedReturn';

describe('calculateMoneyWeightedReturn', () => {
  it('should calculate MWR for simple case', () => {
    const result = calculateMoneyWeightedReturn({
      cashFlows: [-1000, 100],
      dates: [new Date('2023-01-01'), new Date('2023-12-31')],
      finalValue: 1200,
      initialValue: 0,
      maxIterations: 100,
      tolerance: 1e-6,
    });

    // Should be positive return
    expect(result.mwr).toBeGreaterThan(0);
    expect(result.cashFlowCount).toBe(3); // -1000, 100, 1200 (final)
    expect(result.timePeriodYears).toBeCloseTo(1, 2);
    expect(result.annualizedMWR).toBeGreaterThan(0);
  });

  it('should handle multiple cash flows', () => {
    const result = calculateMoneyWeightedReturn({
      cashFlows: [-1000, 100, -50],
      dates: [
        new Date('2023-01-01'), 
        new Date('2023-06-01'), 
        new Date('2023-12-01')
      ],
      finalValue: 1200,
      initialValue: 0,
      maxIterations: 100,
      tolerance: 1e-6,
    });

    expect(result.mwr).toBeGreaterThan(0);
    expect(result.cashFlowCount).toBe(4); // -1000, 100, -50, 1200 (final)
    expect(result.annualizedMWR).toBeGreaterThan(0);
  });

  it('should throw error for mismatched array lengths', () => {
    expect(() => {
      calculateMoneyWeightedReturn({
        cashFlows: [-1000, 100],
        dates: [new Date('2023-01-01')],
        finalValue: 1200,
        initialValue: 0,
        maxIterations: 100,
        tolerance: 1e-6,
      });
    }).toThrow();
  });

  it('should throw error for insufficient cash flows', () => {
    expect(() => {
      calculateMoneyWeightedReturn({
        cashFlows: [-1000],
        dates: [new Date('2023-01-01')],
        finalValue: 1200,
        initialValue: 0,
        maxIterations: 100,
        tolerance: 1e-6,
      });
    }).toThrow();
  });

  it('should calculate annualized MWR correctly', () => {
    const result = calculateMoneyWeightedReturn({
      cashFlows: [-1000, 0],
      dates: [new Date('2023-01-01'), new Date('2023-12-31')],
      finalValue: 1200,
      initialValue: 0,
      maxIterations: 100,
      tolerance: 1e-6,
    });

    // Should be positive return
    expect(result.annualizedMWR).toBeGreaterThan(0);
  });

  it('should handle initial value correctly', () => {
    const result = calculateMoneyWeightedReturn({
      cashFlows: [100, 0],
      dates: [new Date('2023-06-01'), new Date('2023-12-31')],
      finalValue: 1200,
      initialValue: 1000,
      maxIterations: 100,
      tolerance: 1e-6,
    });

    expect(result.cashFlowCount).toBe(4); // -1000 (initial), 100, 0, 1200 (final)
    expect(result.mwr).toBeGreaterThan(0);
    expect(result.annualizedMWR).toBeGreaterThan(0);
  });

  it('should handle negative returns correctly', () => {
    const result = calculateMoneyWeightedReturn({
      cashFlows: [-1000, 100],
      dates: [new Date('2023-01-01'), new Date('2023-12-31')],
      finalValue: 800, // Lower than initial investment
      initialValue: 0,
      maxIterations: 100,
      tolerance: 1e-6,
    });

    expect(result.mwr).toBeLessThan(0); // Should be negative return
    expect(result.cashFlowCount).toBe(3); // -1000, 100, 800 (final)
    expect(result.annualizedMWR).toBeLessThan(0);
  });

  it('should validate that NPV is close to zero', () => {
    const result = calculateMoneyWeightedReturn({
      cashFlows: [-1000, 100],
      dates: [new Date('2023-01-01'), new Date('2023-12-31')],
      finalValue: 1200,
      initialValue: 0,
      maxIterations: 100,
      tolerance: 1e-6,
    });

    // NPV should be very close to zero at the calculated MWR
    expect(Math.abs(result.npv)).toBeLessThan(1e-6);
  });
});
