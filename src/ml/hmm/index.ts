/**
 * Hidden Markov Model for Regime Detection
 * 
 * Provides both high-level and low-level APIs for HMM-based regime detection
 */

// High-Level API
export { detectRegime } from './detectRegime';

// Low-Level API for Advanced Users
export { trainHMM } from './core/trainHMM';
export { extractFeatures } from './core/extractFeatures';
export { initializeHMM } from './core/initializeHMM';
export { forward } from './algorithms/forward';
export { backward } from './algorithms/backward';
export { viterbi } from './algorithms/viterbi';
export { baumWelch } from './algorithms/baumWelch';

// Types (from schemas)
export type { HMMModel } from '../schemas/HMMModelSchema';
export type { EmissionParams } from '../schemas/EmissionParamsSchema';
export type { BaumWelchOptions } from '../schemas/BaumWelchOptionsSchema';
export type { ForwardResult } from '../schemas/ForwardResultSchema';
export type { BackwardResult } from '../schemas/BackwardResultSchema';
export type { ViterbiResult } from '../schemas/ViterbiResultSchema';
export type { TrainHMMOptions } from '../schemas/TrainHMMOptionsSchema';
export type { FeatureOptions } from '../schemas/FeatureOptionsSchema';

// Types (local)
export type { FeatureConfig } from './types';
export type { FeatureExtractionOptions } from './core/extractFeatures';

