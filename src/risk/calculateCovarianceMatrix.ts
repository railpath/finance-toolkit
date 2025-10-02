import { CovarianceMatrixOptions, CovarianceMatrixOptionsSchema } from '../schemas/CovarianceMatrixOptionsSchema';
import { CovarianceMatrixResult, CovarianceMatrixResultSchema } from '../schemas/CovarianceMatrixResultSchema';

/**
 * Calculate Covariance Matrix
 * 
 * Cov(X,Y) = E[(X - μ_X)(Y - μ_Y)]
 * 
 * Measures how two variables move together.
 * Diagonal = variances
 * Off-diagonal = covariances
 * 
 * @param options - Array of return series and optional labels
 * @returns Covariance matrix with variances
 */
export function calculateCovarianceMatrix(
  options: CovarianceMatrixOptions
): CovarianceMatrixResult {
  const { returns, labels } = CovarianceMatrixOptionsSchema.parse(options);

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

  // Calculate covariance matrix
  const matrix: number[][] = Array.from({ length: n }, () =>
    Array(n).fill(0)
  );

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let covariance = 0;
      for (let k = 0; k < seriesLength; k++) {
        covariance +=
          (returns[i][k] - means[i]) * (returns[j][k] - means[j]);
      }
      covariance /= seriesLength - 1; // Sample covariance

      matrix[i][j] = covariance;
    }
  }

  // Extract variances (diagonal)
  const variances = matrix.map((row, i) => row[i]);

  // Calculate average covariance (off-diagonal only)
  const offDiagonal: number[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      offDiagonal.push(matrix[i][j]);
    }
  }

  const averageCovariance =
    offDiagonal.length > 0
      ? offDiagonal.reduce((sum, c) => sum + c, 0) / offDiagonal.length
      : 0;

  return CovarianceMatrixResultSchema.parse({
    matrix,
    labels: finalLabels,
    variances,
    averageCovariance,
  });
}
