/**
 * Garage Domain Entity
 *
 * Represents a parking garage with business logic
 */

import type { Tables } from '@/supabase/types/database.types'

export type GarageData = Tables<'garages'>

export class Garage {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly location: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly createdBy: string | null = null,
    public readonly updatedBy: string | null = null
  ) {}

  static fromDatabase(data: GarageData): Garage {
    return new Garage(
      data.id,
      data.name,
      data.location,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by
    )
  }

  static validate(data: { name: string; location: string }): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Garage name is required')
    }

    if (!data.location || data.location.trim().length === 0) {
      throw new Error('Garage location is required')
    }
  }
}
