/**
 * Parking Spot Validation Schemas
 */

import { z } from 'zod'
import { ParkingSpotStatus } from '@/src/domain/value-objects/ParkingSpotStatus'
import { SpotSize } from '@/src/domain/value-objects/SpotSize'

export const createParkingSpotSchema = z.object({
  floor_id: z.string().uuid(),
  bay_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1).trim(),
  size: z.enum([SpotSize.COMPACT, SpotSize.STANDARD, SpotSize.OVERSIZED]),
  status: z.enum([ParkingSpotStatus.AVAILABLE, ParkingSpotStatus.OCCUPIED]),
  rate: z.number().positive(),
  features: z.record(z.unknown()).optional().nullable(),
})

export const updateParkingSpotSchema = z.object({
  floor_id: z.string().uuid().optional(),
  bay_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1).trim().optional(),
  size: z.enum([SpotSize.COMPACT, SpotSize.STANDARD, SpotSize.OVERSIZED]).optional(),
  status: z.enum([ParkingSpotStatus.AVAILABLE, ParkingSpotStatus.OCCUPIED]).optional(),
  rate: z.number().positive().optional(),
  features: z.record(z.unknown()).optional().nullable(),
})

export const parkingSpotQuerySchema = z.object({
  status: z.enum([ParkingSpotStatus.AVAILABLE, ParkingSpotStatus.OCCUPIED]).optional(),
  floor_id: z.string().uuid().optional(),
  bay_id: z.string().uuid().optional(),
  size: z.enum([SpotSize.COMPACT, SpotSize.STANDARD, SpotSize.OVERSIZED]).optional(),
})

export type CreateParkingSpotInput = z.infer<typeof createParkingSpotSchema>
export type UpdateParkingSpotInput = z.infer<typeof updateParkingSpotSchema>
export type ParkingSpotQueryParams = z.infer<typeof parkingSpotQuerySchema>
