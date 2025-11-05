/**
 * Floor Repository
 *
 * Handles database operations for floors
 */

import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/supabase/types/database.types'
import { DatabaseError, NotFoundError } from '@/lib/api/errors'
import { logError, logInfo } from '@/lib/logger'

export type FloorRow = Tables<'floors'>
export type FloorInsert = TablesInsert<'floors'>
export type FloorUpdate = TablesUpdate<'floors'>

export interface FloorFilters {
  garageId?: string
}

export class FloorRepository {
  async getById(id: string): Promise<FloorRow | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('floors')
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
      logError(error, { context: 'FloorRepository.getById', id })
      throw new DatabaseError('Failed to fetch floor')
    }
  }

  async getAll(filters?: FloorFilters): Promise<FloorRow[]> {
    try {
      const supabase = await createClient()
      let query = supabase
        .from('floors')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.garageId) {
        query = query.eq('garage_id', filters.garageId)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError(error, { context: 'FloorRepository.getAll', filters })
      throw new DatabaseError('Failed to fetch floors')
    }
  }

  async create(data: FloorInsert): Promise<FloorRow> {
    try {
      const supabase = await createClient()
      const { data: floor, error } = await supabase
        .from('floors')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      logInfo('Floor created', { floorId: floor.id })
      return floor
    } catch (error) {
      logError(error, { context: 'FloorRepository.create' })
      throw new DatabaseError('Failed to create floor')
    }
  }

  async update(id: string, data: FloorUpdate): Promise<FloorRow> {
    try {
      const supabase = await createClient()
      const { data: floor, error } = await supabase
        .from('floors')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Floor', id)
        }
        throw error
      }

      logInfo('Floor updated', { floorId: id })
      return floor
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logError(error, { context: 'FloorRepository.update', id })
      throw new DatabaseError('Failed to update floor')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('floors')
        .delete()
        .eq('id', id)

      if (error) throw error

      logInfo('Floor deleted', { floorId: id })
    } catch (error) {
      logError(error, { context: 'FloorRepository.delete', id })
      throw new DatabaseError('Failed to delete floor')
    }
  }
}
