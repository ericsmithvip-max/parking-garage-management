/**
 * Spot Size Value Object
 *
 * Represents the size categories for parking spots
 */

export const SpotSize = {
  COMPACT: 'compact',
  STANDARD: 'standard',
  OVERSIZED: 'oversized',
} as const

export type SpotSizeType = typeof SpotSize[keyof typeof SpotSize]

/**
 * Validates if a size is a valid spot size
 */
export function isValidSpotSize(size: string): size is SpotSizeType {
  return Object.values(SpotSize).includes(size as SpotSizeType)
}

/**
 * Gets all valid spot sizes
 */
export function getAllSpotSizes(): SpotSizeType[] {
  return Object.values(SpotSize)
}
