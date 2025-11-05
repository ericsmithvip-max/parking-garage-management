/**
 * Garage by ID API Routes
 * GET /api/garages/[id] - Get garage by ID
 * PATCH /api/garages/[id] - Update garage (auth required)
 * DELETE /api/garages/[id] - Delete garage (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiNoContent } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateUuid } from '@/lib/api/validation'
import { GarageService } from '@/src/application/services/GarageService'
import { updateGarageSchema } from '@/src/interfaces/validation/garage-schemas'
import { logInfo } from '@/lib/logger'

const garageService = new GarageService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    validateUuid(id)

    const garage = await garageService.getById(id)

    logInfo('Fetched garage by ID', { garageId: id })
    return apiSuccess(garage)
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
    const validatedData = validateRequestBody(updateGarageSchema, body)

    const garage = await garageService.update(id, validatedData)

    logInfo('Garage updated via API', { garageId: id })
    return apiSuccess(garage)
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

    await garageService.delete(id)

    logInfo('Garage deleted via API', { garageId: id })
    return apiNoContent()
  } catch (error) {
    return handleApiError(error)
  }
}
