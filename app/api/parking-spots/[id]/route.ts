/**
 * Parking Spot by ID API Routes
 * GET /api/parking-spots/[id] - Get parking spot by ID
 * PATCH /api/parking-spots/[id] - Update parking spot status (auth required)
 * DELETE /api/parking-spots/[id] - Delete parking spot (auth required)
 *
 * FOCUS: PATCH endpoint handles status updates (available/occupied)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiNoContent } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateUuid } from '@/lib/api/validation'
import { ParkingSpotService } from '@/src/application/services/ParkingSpotService'
import { updateParkingSpotSchema } from '@/src/interfaces/validation/parking-spot-schemas'
import { logInfo } from '@/lib/logger'
import type { Json } from '@/supabase/types/database.types'

const parkingSpotService = new ParkingSpotService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    validateUuid(id)

    const spot = await parkingSpotService.getById(id)

    logInfo('Fetched parking spot by ID', { spotId: id })
    return apiSuccess(spot)
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
    const validatedData = validateRequestBody(updateParkingSpotSchema, body)

    // Cast features to Json type for Supabase compatibility
    const updateData = {
      ...validatedData,
      ...(validatedData.features !== undefined && { features: validatedData.features as Json }),
    }

    const spot = await parkingSpotService.update(id, updateData)

    logInfo('Parking spot updated via API', {
      spotId: id,
      statusChanged: validatedData.status !== undefined,
      newStatus: validatedData.status,
    })
    return apiSuccess(spot)
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

    await parkingSpotService.delete(id)

    logInfo('Parking spot deleted via API', { spotId: id })
    return apiNoContent()
  } catch (error) {
    return handleApiError(error)
  }
}
