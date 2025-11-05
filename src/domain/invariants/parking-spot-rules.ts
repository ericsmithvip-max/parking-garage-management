/**
 * Parking Spot Business Rules and Invariants
 *
 * Enforces business logic constraints for parking spots
 */

import { ParkingSpotStatus, type ParkingSpotStatusType } from '../value-objects/ParkingSpotStatus'

export class ParkingSpotRules {
  /**
   * Validates that a status transition is allowed
   */
  static validateStatusTransition(
    currentStatus: ParkingSpotStatusType,
    newStatus: ParkingSpotStatusType
  ): void {
    if (currentStatus === newStatus) {
      throw new Error('Cannot transition to the same status')
    }

    const validTransitions: Record<ParkingSpotStatusType, ParkingSpotStatusType[]> = {
      [ParkingSpotStatus.AVAILABLE]: [ParkingSpotStatus.OCCUPIED],
      [ParkingSpotStatus.OCCUPIED]: [ParkingSpotStatus.AVAILABLE],
    }

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Cannot transition from ${currentStatus} to ${newStatus}`)
    }
  }

  /**
   * Validates that a rate is valid
   */
  static validateRate(rate: number): void {
    if (rate <= 0) {
      throw new Error('Parking rate must be greater than 0')
    }

    if (rate > 10000) {
      throw new Error('Parking rate cannot exceed 10000')
    }
  }

  /**
   * Validates that features JSONB is well-formed
   */
  static validateFeatures(features: unknown): void {
    if (features === null || features === undefined) {
      return
    }

    if (typeof features !== 'object') {
      throw new Error('Features must be a valid JSON object')
    }
  }
}
