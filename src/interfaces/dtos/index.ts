/**
 * Data Transfer Objects (DTOs)
 *
 * Transformation utilities between domain entities and API responses
 */

import type { Tables } from '@/supabase/types/database.types'

export type GarageDTO = Tables<'garages'>
export type FloorDTO = Tables<'floors'>
export type BayDTO = Tables<'bays'>
export type ParkingSpotDTO = Tables<'parking_spots'>
export type CarDTO = Tables<'cars'>
export type ParkingFeeDTO = Tables<'parking_fees'>

export function toGarageDTO(data: Tables<'garages'>): GarageDTO {
  return data
}

export function toFloorDTO(data: Tables<'floors'>): FloorDTO {
  return data
}

export function toBayDTO(data: Tables<'bays'>): BayDTO {
  return data
}

export function toParkingSpotDTO(data: Tables<'parking_spots'>): ParkingSpotDTO {
  return data
}

export function toCarDTO(data: Tables<'cars'>): CarDTO {
  return data
}

export function toParkingFeeDTO(data: Tables<'parking_fees'>): ParkingFeeDTO {
  return data
}
