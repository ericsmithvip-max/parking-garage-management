/**
 * Car Validation Schemas
 */

import { z } from 'zod'

export const createCarSchema = z.object({
  license_plate_number: z.string().min(1).max(20).trim(),
  checkedin_at: z.string().datetime().optional().nullable(),
  checkedout_at: z.string().datetime().optional().nullable(),
})

export const updateCarSchema = z.object({
  license_plate_number: z.string().min(1).max(20).trim().optional(),
  checkedin_at: z.string().datetime().optional().nullable(),
  checkedout_at: z.string().datetime().optional().nullable(),
})

export type CreateCarInput = z.infer<typeof createCarSchema>
export type UpdateCarInput = z.infer<typeof updateCarSchema>
