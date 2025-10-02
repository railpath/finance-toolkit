/**
 * Get Z-score for a given confidence level (standard normal distribution)
 */
export function getZScore(confidenceLevel: number): number {
  // Approximation using rational function (accurate to ~0.00001)
  const p = 1 - confidenceLevel;
  const t = Math.sqrt(-2 * Math.log(p));
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;

  return t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
}