/**
 * Parking Fee Service
 *
 * Business logic for parking fee management
 */

import { ParkingFeeRepository, type ParkingFeeFilters } from '@/src/infrastructure/database/ParkingFeeRepository'
import { ParkingFee } from '@/src/domain/entities/ParkingFee'
import { NotFoundError } from '@/lib/api/errors'
import type { ParkingFeeRow, ParkingFeeInsert, ParkingFeeUpdate } from '@/src/infrastructure/database/ParkingFeeRepository'

export class ParkingFeeService {
  private repository: ParkingFeeRepository

  constructor() {
    this.repository = new ParkingFeeRepository()
  }

  async getById(id: string): Promise<ParkingFeeRow> {
    const fee = await this.repository.getById(id)

    if (!fee) {
      throw new NotFoundError('Parking fee', id)
    }

    return fee
  }

  async getAll(filters?: ParkingFeeFilters): Promise<ParkingFeeRow[]> {
    return this.repository.getAll(filters)
  }

  async create(data: Omit<ParkingFeeInsert, 'id' | 'created_at' | 'updated_at'>): Promise<ParkingFeeRow> {
    ParkingFee.validate({
      carId: data.car_id,
    })

    return this.repository.create(data)
  }

  async update(id: string, data: ParkingFeeUpdate): Promise<ParkingFeeRow> {
    await this.getById(id)

    if (data.car_id !== undefined) {
      ParkingFee.validate({
        carId: data.car_id,
      })
    }

    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<void> {
    await this.getById(id)
    await this.repository.delete(id)
  }
}
