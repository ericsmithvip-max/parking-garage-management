/**
 * Parking Fee Repository
 *
 * Handles database operations for parking fees
 */

import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/supabase/types/database.types'
import { DatabaseError, NotFoundError } from '@/lib/api/errors'
import { logError, logInfo } from '@/lib/logger'

export type ParkingFeeRow = Tables<'parking_fees'>
export type ParkingFeeInsert = TablesInsert<'parking_fees'>
export type ParkingFeeUpdate = TablesUpdate<'parking_fees'>

export interface ParkingFeeFilters {
  carId?: string
}

export class ParkingFeeRepository {
  async getById(id: string): Promise<ParkingFeeRow | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('parking_fees')
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
      logError(error, { context: 'ParkingFeeRepository.getById', id })
      throw new DatabaseError('Failed to fetch parking fee')
    }
  }

  async getAll(filters?: ParkingFeeFilters): Promise<ParkingFeeRow[]> {
    try {
      const supabase = await createClient()
      let query = supabase
        .from('parking_fees')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.carId) {
        query = query.eq('car_id', filters.carId)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError(error, { context: 'ParkingFeeRepository.getAll', filters })
      throw new DatabaseError('Failed to fetch parking fees')
    }
  }

  async create(data: ParkingFeeInsert): Promise<ParkingFeeRow> {
    try {
      const supabase = await createClient()
      const { data: fee, error } = await supabase
        .from('parking_fees')
        .insert(data)
        .select()
        .single()

      if (error) throw error

      logInfo('Parking fee created', { feeId: fee.id })
      return fee
    } catch (error) {
      logError(error, { context: 'ParkingFeeRepository.create' })
      throw new DatabaseError('Failed to create parking fee')
    }
  }

  async update(id: string, data: ParkingFeeUpdate): Promise<ParkingFeeRow> {
    try {
      const supabase = await createClient()
      const { data: fee, error } = await supabase
        .from('parking_fees')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Parking fee', id)
        }
        throw error
      }

      logInfo('Parking fee updated', { feeId: id })
      return fee
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logError(error, { context: 'ParkingFeeRepository.update', id })
      throw new DatabaseError('Failed to update parking fee')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('parking_fees')
        .delete()
        .eq('id', id)

      if (error) throw error

      logInfo('Parking fee deleted', { feeId: id })
    } catch (error) {
      logError(error, { context: 'ParkingFeeRepository.delete', id })
      throw new DatabaseError('Failed to delete parking fee')
    }
  }
}
