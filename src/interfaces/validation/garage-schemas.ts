/**
 * Garage Validation Schemas
 */

import { z } from 'zod'

export const createGarageSchema = z.object({
  name: z.string().min(1).trim(),
  location: z.string().min(1).trim(),
})

export const updateGarageSchema = z.object({
  name: z.string().min(1).trim().optional(),
  location: z.string().min(1).trim().optional(),
})

export type CreateGarageInput = z.infer<typeof createGarageSchema>
export type UpdateGarageInput = z.infer<typeof updateGarageSchema>
