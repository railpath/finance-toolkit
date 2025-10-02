import { z } from 'zod';

export const PerformanceAttributionResultSchema = z.object({
  /**
   * Total portfolio return
   */
  portfolioReturn: z.number(),
  
  /**
   * Total benchmark return
   */
  benchmarkReturn: z.number(),
  
  /**
   * Total excess return (portfolio - benchmark)
   */
  excessReturn: z.number(),
  
  /**
   * Asset allocation effect (sector/asset selection)
   */
  allocationEffect: z.number(),
  
  /**
   * Security selection effect (stock picking)
   */
  selectionEffect: z.number(),
  
  /**
   * Interaction effect (allocation × selection)
   */
  interactionEffect: z.number(),
  
  /**
   * Asset-level attribution breakdown
   */
  assetAttribution: z.array(z.object({
    assetIndex: z.number(),
    allocationEffect: z.number(),
    selectionEffect: z.number(),
    interactionEffect: z.number(),
    totalEffect: z.number(),
  })),
  
  /**
   * Number of periods
   */
  periods: z.number(),
  
  /**
   * Number of assets
   */
  assets: z.number(),
  
  /**
   * Annualization factor used
   */
  annualizationFactor: z.number(),
  
  /**
   * Attribution method used
   */
  method: z.enum(['brinson', 'arithmetic']),
});

export type PerformanceAttributionResult = z.infer<typeof PerformanceAttributionResultSchema>;
