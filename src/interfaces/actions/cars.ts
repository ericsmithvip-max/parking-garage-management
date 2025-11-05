'use server'

/**
 * Car Server Actions
 *
 * Server actions for car management (used in React Server Components)
 */

import { revalidatePath } from 'next/cache'
import { CarService } from '@/src/application/services/CarService'
import { logError, logInfo } from '@/lib/logger'

const carService = new CarService()

export async function getAllCars() {
  try {
    const cars = await carService.getAll()
    return { success: true, data: cars }
  } catch (error) {
    logError(error, { action: 'getAllCars' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch cars' }
  }
}

export async function findCarByLicensePlate(licensePlate: string) {
  try {
    const cars = await carService.getAll()
    const car = cars.find(c => c.license_plate_number.toLowerCase() === licensePlate.toLowerCase())
    if (!car) {
      return { success: false, error: 'Car not found' }
    }
    return { success: true, data: car }
  } catch (error) {
    logError(error, { action: 'findCarByLicensePlate' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to find car' }
  }
}

export async function createCar(data: {
  license_plate_number: string
  checkedin_at?: string | null
  checkedout_at?: string | null
}) {
  try {
    const car = await carService.create(data)
    logInfo('Car created via server action', { carId: car.id })
    revalidatePath('/cars')
    return { success: true, data: car }
  } catch (error) {
    logError(error, { action: 'createCar' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create car' }
  }
}

export async function updateCar(
  id: string,
  data: {
    license_plate_number?: string
    checkedin_at?: string | null
    checkedout_at?: string | null
  }
) {
  try {
    const car = await carService.update(id, data)
    logInfo('Car updated via server action', { carId: id })
    revalidatePath('/cars')
    revalidatePath(`/cars/${id}`)
    return { success: true, data: car }
  } catch (error) {
    logError(error, { action: 'updateCar', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update car' }
  }
}

export async function deleteCar(id: string) {
  try {
    await carService.delete(id)
    logInfo('Car deleted via server action', { carId: id })
    revalidatePath('/cars')
    return { success: true }
  } catch (error) {
    logError(error, { action: 'deleteCar', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete car' }
  }
}

export async function checkInCar(licensePlate: string, spotId: string) {
  try {
    const { markParkingSpotOccupied } = await import('./parking-spots')

    const car = await carService.create({
      license_plate_number: licensePlate,
      checkedin_at: new Date().toISOString(),
      checkedout_at: null,
    })

    await markParkingSpotOccupied(spotId)

    logInfo('Car checked in via server action', { carId: car.id, spotId })
    revalidatePath('/cars')
    revalidatePath('/parking-spots')
    return { success: true, data: car }
  } catch (error) {
    logError(error, { action: 'checkInCar' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to check in car' }
  }
}

export async function checkOutCar(licensePlate: string, spotId: string) {
  try {
    const { markParkingSpotAvailable } = await import('./parking-spots')

    const cars = await carService.getAll()
    const car = cars.find(c =>
      c.license_plate_number.toLowerCase() === licensePlate.toLowerCase() &&
      c.checkedin_at && !c.checkedout_at
    )

    if (!car) {
      return { success: false, error: 'Car not found or not checked in' }
    }

    const updatedCar = await carService.update(car.id, {
      checkedout_at: new Date().toISOString(),
    })

    await markParkingSpotAvailable(spotId)

    logInfo('Car checked out via server action', { carId: car.id, spotId })
    revalidatePath('/cars')
    revalidatePath('/parking-spots')
    return { success: true, data: updatedCar }
  } catch (error) {
    logError(error, { action: 'checkOutCar' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to check out car' }
  }
}
