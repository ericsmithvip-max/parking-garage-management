/**
 * Parking Spot Status Value Object
 *
 * Represents the possible states of a parking spot
 */

export const ParkingSpotStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
} as const

export type ParkingSpotStatusType = typeof ParkingSpotStatus[keyof typeof ParkingSpotStatus]

/**
 * Validates if a status is a valid parking spot status
 */
export function isValidParkingSpotStatus(status: string): status is ParkingSpotStatusType {
  return Object.values(ParkingSpotStatus).includes(status as ParkingSpotStatusType)
}

/**
 * Gets all valid parking spot statuses
 */
export function getAllParkingSpotStatuses(): ParkingSpotStatusType[] {
  return Object.values(ParkingSpotStatus)
}
