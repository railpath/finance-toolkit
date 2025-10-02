/**
 * Inverse error function approximation
 */
export function inverseErf(x: number): number {
  const a = 0.147;
  const b = 2 / (Math.PI * a) + Math.log(1 - x * x) / 2;
  const sqrt1 = Math.sqrt(b * b - Math.log(1 - x * x) / a);
  const sqrt2 = Math.sqrt(sqrt1 - b);
  return sqrt2 * Math.sign(x);
}
