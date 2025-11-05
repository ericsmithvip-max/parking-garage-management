/**
 * Bay Validation Schemas
 */

import { z } from 'zod'

export const createBaySchema = z.object({
  floor_id: z.string().uuid(),
  name: z.string().min(1).trim(),
})

export const updateBaySchema = z.object({
  floor_id: z.string().uuid().optional(),
  name: z.string().min(1).trim().optional(),
})

export const bayQuerySchema = z.object({
  floor_id: z.string().uuid().optional(),
})

export type CreateBayInput = z.infer<typeof createBaySchema>
export type UpdateBayInput = z.infer<typeof updateBaySchema>
export type BayQueryParams = z.infer<typeof bayQuerySchema>
