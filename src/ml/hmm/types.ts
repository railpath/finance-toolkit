/**
 * HMM Types and Interfaces
 * 
 * Re-exports types from Zod schemas for convenience
 */

// Re-export from schemas
export type { EmissionParams } from '../schemas/EmissionParamsSchema';
export type { HMMModel } from '../schemas/HMMModelSchema';
export type { BaumWelchOptions } from '../schemas/BaumWelchOptionsSchema';
export type { ForwardResult } from '../schemas/ForwardResultSchema';
export type { BackwardResult } from '../schemas/BackwardResultSchema';
export type { ViterbiResult } from '../schemas/ViterbiResultSchema';
export type { TrainHMMOptions } from '../schemas/TrainHMMOptionsSchema';

/**
 * Feature configuration
 */
export type FeatureConfig = 'default' | string[] | number[][];
