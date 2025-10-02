import { z } from 'zod';

/**
 * Zod schema for volatility calculation options
 */
export const VolatilityOptionsSchema = z.object({
  method: z.enum(['standard', 'exponential', 'parkinson', 'garman-klass']),
  annualizationFactor: z.number().positive().optional(),
  lambda: z.number().min(0).max(1).optional(),
  highPrices: z.array(z.number().positive()).optional(),
  lowPrices: z.array(z.number().positive()).optional(),
  openPrices: z.array(z.number().positive()).optional(),
  closePrices: z.array(z.number().positive()).optional(),
}).superRefine((data, ctx) => {
  // EWMA-specific validation
  if (data.method === 'exponential' && data.lambda === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Lambda is required for exponential method',
      path: ['lambda'],
    });
  }

  // Parkinson-specific validation
  if (data.method === 'parkinson') {
    if (!data.highPrices) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'High prices required for Parkinson method',
        path: ['highPrices'],
      });
    }
    if (!data.lowPrices) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Low prices required for Parkinson method',
        path: ['lowPrices'],
      });
    }
    if (data.highPrices && data.lowPrices && data.highPrices.length !== data.lowPrices.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'High and low prices must have equal length',
        path: ['highPrices'],
      });
    }
  }

  // Garman-Klass-specific validation
  if (data.method === 'garman-klass') {
    const requiredFields = ['openPrices', 'highPrices', 'lowPrices', 'closePrices'] as const;
    const missing = requiredFields.filter(field => !data[field]);
    
    if (missing.length > 0) {
      missing.forEach(field => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field} required for Garman-Klass method`,
          path: [field],
        });
      });
    }

    // Length validation
    if (data.openPrices && data.highPrices && data.lowPrices && data.closePrices) {
      const lengths = [
        data.openPrices.length,
        data.highPrices.length,
        data.lowPrices.length,
        data.closePrices.length,
      ];
      
      if (new Set(lengths).size > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'All OHLC arrays must have equal length',
          path: ['openPrices'],
        });
      }
    }
  }
});

/**
 * TypeScript types derived from Zod schemas
 */
export type VolatilityOptions = z.infer<typeof VolatilityOptionsSchema>;

/**
 * Validated type after parsing
 */
export type VolatilityOptionsValidated = z.output<typeof VolatilityOptionsSchema>;