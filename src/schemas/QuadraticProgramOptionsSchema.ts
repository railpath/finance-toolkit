import { z } from 'zod';

/**
 * Options for Quadratic Programming optimization
 */
export const QuadraticProgramOptionsSchema = z.object({
  /**
   * Equality constraints: Ax = b
   */
  equalityConstraints: z.object({
    /**
     * Constraint matrix (m×n)
     */
    A: z.array(z.array(z.number())),
    /**
     * Constraint vector (m×1)
     */
    b: z.array(z.number())
  }).optional(),

  /**
   * Non-negativity constraints: x ≥ 0
   */
  nonNegative: z.boolean().default(false),

  /**
   * Maximum number of iterations
   */
  maxIterations: z.number().int().positive().default(1000),

  /**
   * Convergence tolerance
   */
  tolerance: z.number().positive().default(1e-3),

  /**
   * Initial guess for solution vector
   */
  initialGuess: z.array(z.number()).optional()
});

export type QuadraticProgramOptions = z.infer<typeof QuadraticProgramOptionsSchema>;
export type QuadraticProgramOptionsValidated = z.infer<typeof QuadraticProgramOptionsSchema>;
