/**
 * Parking Spots API Routes
 * GET /api/parking-spots - List all parking spots (filter by status, floor_id, bay_id, size)
 * POST /api/parking-spots - Create a parking spot (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiCreated } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateQueryParams } from '@/lib/api/validation'
import { ParkingSpotService } from '@/src/application/services/ParkingSpotService'
import { createParkingSpotSchema, parkingSpotQuerySchema } from '@/src/interfaces/validation/parking-spot-schemas'
import { logInfo } from '@/lib/logger'
import type { Json } from '@/supabase/types/database.types'

const parkingSpotService = new ParkingSpotService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = validateQueryParams(parkingSpotQuerySchema, searchParams)

    const spots = await parkingSpotService.getAll({
      status: queryParams.status,
      floorId: queryParams.floor_id,
      bayId: queryParams.bay_id,
      size: queryParams.size,
    })

    logInfo('Fetched parking spots', {
      count: spots.length,
      status: queryParams.status,
      floorId: queryParams.floor_id,
      bayId: queryParams.bay_id,
      size: queryParams.size,
    })
    return apiSuccess(spots)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = validateRequestBody(createParkingSpotSchema, body)

    // Cast features to Json type for Supabase compatibility
    const createData = {
      ...validatedData,
      ...(validatedData.features !== undefined && { features: validatedData.features as Json }),
    }

    const spot = await parkingSpotService.create(createData)

    logInfo('Parking spot created via API', { spotId: spot.id })
    return apiCreated(spot)
  } catch (error) {
    return handleApiError(error)
  }
}
