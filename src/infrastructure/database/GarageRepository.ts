/**
 * Garage Repository
 *
 * Handles database operations for garages
 */

import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/supabase/types/database.types'
import { DatabaseError, NotFoundError } from '@/lib/api/errors'
import { logError, logInfo } from '@/lib/logger'

export type GarageRow = Tables<'garages'>
export type GarageInsert = TablesInsert<'garages'>
export type GarageUpdate = TablesUpdate<'garages'>

export class GarageRepository {
  async getById(id: string): Promise<GarageRow | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('garages')
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
      logError(error, { context: 'GarageRepository.getById', id })
      throw new DatabaseError('Failed to fetch garage')
    }
  }

  async getAll(): Promise<GarageRow[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('garages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      logError(error, { context: 'GarageRepository.getAll' })
      throw new DatabaseError('Failed to fetch garages')
    }
  }

  async create(data: GarageInsert): Promise<GarageRow> {
    try {
      const supabase = await createClient()
      const { data: garage, error } = await supabase
        .from('garages')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      logInfo('Garage created', { garageId: garage.id })
      return garage
    } catch (error) {
      logError(error, { context: 'GarageRepository.create' })
      throw new DatabaseError('Failed to create garage')
    }
  }

  async update(id: string, data: GarageUpdate): Promise<GarageRow> {
    try {
      const supabase = await createClient()
      const { data: garage, error } = await supabase
        .from('garages')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Garage', id)
        }
        throw error
      }

      logInfo('Garage updated', { garageId: id })
      return garage
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logError(error, { context: 'GarageRepository.update', id })
      throw new DatabaseError('Failed to update garage')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('garages')
        .delete()
        .eq('id', id)

      if (error) throw error

      logInfo('Garage deleted', { garageId: id })
    } catch (error) {
      logError(error, { context: 'GarageRepository.delete', id })
      throw new DatabaseError('Failed to delete garage')
    }
  }
}
