/**
 * Garage Service
 *
 * Business logic for garage management
 */

import { GarageRepository } from '@/src/infrastructure/database/GarageRepository'
import { Garage } from '@/src/domain/entities/Garage'
import { NotFoundError } from '@/lib/api/errors'
import type { GarageRow, GarageInsert, GarageUpdate } from '@/src/infrastructure/database/GarageRepository'

export class GarageService {
  private repository: GarageRepository

  constructor() {
    this.repository = new GarageRepository()
  }

  async getById(id: string): Promise<GarageRow> {
    const garage = await this.repository.getById(id)

    if (!garage) {
      throw new NotFoundError('Garage', id)
    }

    return garage
  }

  async getAll(): Promise<GarageRow[]> {
    return this.repository.getAll()
  }

  async create(data: Omit<GarageInsert, 'id' | 'created_at' | 'updated_at'>): Promise<GarageRow> {
    Garage.validate({
      name: data.name,
      location: data.location,
    })

    return this.repository.create(data)
  }

  async update(id: string, data: GarageUpdate): Promise<GarageRow> {
    await this.getById(id)

    if (data.name !== undefined || data.location !== undefined) {
      const current = await this.repository.getById(id)
      Garage.validate({
        name: data.name ?? current!.name,
        location: data.location ?? current!.location,
      })
    }

    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<void> {
    await this.getById(id)
    await this.repository.delete(id)
  }
}
