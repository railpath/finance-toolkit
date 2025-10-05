import { z } from 'zod';

/**
 * Result of Quadratic Programming optimization
 */
export const QuadraticProgramResultSchema = z.object({
  /**
   * Solution vector
   */
  solution: z.array(z.number()),

  /**
   * Final objective value
   */
  objectiveValue: z.number(),

  /**
   * Whether optimization converged
   */
  converged: z.boolean(),

  /**
   * Number of iterations performed
   */
  iterations: z.number().int().min(0),

  /**
   * Final gradient norm
   */
  gradientNorm: z.number().min(0),

  /**
   * Constraint violation (if any)
   */
  constraintViolation: z.number().min(0)
});

export type QuadraticProgramResult = z.infer<typeof QuadraticProgramResultSchema>;
