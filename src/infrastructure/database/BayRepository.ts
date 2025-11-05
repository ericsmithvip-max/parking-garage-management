/**
 * Bay Repository
 *
 * Handles database operations for bays
 */

import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/supabase/types/database.types'
import { DatabaseError, NotFoundError } from '@/lib/api/errors'
import { logError, logInfo } from '@/lib/logger'

export type BayRow = Tables<'bays'>
export type BayInsert = TablesInsert<'bays'>
export type BayUpdate = TablesUpdate<'bays'>

export interface BayFilters {
  floorId?: string
}

export class BayRepository {
  async getById(id: string): Promise<BayRow | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('bays')
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
      logError(error, { context: 'BayRepository.getById', id })
      throw new DatabaseError('Failed to fetch bay')
    }
  }

  async getAll(filters?: BayFilters): Promise<BayRow[]> {
    try {
      const supabase = await createClient()
      let query = supabase
        .from('bays')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.floorId) {
        query = query.eq('floor_id', filters.floorId)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError(error, { context: 'BayRepository.getAll', filters })
      throw new DatabaseError('Failed to fetch bays')
    }
  }

  async create(data: BayInsert): Promise<BayRow> {
    try {
      const supabase = await createClient()
      const { data: bay, error } = await supabase
        .from('bays')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      logInfo('Bay created', { bayId: bay.id })
      return bay
    } catch (error) {
      logError(error, { context: 'BayRepository.create' })
      throw new DatabaseError('Failed to create bay')
    }
  }

  async update(id: string, data: BayUpdate): Promise<BayRow> {
    try {
      const supabase = await createClient()
      const { data: bay, error } = await supabase
        .from('bays')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Bay', id)
        }
        throw error
      }

      logInfo('Bay updated', { bayId: id })
      return bay
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logError(error, { context: 'BayRepository.update', id })
      throw new DatabaseError('Failed to update bay')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('bays')
        .delete()
        .eq('id', id)

      if (error) throw error

      logInfo('Bay deleted', { bayId: id })
    } catch (error) {
      logError(error, { context: 'BayRepository.delete', id })
      throw new DatabaseError('Failed to delete bay')
    }
  }
}
