// Technical Indicators - Trend
export { calculateSMA } from './indicators/trend/calculateSMA';
export { calculateEMA } from './indicators/trend/calculateEMA';
export { calculateMACD } from './indicators/trend/calculateMACD';

// Technical Indicators - Momentum
export { calculateRSI } from './indicators/momentum/calculateRSI';
export { calculateStochastic } from './indicators/momentum/calculateStochastic';
export { calculateWilliamsR } from './indicators/momentum/calculateWilliamsR';

// Technical Indicators - Volatility
export { calculateBollingerBands } from './indicators/volatility/calculateBollingerBands';
export { calculateATR } from './indicators/volatility/calculateATR';

// Risk Metrics
export { calculateAlpha } from './risk/calculateAlpha';
export { calculateBeta } from './risk/calculateBeta';
export { calculateCalmarRatio } from './risk/calculateCalmarRatio';
export { calculateCorrelationMatrix } from './risk/calculateCorrelationMatrix';
export { calculateCovarianceMatrix } from './risk/calculateCovarianceMatrix';
export { calculateEWMAVolatility } from './risk/calculateEWMAVolatility';
export { calculateGarmanKlassVolatility } from './risk/calculateGarmanKlassVolatility';
export { calculateHistoricalExpectedShortfall } from './risk/calculateHistoricalExpectedShortfall';
export { calculateHistoricalVaR } from './risk/calculateHistoricalVaR';
export { calculateKurtosis } from './risk/calculateKurtosis';
export { calculateMaxDrawdown } from './risk/calculateMaxDrawdown';
export { calculateMonteCarloVaR } from './risk/calculateMonteCarloVaR';
export { calculateParametricExpectedShortfall } from './risk/calculateParametricExpectedShortfall';
export { calculateParametricVaR } from './risk/calculateParametricVaR';
export { calculateParkinsonVolatility } from './risk/calculateParkinsonVolatility';
export { calculatePortfolioVolatility } from './risk/calculatePortfolioVolatility';
export { calculateSemideviation } from './risk/calculateSemideviation';
export { calculateSharpeRatio } from './risk/calculateSharpeRatio';
export { calculateSkewness } from './risk/calculateSkewness';
export { calculateSortinoRatio } from './risk/calculateSortinoRatio';
export { calculateStandardDeviation } from './risk/calculateStandardDeviation';
export { calculateVaR } from './risk/calculateVaR';
export { calculateVaR95 } from './risk/calculateVaR95';
export { calculateVaR99 } from './risk/calculateVaR99';
export { calculateVolatility } from './risk/calculateVolatility';

// Portfolio Performance Metrics
export { calculateTimeWeightedReturn } from './portfolio/calculateTimeWeightedReturn';
export { calculateMoneyWeightedReturn } from './portfolio/calculateMoneyWeightedReturn';
export { calculatePortfolioMetrics } from './portfolio/calculatePortfolioMetrics';
export { calculatePerformanceAttribution } from './portfolio/calculatePerformanceAttribution';
export { calculatePortfolioOptimization } from './portfolio/calculatePortfolioOptimization';
export { calculatePortfolioRebalancing } from './portfolio/calculatePortfolioRebalancing';
export { calculateEqualWeightPortfolio } from './portfolio/calculateEqualWeightPortfolio';
export { calculateReturns } from './portfolio/calculateReturns';
export { calculateRiskMetrics } from './portfolio/calculateRiskMetrics';
export { calculateInformationRatio } from './portfolio/calculateInformationRatio';
export { calculateTrackingError } from './portfolio/calculateTrackingError';

// Utility Functions
export { getZScore } from './utils/getZScore';
export { inverseErf } from './utils/inverseErf';
export { solveQuadraticProgram } from './utils/solveQuadraticProgram';

// Vector Operations
export { 
  vectorNorm, 
  vectorAdd, 
  vectorSubtract, 
  vectorScale, 
  vectorDot,
  vectorCross,
  vectorNormalize,
  vectorDistance,
  vectorEquals,
  createZeroVector,
  createConstantVector
} from './utils/vectorOperations';

// Matrix Operations
export { 
  matrixVectorMultiply,
  matrixTranspose,
  matrixMatrixMultiply,
  matrixTrace,
  isMatrixSymmetric,
  isMatrixPositiveDefinite,
  createIdentityMatrix,
  createZeroMatrix,
  matrixDiagonal,
  matrixFrobeniusNorm
} from './utils/matrixOperations';

// Linear System Solver
export { 
  solveLinearSystem,
  solveMultipleLinearSystems,
  matrixDeterminant,
  luDecomposition,
  isMatrixInvertible,
  matrixConditionNumber
} from './utils/linearSystemSolver';

// Constraint Projection
export { 
  projectOntoEqualityConstraints,
  projectOntoNonNegativityConstraints,
  projectOntoBoxConstraints,
  projectOntoSimplex,
  projectGradientOntoEqualityConstraints,
  projectGradientOntoNonNegativityConstraints,
  calculateEqualityConstraintViolation,
  calculateInequalityConstraintViolation,
  isSolutionFeasible
} from './utils/constraintProjection';

// Technical Indicator Type Exports
export type { SMAOptions } from './schemas/SMAOptionsSchema';
export type { SMAResult } from './schemas/SMAResultSchema';
export type { EMAOptions } from './schemas/EMAOptionsSchema';
export type { EMAResult } from './schemas/EMAResultSchema';
export type { MACDOptions } from './schemas/MACDOptionsSchema';
export type { MACDResult } from './schemas/MACDResultSchema';
export type { RSIOptions } from './schemas/RSIOptionsSchema';
export type { RSIResult } from './schemas/RSIResultSchema';
export type { StochasticOptions } from './schemas/StochasticOptionsSchema';
export type { StochasticResult } from './schemas/StochasticResultSchema';
export type { WilliamsROptions } from './schemas/WilliamsROptionsSchema';
export type { WilliamsRResult } from './schemas/WilliamsRResultSchema';
export type { BollingerBandsOptions } from './schemas/BollingerBandsOptionsSchema';
export type { BollingerBandsResult } from './schemas/BollingerBandsResultSchema';
export type { ATROptions } from './schemas/ATROptionsSchema';
export type { ATRResult } from './schemas/ATRResultSchema';

// Type Exports
export type { AlphaOptions } from './schemas/AlphaOptionsSchema';
export type { AlphaResult } from './schemas/AlphaResultSchema';
export type { BetaOptions } from './schemas/BetaOptionsSchema';
export type { BetaResult } from './schemas/BetaResultSchema';
export type { CalmarRatioOptions } from './schemas/CalmarRatioOptionsSchema';
export type { CalmarRatioResult } from './schemas/CalmarRatioResultSchema';
export type { CorrelationMatrixOptions } from './schemas/CorrelationMatrixOptionsSchema';
export type { CorrelationMatrixResult } from './schemas/CorrelationMatrixResultSchema';
export type { CovarianceMatrixOptions } from './schemas/CovarianceMatrixOptionsSchema';
export type { CovarianceMatrixResult } from './schemas/CovarianceMatrixResultSchema';
export type { ExpectedShortfallOptions } from './schemas/ExpectedShortfallOptionsSchema';
export type { ExpectedShortfallResult } from './schemas/ExpectedShortfallResultSchema';
export type { MaxDrawdownOptions } from './schemas/MaxDrawdownOptionsSchema';
export type { MaxDrawdownResult } from './schemas/MaxDrawdownResultSchema';
export type { PortfolioVolatilityOptions } from './schemas/PortfolioVolatilityOptionsSchema';
export type { PortfolioVolatilityResult } from './schemas/PortfolioVolatilityResultSchema';
export type { SharpeRatioOptions } from './schemas/SharpeRatioOptionsSchema';
export type { SharpeRatioResult } from './schemas/SharpeRatioResultSchema';
export type { SortinoRatioOptions } from './schemas/SortinoRatioOptionsSchema';
export type { SortinoRatioResult } from './schemas/SortinoRatioResultSchema';
export type { VaROptions } from './schemas/VaROptionsSchema';
export type { VaRResult } from './schemas/VaRResultSchema';
export type { VolatilityOptions } from './schemas/VolatilityOptionsSchema';
export type { VolatilityResult } from './schemas/VolatilityResultSchema';

// Portfolio Type Exports
export type { TimeWeightedReturnOptions } from './schemas/TimeWeightedReturnOptionsSchema';
export type { TimeWeightedReturnResult } from './schemas/TimeWeightedReturnResultSchema';
export type { MoneyWeightedReturnOptions } from './schemas/MoneyWeightedReturnOptionsSchema';
export type { MoneyWeightedReturnResult } from './schemas/MoneyWeightedReturnResultSchema';
export type { PortfolioMetricsOptions } from './schemas/PortfolioMetricsOptionsSchema';
export type { PortfolioMetricsResult } from './schemas/PortfolioMetricsResultSchema';
export type { PerformanceAttributionOptions } from './schemas/PerformanceAttributionOptionsSchema';
export type { PerformanceAttributionResult } from './schemas/PerformanceAttributionResultSchema';
export type { PortfolioOptimizationOptions } from './schemas/PortfolioOptimizationOptionsSchema';
export type { PortfolioOptimizationResult } from './schemas/PortfolioOptimizationResultSchema';
export type { PortfolioRebalancingOptions } from './schemas/PortfolioRebalancingOptionsSchema';
export type { PortfolioRebalancingResult } from './schemas/PortfolioRebalancingResultSchema';
export type { EqualWeightOptions } from './schemas/EqualWeightOptionsSchema';
export type { EqualWeightResult } from './schemas/EqualWeightResultSchema';
export type { ReturnCalculationOptions } from './schemas/ReturnCalculationOptionsSchema';
export type { ReturnCalculationResult } from './schemas/ReturnCalculationResultSchema';
export type { RiskMetricsOptions } from './schemas/RiskMetricsOptionsSchema';
export type { RiskMetricsResult } from './schemas/RiskMetricsResultSchema';
export type { InformationRatioOptions } from './schemas/InformationRatioOptionsSchema';
export type { InformationRatioResult } from './schemas/InformationRatioResultSchema';
export type { TrackingErrorOptions } from './schemas/TrackingErrorOptionsSchema';
export type { TrackingErrorResult } from './schemas/TrackingErrorResultSchema';

// Risk Type Exports (New Functions)
export type { SemideviationOptions } from './schemas/SemideviationOptionsSchema';
export type { SemideviationResult } from './schemas/SemideviationResultSchema';

// Utility Type Exports
export type { QuadraticProgramOptions } from './schemas/QuadraticProgramOptionsSchema';
export type { QuadraticProgramResult } from './schemas/QuadraticProgramResultSchema';

// Machine Learning - Regime Detection
export { detectRegime } from './ml/hmm/detectRegime';
export { 
  trainHMM, 
  extractFeatures, 
  initializeHMM,
  forward, 
  backward, 
  viterbi, 
  baumWelch 
} from './ml/hmm';

// Machine Learning - Utils (for Power Users)
export { 
  logSumExp, 
  normalizeRows, 
  normalizeArray, 
  addNoise,
  gaussianPDF, 
  logGaussianPDF,
  calculateMean, 
  calculateVariance, 
  standardize,
  multivariateGaussianPDF,
  logMultivariateGaussianPDF,
  validatePriceArray,
  validateFeatureMatrix,
  validateHMMParameters,
  validateNumStates
} from './ml/utils';

// ML Type Exports
export type { RegimeDetectionOptions } from './ml/schemas/RegimeDetectionOptionsSchema';
export type { RegimeDetectionResult } from './ml/schemas/RegimeDetectionResultSchema';
export type { HMMModel } from './ml/schemas/HMMModelSchema';
export type { EmissionParams } from './ml/schemas/EmissionParamsSchema';
export type { FeatureOptions } from './ml/schemas/FeatureOptionsSchema';
export type { BaumWelchOptions } from './ml/schemas/BaumWelchOptionsSchema';
export type { ForwardResult } from './ml/schemas/ForwardResultSchema';
export type { BackwardResult } from './ml/schemas/BackwardResultSchema';
export type { ViterbiResult } from './ml/schemas/ViterbiResultSchema';
export type { TrainHMMOptions } from './ml/schemas/TrainHMMOptionsSchema';
