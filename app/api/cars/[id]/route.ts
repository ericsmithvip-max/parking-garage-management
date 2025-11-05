/**
 * Car by ID API Routes
 * GET /api/cars/[id] - Get car by ID
 * PATCH /api/cars/[id] - Update car (auth required)
 * DELETE /api/cars/[id] - Delete car (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiNoContent } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateUuid } from '@/lib/api/validation'
import { CarService } from '@/src/application/services/CarService'
import { updateCarSchema } from '@/src/interfaces/validation/car-schemas'
import { logInfo } from '@/lib/logger'

const carService = new CarService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    validateUuid(id)

    const car = await carService.getById(id)

    logInfo('Fetched car by ID', { carId: id })
    return apiSuccess(car)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    validateUuid(id)

    const body = await request.json()
    const validatedData = validateRequestBody(updateCarSchema, body)

    const car = await carService.update(id, validatedData)

    logInfo('Car updated via API', { carId: id })
    return apiSuccess(car)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    validateUuid(id)

    await carService.delete(id)

    logInfo('Car deleted via API', { carId: id })
    return apiNoContent()
  } catch (error) {
    return handleApiError(error)
  }
}
