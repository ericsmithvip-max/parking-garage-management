/**
 * Bay Service
 *
 * Business logic for bay management
 */

import { BayRepository, type BayFilters } from '@/src/infrastructure/database/BayRepository'
import { Bay } from '@/src/domain/entities/Bay'
import { NotFoundError } from '@/lib/api/errors'
import type { BayRow, BayInsert, BayUpdate } from '@/src/infrastructure/database/BayRepository'

export class BayService {
  private repository: BayRepository

  constructor() {
    this.repository = new BayRepository()
  }

  async getById(id: string): Promise<BayRow> {
    const bay = await this.repository.getById(id)

    if (!bay) {
      throw new NotFoundError('Bay', id)
    }

    return bay
  }

  async getAll(filters?: BayFilters): Promise<BayRow[]> {
    return this.repository.getAll(filters)
  }

  async create(data: Omit<BayInsert, 'id' | 'created_at' | 'updated_at'>): Promise<BayRow> {
    Bay.validate({
      floorId: data.floor_id,
      name: data.name,
    })

    return this.repository.create(data)
  }

  async update(id: string, data: BayUpdate): Promise<BayRow> {
    await this.getById(id)

    if (data.floor_id !== undefined || data.name !== undefined) {
      const current = await this.repository.getById(id)
      Bay.validate({
        floorId: data.floor_id ?? current!.floor_id,
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
