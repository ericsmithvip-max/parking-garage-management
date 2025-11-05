/**
 * Car Validation Schemas
 */

import { z } from 'zod'

export const createCarSchema = z.object({
  license_plate_number: z.string().min(1).max(20).trim(),
  parking_spot_id: z.string().uuid().optional().nullable(),
  checkedin_at: z.string().datetime().optional().nullable(),
  checkedout_at: z.string().datetime().optional().nullable(),
})

export const updateCarSchema = z.object({
  license_plate_number: z.string().min(1).max(20).trim().optional(),
  parking_spot_id: z.string().uuid().optional().nullable(),
  checkedin_at: z.string().datetime().optional().nullable(),
  checkedout_at: z.string().datetime().optional().nullable(),
})

export const checkInCarSchema = z.object({
  license_plate_number: z.string().min(1).max(20).trim(),
  parking_spot_id: z.string().uuid(),
})

export const checkOutCarSchema = z.object({
  car_id: z.string().uuid(),
})

export type CreateCarInput = z.infer<typeof createCarSchema>
export type UpdateCarInput = z.infer<typeof updateCarSchema>
export type CheckInCarInput = z.infer<typeof checkInCarSchema>
export type CheckOutCarInput = z.infer<typeof checkOutCarSchema>
