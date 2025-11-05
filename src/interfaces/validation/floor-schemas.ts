/**
 * Floor Validation Schemas
 */

import { z } from 'zod'

export const createFloorSchema = z.object({
  garage_id: z.string().uuid(),
  name: z.string().min(1).trim(),
})

export const updateFloorSchema = z.object({
  garage_id: z.string().uuid().optional(),
  name: z.string().min(1).trim().optional(),
})

export const floorQuerySchema = z.object({
  garage_id: z.string().uuid().optional(),
})

export type CreateFloorInput = z.infer<typeof createFloorSchema>
export type UpdateFloorInput = z.infer<typeof updateFloorSchema>
export type FloorQueryParams = z.infer<typeof floorQuerySchema>
