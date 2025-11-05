/**
 * Garages API Routes
 * GET /api/garages - List all garages
 * POST /api/garages - Create a garage (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiCreated } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody } from '@/lib/api/validation'
import { GarageService } from '@/src/application/services/GarageService'
import { createGarageSchema } from '@/src/interfaces/validation/garage-schemas'
import { logInfo } from '@/lib/logger'

const garageService = new GarageService()

export async function GET() {
  try {
    const garages = await garageService.getAll()
    logInfo('Fetched all garages', { count: garages.length })
    return apiSuccess(garages)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = validateRequestBody(createGarageSchema, body)

    const garage = await garageService.create(validatedData)

    logInfo('Garage created via API', { garageId: garage.id })
    return apiCreated(garage)
  } catch (error) {
    return handleApiError(error)
  }
}
