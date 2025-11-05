/**
 * Parking Fee Domain Entity
 *
 * Represents a billing record for a parked car
 */

import type { Tables } from '@/supabase/types/database.types'

export type ParkingFeeData = Tables<'parking_fees'>

export class ParkingFee {
  constructor(
    public readonly id: string,
    public readonly carId: string,
    public readonly billedAt: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly createdBy: string | null = null,
    public readonly updatedBy: string | null = null
  ) {}

  static fromDatabase(data: ParkingFeeData): ParkingFee {
    return new ParkingFee(
      data.id,
      data.car_id,
      data.billed_at,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by
    )
  }

  static validate(data: { carId: string }): void {
    if (!data.carId || data.carId.trim().length === 0) {
      throw new Error('Car ID is required')
    }
  }
}
