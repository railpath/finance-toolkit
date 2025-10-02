import { CorrelationMatrixOptions, CorrelationMatrixOptionsSchema } from '../schemas/CorrelationMatrixOptionsSchema';
import { CorrelationMatrixResult, CorrelationMatrixResultSchema } from '../schemas/CorrelationMatrixResultSchema';

/**
 * Calculate Correlation Matrix
 * 
 * Pearson correlation coefficient between all pairs of return series.
 * ρ(X,Y) = Cov(X,Y) / (σ_X × σ_Y)
 * 
 * Range: [-1, 1]
 * +1: perfect positive correlation
 * 0: no correlation
 * -1: perfect negative correlation
 * 
 * @param options - Array of return series and optional labels
 * @returns Correlation matrix with stats
 */
export function calculateCorrelationMatrix(
  options: CorrelationMatrixOptions
): CorrelationMatrixResult {
  const { returns, labels } = CorrelationMatrixOptionsSchema.parse(options);

  const n = returns.length;

  // Validate all series have same length
  const seriesLength = returns[0].length;
  if (returns.some((series) => series.length !== seriesLength)) {
    throw new Error('All return series must have the same length');
  }

  if (seriesLength < 2) {
    throw new Error('Each return series must have at least 2 data points');
  }

  // Generate labels if not provided
  const finalLabels =
    labels && labels.length === n
      ? labels
      : Array.from({ length: n }, (_, i) => `Asset ${i + 1}`);

  // Calculate means
  const means = returns.map(
    (series) => series.reduce((sum, r) => sum + r, 0) / seriesLength
  );

  // Calculate standard deviations
  const stdDevs = returns.map((series, i) => {
    const variance =
      series.reduce((sum, r) => sum + Math.pow(r - means[i], 2), 0) /
      (seriesLength - 1);
    return Math.sqrt(variance);
  });

  // Calculate correlation matrix
  const matrix: number[][] = Array.from({ length: n }, () =>
    Array(n).fill(0)
  );

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1; // Perfect self-correlation
      } else {
        // Calculate covariance
        let covariance = 0;
        for (let k = 0; k < seriesLength; k++) {
          covariance +=
            (returns[i][k] - means[i]) * (returns[j][k] - means[j]);
        }
        covariance /= seriesLength - 1;

        // Calculate correlation
        const correlation =
          stdDevs[i] !== 0 && stdDevs[j] !== 0
            ? covariance / (stdDevs[i] * stdDevs[j])
            : 0;

        matrix[i][j] = correlation;
      }
    }
  }

  // Calculate stats (excluding diagonal)
  const offDiagonal: number[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      offDiagonal.push(matrix[i][j]);
    }
  }

  const averageCorrelation =
    offDiagonal.length > 0
      ? offDiagonal.reduce((sum, c) => sum + c, 0) / offDiagonal.length
      : 0;

  const maxCorrelation =
    offDiagonal.length > 0 ? Math.max(...offDiagonal) : 1;
  const minCorrelation =
    offDiagonal.length > 0 ? Math.min(...offDiagonal) : 1;

  return CorrelationMatrixResultSchema.parse({
    matrix,
    labels: finalLabels,
    averageCorrelation,
    maxCorrelation,
    minCorrelation,
  });
}
