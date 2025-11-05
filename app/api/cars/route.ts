/**
 * Cars API Routes
 * GET /api/cars - List all cars
 * POST /api/cars - Create a car (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiCreated } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody } from '@/lib/api/validation'
import { CarService } from '@/src/application/services/CarService'
import { createCarSchema } from '@/src/interfaces/validation/car-schemas'
import { logInfo } from '@/lib/logger'

const carService = new CarService()

export async function GET() {
  try {
    const cars = await carService.getAll()
    logInfo('Fetched all cars', { count: cars.length })
    return apiSuccess(cars)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = validateRequestBody(createCarSchema, body)

    const car = await carService.create(validatedData)

    logInfo('Car created via API', { carId: car.id })
    return apiCreated(car)
  } catch (error) {
    return handleApiError(error)
  }
}
