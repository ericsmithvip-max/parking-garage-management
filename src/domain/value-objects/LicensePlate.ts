/**
 * License Plate Value Object
 *
 * Represents a vehicle license plate with validation
 */

export class LicensePlate {
  private constructor(private readonly value: string) {}

  static create(plateNumber: string): LicensePlate {
    const normalized = plateNumber.trim().toUpperCase()

    if (normalized.length === 0) {
      throw new Error('License plate cannot be empty')
    }

    if (normalized.length > 20) {
      throw new Error('License plate cannot exceed 20 characters')
    }

    return new LicensePlate(normalized)
  }

  getValue(): string {
    return this.value
  }

  equals(other: LicensePlate): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
