/**
 * Parking Spot Domain Entity
 *
 * Represents a parking spot with status, size, rate, and features
 */

import type { Tables, Json } from '@/supabase/types/database.types'
import { ParkingSpotStatus, type ParkingSpotStatusType } from '../value-objects/ParkingSpotStatus'
import { SpotSize, type SpotSizeType } from '../value-objects/SpotSize'

export type ParkingSpotData = Tables<'parking_spots'>

export class ParkingSpot {
  constructor(
    public readonly id: string,
    public readonly floorId: string,
    public readonly bayId: string | null,
    public readonly name: string,
    public readonly size: SpotSizeType,
    public readonly status: ParkingSpotStatusType,
    public readonly rate: number,
    public readonly features: Json | null,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly createdBy: string | null = null,
    public readonly updatedBy: string | null = null
  ) {}

  static fromDatabase(data: ParkingSpotData): ParkingSpot {
    return new ParkingSpot(
      data.id,
      data.floor_id,
      data.bay_id,
      data.name,
      data.size as SpotSizeType,
      data.status as ParkingSpotStatusType,
      data.rate,
      data.features,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by
    )
  }

  static validate(data: {
    floorId: string
    name: string
    size: string
    status: string
    rate: number
  }): void {
    if (!data.floorId || data.floorId.trim().length === 0) {
      throw new Error('Floor ID is required')
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Parking spot name is required')
    }

    if (!Object.values(SpotSize).includes(data.size as SpotSizeType)) {
      throw new Error(`Invalid spot size. Must be one of: ${Object.values(SpotSize).join(', ')}`)
    }

    if (!Object.values(ParkingSpotStatus).includes(data.status as ParkingSpotStatusType)) {
      throw new Error(`Invalid status. Must be one of: ${Object.values(ParkingSpotStatus).join(', ')}`)
    }

    if (data.rate <= 0) {
      throw new Error('Rate must be greater than 0')
    }
  }

  canTransitionTo(newStatus: ParkingSpotStatusType): boolean {
    if (newStatus === this.status) {
      return false
    }

    return (
      (this.status === ParkingSpotStatus.AVAILABLE && newStatus === ParkingSpotStatus.OCCUPIED) ||
      (this.status === ParkingSpotStatus.OCCUPIED && newStatus === ParkingSpotStatus.AVAILABLE)
    )
  }

  isAvailable(): boolean {
    return this.status === ParkingSpotStatus.AVAILABLE
  }

  isOccupied(): boolean {
    return this.status === ParkingSpotStatus.OCCUPIED
  }
}
