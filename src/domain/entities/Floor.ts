/**
 * Floor Domain Entity
 *
 * Represents a floor within a garage
 */

import type { Tables } from '@/supabase/types/database.types'

export type FloorData = Tables<'floors'>

export class Floor {
  constructor(
    public readonly id: string,
    public readonly garageId: string,
    public readonly name: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly createdBy: string | null = null,
    public readonly updatedBy: string | null = null
  ) {}

  static fromDatabase(data: FloorData): Floor {
    return new Floor(
      data.id,
      data.garage_id,
      data.name,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by
    )
  }

  static validate(data: { garageId: string; name: string }): void {
    if (!data.garageId || data.garageId.trim().length === 0) {
      throw new Error('Garage ID is required')
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Floor name is required')
    }
  }
}
