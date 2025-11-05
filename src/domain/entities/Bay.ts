/**
 * Bay Domain Entity
 *
 * Represents a bay (section) within a floor
 */

import type { Tables } from '@/supabase/types/database.types'

export type BayData = Tables<'bays'>

export class Bay {
  constructor(
    public readonly id: string,
    public readonly floorId: string,
    public readonly name: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly createdBy: string | null = null,
    public readonly updatedBy: string | null = null
  ) {}

  static fromDatabase(data: BayData): Bay {
    return new Bay(
      data.id,
      data.floor_id,
      data.name,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by
    )
  }

  static validate(data: { floorId: string; name: string }): void {
    if (!data.floorId || data.floorId.trim().length === 0) {
      throw new Error('Floor ID is required')
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Bay name is required')
    }
  }
}
