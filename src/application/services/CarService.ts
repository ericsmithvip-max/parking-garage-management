/**
 * Car Service
 *
 * Business logic for car management
 */

import { CarRepository } from '@/src/infrastructure/database/CarRepository'
import { ParkingSpotRepository } from '@/src/infrastructure/database/ParkingSpotRepository'
import { Car } from '@/src/domain/entities/Car'
import { NotFoundError } from '@/lib/api/errors'
import type { CarRow, CarInsert, CarUpdate } from '@/src/infrastructure/database/CarRepository'

export class CarService {
  private repository: CarRepository
  private parkingSpotRepository: ParkingSpotRepository

  constructor() {
    this.repository = new CarRepository()
    this.parkingSpotRepository = new ParkingSpotRepository()
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

  async findByLicensePlate(licensePlate: string): Promise<CarRow | null> {
    return this.repository.findByLicensePlate(licensePlate)
  }

  async getCheckedInCars(): Promise<CarRow[]> {
    return this.repository.getCheckedInCars()
  }

  /**
   * Check in a car to a parking spot
   * - Creates or updates the car record
   * - Sets parking_spot_id
   * - Sets checkedin_at timestamp
   * - Marks the parking spot as occupied
   */
  async checkIn(licensePlate: string, parkingSpotId: string): Promise<CarRow> {
    // Validate license plate
    Car.validate({ licensePlateNumber: licensePlate })

    // Verify parking spot exists and is available
    const spot = await this.parkingSpotRepository.getById(parkingSpotId)
    if (!spot) {
      throw new NotFoundError('Parking spot', parkingSpotId)
    }

    if (spot.status === 'occupied') {
      throw new Error('Parking spot is already occupied')
    }

    // Check if car already exists
    const existingCar = await this.repository.findByLicensePlate(licensePlate)

    let car: CarRow

    if (existingCar) {
      // Update existing car
      car = await this.repository.update(existingCar.id, {
        parking_spot_id: parkingSpotId,
        checkedin_at: new Date().toISOString(),
        checkedout_at: null,
      })
    } else {
      // Create new car
      car = await this.repository.create({
        license_plate_number: licensePlate.toUpperCase(),
        parking_spot_id: parkingSpotId,
        checkedin_at: new Date().toISOString(),
        checkedout_at: null,
      })
    }

    // Mark parking spot as occupied
    await this.parkingSpotRepository.markOccupied(parkingSpotId)

    return car
  }

  /**
   * Check out a car from a parking spot
   * - Sets checkedout_at timestamp
   * - Clears parking_spot_id
   * - Marks the parking spot as available
   */
  async checkOut(carId: string): Promise<CarRow> {
    const car = await this.getById(carId)

    if (!car.parking_spot_id) {
      throw new Error('Car is not checked in to any parking spot')
    }

    if (car.checkedout_at) {
      throw new Error('Car is already checked out')
    }

    const parkingSpotId = car.parking_spot_id

    // Update car record
    const updatedCar = await this.repository.update(carId, {
      parking_spot_id: null,
      checkedout_at: new Date().toISOString(),
    })

    // Mark parking spot as available
    await this.parkingSpotRepository.markAvailable(parkingSpotId)

    return updatedCar
  }
}
