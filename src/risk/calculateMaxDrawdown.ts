import { MaxDrawdownOptions, MaxDrawdownOptionsSchema } from '../schemas/MaxDrawdownOptionsSchema';
import { MaxDrawdownResult, MaxDrawdownResultSchema } from '../schemas/MaxDrawdownResultSchema';

/**
 * Calculate Maximum Drawdown (MDD)
 * 
 * MDD = max(0, (Peak - Trough) / Peak)
 * 
 * @param options - Prices array
 * @returns MDD metrics including peak, trough, duration, recovery
 */
export function calculateMaxDrawdown(
  options: MaxDrawdownOptions
): MaxDrawdownResult {
  const { prices } = MaxDrawdownOptionsSchema.parse(options);

  let peak = prices[0];
  let peakIndex = 0;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let troughIndex = 0;
  let troughValue = prices[0];
  let peakValue = prices[0];
  let recoveryIndex: number | null = null;

  for (let i = 1; i < prices.length; i++) {
    const current = prices[i];

    // Update peak
    if (current > peak) {
      peak = current;
      peakIndex = i;
    }

    // Calculate drawdown from current peak
    const drawdown = peak - current;
    const drawdownPercent = drawdown / peak; // As decimal (e.g., 0.20 for 20%)

    // Update max drawdown
    if (drawdownPercent > maxDrawdownPercent) {
      maxDrawdown = drawdown;
      maxDrawdownPercent = drawdownPercent;
      troughIndex = i;
      troughValue = current;
      peakValue = peak;
      recoveryIndex = null; // Reset recovery
    }

    // Check for recovery (price reaches peak after trough)
    if (i > troughIndex && current >= peakValue && recoveryIndex === null) {
      recoveryIndex = i;
    }
  }

  const drawdownDuration = troughIndex - peakIndex;
  const recoveryDuration =
    recoveryIndex !== null ? recoveryIndex - troughIndex : null;

  return MaxDrawdownResultSchema.parse({
    maxDrawdown,
    maxDrawdownPercent,
    peakIndex,
    troughIndex,
    peakValue,
    troughValue,
    recoveryIndex,
    drawdownDuration,
    recoveryDuration,
  });
}
