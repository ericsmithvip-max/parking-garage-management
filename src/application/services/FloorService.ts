/**
 * Floor Service
 *
 * Business logic for floor management
 */

import { FloorRepository, type FloorFilters } from '@/src/infrastructure/database/FloorRepository'
import { Floor } from '@/src/domain/entities/Floor'
import { NotFoundError } from '@/lib/api/errors'
import type { FloorRow, FloorInsert, FloorUpdate } from '@/src/infrastructure/database/FloorRepository'

export class FloorService {
  private repository: FloorRepository

  constructor() {
    this.repository = new FloorRepository()
  }

  async getById(id: string): Promise<FloorRow> {
    const floor = await this.repository.getById(id)

    if (!floor) {
      throw new NotFoundError('Floor', id)
    }

    return floor
  }

  async getAll(filters?: FloorFilters): Promise<FloorRow[]> {
    return this.repository.getAll(filters)
  }

  async create(data: Omit<FloorInsert, 'id' | 'created_at' | 'updated_at'>): Promise<FloorRow> {
    Floor.validate({
      garageId: data.garage_id,
      name: data.name,
    })

    return this.repository.create(data)
  }

  async update(id: string, data: FloorUpdate): Promise<FloorRow> {
    await this.getById(id)

    if (data.garage_id !== undefined || data.name !== undefined) {
      const current = await this.repository.getById(id)
      Floor.validate({
        garageId: data.garage_id ?? current!.garage_id,
        name: data.name ?? current!.name,
      })
    }

    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<void> {
    await this.getById(id)
    await this.repository.delete(id)
  }
}
