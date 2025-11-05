/**
 * Car Repository
 *
 * Handles database operations for cars
 */

import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/supabase/types/database.types'
import { DatabaseError, NotFoundError } from '@/lib/api/errors'
import { logError, logInfo } from '@/lib/logger'

export type CarRow = Tables<'cars'>
export type CarInsert = TablesInsert<'cars'>
export type CarUpdate = TablesUpdate<'cars'>

export class CarRepository {
  async getById(id: string): Promise<CarRow | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('cars')
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
      logError(error, { context: 'CarRepository.getById', id })
      throw new DatabaseError('Failed to fetch car')
    }
  }

  async getAll(): Promise<CarRow[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      logError(error, { context: 'CarRepository.getAll' })
      throw new DatabaseError('Failed to fetch cars')
    }
  }

  async create(data: CarInsert): Promise<CarRow> {
    try {
      const supabase = await createClient()
      const { data: car, error } = await supabase
        .from('cars')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      logInfo('Car created', { carId: car.id })
      return car
    } catch (error) {
      logError(error, { context: 'CarRepository.create' })
      throw new DatabaseError('Failed to create car')
    }
  }

  async update(id: string, data: CarUpdate): Promise<CarRow> {
    try {
      const supabase = await createClient()
      const { data: car, error } = await supabase
        .from('cars')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Car', id)
        }
        throw error
      }

      logInfo('Car updated', { carId: id })
      return car
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logError(error, { context: 'CarRepository.update', id })
      throw new DatabaseError('Failed to update car')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id)

      if (error) throw error

      logInfo('Car deleted', { carId: id })
    } catch (error) {
      logError(error, { context: 'CarRepository.delete', id })
      throw new DatabaseError('Failed to delete car')
    }
  }
}
