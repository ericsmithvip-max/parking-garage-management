/**
 * Car Domain Entity
 *
 * Represents a vehicle in the parking system
 */

import type { Tables } from '@/supabase/types/database.types'
import { LicensePlate } from '../value-objects/LicensePlate'

export type CarData = Tables<'cars'>

export class Car {
  constructor(
    public readonly id: string,
    public readonly licensePlateNumber: string,
    public readonly parkingSpotId: string | null,
    public readonly checkedinAt: string | null,
    public readonly checkedoutAt: string | null,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly createdBy: string | null = null,
    public readonly updatedBy: string | null = null
  ) {}

  static fromDatabase(data: CarData): Car {
    return new Car(
      data.id,
      data.license_plate_number,
      data.parking_spot_id,
      data.checkedin_at,
      data.checkedout_at,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by
    )
  }

  static validate(data: { licensePlateNumber: string }): void {
    try {
      LicensePlate.create(data.licensePlateNumber)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid license plate')
    }
  }

  isCheckedIn(): boolean {
    return this.checkedinAt !== null && this.checkedoutAt === null
  }

  isCheckedOut(): boolean {
    return this.checkedoutAt !== null
  }
}
