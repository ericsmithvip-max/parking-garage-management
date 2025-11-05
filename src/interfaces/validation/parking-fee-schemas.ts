/**
 * Parking Fee Validation Schemas
 */

import { z } from 'zod'

export const createParkingFeeSchema = z.object({
  car_id: z.string().uuid(),
  billed_at: z.string().datetime().optional(),
})

export const updateParkingFeeSchema = z.object({
  car_id: z.string().uuid().optional(),
  billed_at: z.string().datetime().optional(),
})

export const parkingFeeQuerySchema = z.object({
  car_id: z.string().uuid().optional(),
})

export type CreateParkingFeeInput = z.infer<typeof createParkingFeeSchema>
export type UpdateParkingFeeInput = z.infer<typeof updateParkingFeeSchema>
export type ParkingFeeQueryParams = z.infer<typeof parkingFeeQuerySchema>
