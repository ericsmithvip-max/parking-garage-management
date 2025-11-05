/**
 * Floors API Routes
 * GET /api/floors - List all floors (filter by garage_id)
 * POST /api/floors - Create a floor (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiCreated } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateQueryParams } from '@/lib/api/validation'
import { FloorService } from '@/src/application/services/FloorService'
import { createFloorSchema, floorQuerySchema } from '@/src/interfaces/validation/floor-schemas'
import { logInfo } from '@/lib/logger'

const floorService = new FloorService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = validateQueryParams(floorQuerySchema, searchParams)

    const floors = await floorService.getAll({
      garageId: queryParams.garage_id,
    })

    logInfo('Fetched floors', { count: floors.length, garageId: queryParams.garage_id })
    return apiSuccess(floors)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = validateRequestBody(createFloorSchema, body)

    const floor = await floorService.create(validatedData)

    logInfo('Floor created via API', { floorId: floor.id })
    return apiCreated(floor)
  } catch (error) {
    return handleApiError(error)
  }
}
