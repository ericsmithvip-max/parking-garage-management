/**
 * Parking Spot Service
 *
 * Business logic for parking spot management with status transitions
 */

import { ParkingSpotRepository, type ParkingSpotFilters } from '@/src/infrastructure/database/ParkingSpotRepository'
import { ParkingSpot } from '@/src/domain/entities/ParkingSpot'
import { ParkingSpotRules } from '@/src/domain/invariants/parking-spot-rules'
import { ParkingSpotStatus, type ParkingSpotStatusType } from '@/src/domain/value-objects/ParkingSpotStatus'
import { NotFoundError, ApiError } from '@/lib/api/errors'
import type { ParkingSpotRow, ParkingSpotInsert, ParkingSpotUpdate } from '@/src/infrastructure/database/ParkingSpotRepository'

export class ParkingSpotService {
  private repository: ParkingSpotRepository

  constructor() {
    this.repository = new ParkingSpotRepository()
  }

  async getById(id: string): Promise<ParkingSpotRow> {
    const spot = await this.repository.getById(id)

    if (!spot) {
      throw new NotFoundError('Parking spot', id)
    }

    return spot
  }

  async getAll(filters?: ParkingSpotFilters): Promise<ParkingSpotRow[]> {
    return this.repository.getAll(filters)
  }

  async getAvailableSpots(filters?: Omit<ParkingSpotFilters, 'status'>): Promise<ParkingSpotRow[]> {
    return this.repository.getAll({
      ...filters,
      status: ParkingSpotStatus.AVAILABLE,
    })
  }

  async getOccupiedSpots(filters?: Omit<ParkingSpotFilters, 'status'>): Promise<ParkingSpotRow[]> {
    return this.repository.getAll({
      ...filters,
      status: ParkingSpotStatus.OCCUPIED,
    })
  }

  async create(data: Omit<ParkingSpotInsert, 'id' | 'created_at' | 'updated_at'>): Promise<ParkingSpotRow> {
    ParkingSpot.validate({
      floorId: data.floor_id,
      name: data.name,
      size: data.size,
      status: data.status,
      rate: data.rate,
    })

    ParkingSpotRules.validateRate(data.rate)

    if (data.features) {
      ParkingSpotRules.validateFeatures(data.features)
    }

    return this.repository.create(data)
  }

  async update(id: string, data: ParkingSpotUpdate): Promise<ParkingSpotRow> {
    const current = await this.getById(id)

    if (data.status && data.status !== current.status) {
      ParkingSpotRules.validateStatusTransition(
        current.status as ParkingSpotStatusType,
        data.status as ParkingSpotStatusType
      )
    }

    if (data.rate !== undefined) {
      ParkingSpotRules.validateRate(data.rate)
    }

    if (data.features !== undefined) {
      ParkingSpotRules.validateFeatures(data.features)
    }

    return this.repository.update(id, data)
  }

  async markSpotOccupied(id: string): Promise<ParkingSpotRow> {
    const current = await this.getById(id)

    if (current.status === ParkingSpotStatus.OCCUPIED) {
      throw new ApiError('Parking spot is already occupied', 400, 'ALREADY_OCCUPIED')
    }

    ParkingSpotRules.validateStatusTransition(
      current.status as ParkingSpotStatusType,
      ParkingSpotStatus.OCCUPIED
    )

    return this.repository.markOccupied(id)
  }

  async markSpotAvailable(id: string): Promise<ParkingSpotRow> {
    const current = await this.getById(id)

    if (current.status === ParkingSpotStatus.AVAILABLE) {
      throw new ApiError('Parking spot is already available', 400, 'ALREADY_AVAILABLE')
    }

    ParkingSpotRules.validateStatusTransition(
      current.status as ParkingSpotStatusType,
      ParkingSpotStatus.AVAILABLE
    )

    return this.repository.markAvailable(id)
  }

  async delete(id: string): Promise<void> {
    await this.getById(id)
    await this.repository.delete(id)
  }
}
