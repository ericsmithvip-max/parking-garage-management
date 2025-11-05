/**
 * Parking Spot Repository
 *
 * Handles database operations for parking spots with status management
 */

import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/supabase/types/database.types'
import { DatabaseError, NotFoundError } from '@/lib/api/errors'
import { logError, logInfo } from '@/lib/logger'
import type { ParkingSpotStatusType } from '@/src/domain/value-objects/ParkingSpotStatus'
import type { SpotSizeType } from '@/src/domain/value-objects/SpotSize'

export type ParkingSpotRow = Tables<'parking_spots'>
export type ParkingSpotInsert = TablesInsert<'parking_spots'>
export type ParkingSpotUpdate = TablesUpdate<'parking_spots'>

export interface ParkingSpotFilters {
  status?: ParkingSpotStatusType
  floorId?: string
  bayId?: string
  size?: SpotSizeType
}

export class ParkingSpotRepository {
  async getById(id: string): Promise<ParkingSpotRow | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      logError(error, { context: 'ParkingSpotRepository.getById', id })
      throw new DatabaseError('Failed to fetch parking spot')
    }
  }

  async getAll(filters?: ParkingSpotFilters): Promise<ParkingSpotRow[]> {
    try {
      const supabase = await createClient()
      let query = supabase
        .from('parking_spots')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.floorId) {
        query = query.eq('floor_id', filters.floorId)
      }

      if (filters?.bayId) {
        query = query.eq('bay_id', filters.bayId)
      }

      if (filters?.size) {
        query = query.eq('size', filters.size)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError(error, { context: 'ParkingSpotRepository.getAll', filters })
      throw new DatabaseError('Failed to fetch parking spots')
    }
  }

  async getByStatus(status: ParkingSpotStatusType): Promise<ParkingSpotRow[]> {
    return this.getAll({ status })
  }

  async getByFloor(floorId: string): Promise<ParkingSpotRow[]> {
    return this.getAll({ floorId })
  }

  async getByBay(bayId: string): Promise<ParkingSpotRow[]> {
    return this.getAll({ bayId })
  }

  async create(data: ParkingSpotInsert): Promise<ParkingSpotRow> {
    try {
      const supabase = await createClient()
      const { data: spot, error } = await supabase
        .from('parking_spots')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      logInfo('Parking spot created', { spotId: spot.id })
      return spot
    } catch (error) {
      logError(error, { context: 'ParkingSpotRepository.create' })
      throw new DatabaseError('Failed to create parking spot')
    }
  }

  async update(id: string, data: ParkingSpotUpdate): Promise<ParkingSpotRow> {
    try {
      const supabase = await createClient()
      const { data: spot, error } = await supabase
        .from('parking_spots')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Parking spot', id)
        }
        throw error
      }

      logInfo('Parking spot updated', { spotId: id })
      return spot
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logError(error, { context: 'ParkingSpotRepository.update', id })
      throw new DatabaseError('Failed to update parking spot')
    }
  }

  async markOccupied(id: string): Promise<ParkingSpotRow> {
    return this.update(id, { status: 'occupied' })
  }

  async markAvailable(id: string): Promise<ParkingSpotRow> {
    return this.update(id, { status: 'available' })
  }

  async delete(id: string): Promise<void> {
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('parking_spots')
        .delete()
        .eq('id', id)

      if (error) throw error

      logInfo('Parking spot deleted', { spotId: id })
    } catch (error) {
      logError(error, { context: 'ParkingSpotRepository.delete', id })
      throw new DatabaseError('Failed to delete parking spot')
    }
  }
}
