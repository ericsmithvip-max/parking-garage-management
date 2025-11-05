/**
 * Car Service
 *
 * Business logic for car management
 */

import { CarRepository } from '@/src/infrastructure/database/CarRepository'
import { Car } from '@/src/domain/entities/Car'
import { NotFoundError } from '@/lib/api/errors'
import type { CarRow, CarInsert, CarUpdate } from '@/src/infrastructure/database/CarRepository'

export class CarService {
  private repository: CarRepository

  constructor() {
    this.repository = new CarRepository()
  }

  async getById(id: string): Promise<CarRow> {
    const car = await this.repository.getById(id)

    if (!car) {
      throw new NotFoundError('Car', id)
    }

    return car
  }

  async getAll(): Promise<CarRow[]> {
    return this.repository.getAll()
  }

  async create(data: Omit<CarInsert, 'id' | 'created_at' | 'updated_at'>): Promise<CarRow> {
    Car.validate({
      licensePlateNumber: data.license_plate_number,
    })

    return this.repository.create(data)
  }

  async update(id: string, data: CarUpdate): Promise<CarRow> {
    await this.getById(id)

    if (data.license_plate_number !== undefined) {
      Car.validate({
        licensePlateNumber: data.license_plate_number,
      })
    }

    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<void> {
    await this.getById(id)
    await this.repository.delete(id)
  }
}
