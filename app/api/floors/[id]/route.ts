/**
 * Floor by ID API Routes
 * GET /api/floors/[id] - Get floor by ID
 * PATCH /api/floors/[id] - Update floor (auth required)
 * DELETE /api/floors/[id] - Delete floor (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiNoContent } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateUuid } from '@/lib/api/validation'
import { FloorService } from '@/src/application/services/FloorService'
import { updateFloorSchema } from '@/src/interfaces/validation/floor-schemas'
import { logInfo } from '@/lib/logger'

const floorService = new FloorService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    validateUuid(id)

    const floor = await floorService.getById(id)

    logInfo('Fetched floor by ID', { floorId: id })
    return apiSuccess(floor)
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
    const validatedData = validateRequestBody(updateFloorSchema, body)

    const floor = await floorService.update(id, validatedData)

    logInfo('Floor updated via API', { floorId: id })
    return apiSuccess(floor)
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

    await floorService.delete(id)

    logInfo('Floor deleted via API', { floorId: id })
    return apiNoContent()
  } catch (error) {
    return handleApiError(error)
  }
}
