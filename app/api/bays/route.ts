/**
 * Bays API Routes
 * GET /api/bays - List all bays (filter by floor_id)
 * POST /api/bays - Create a bay (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiCreated } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateQueryParams } from '@/lib/api/validation'
import { BayService } from '@/src/application/services/BayService'
import { createBaySchema, bayQuerySchema } from '@/src/interfaces/validation/bay-schemas'
import { logInfo } from '@/lib/logger'

const bayService = new BayService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = validateQueryParams(bayQuerySchema, searchParams)

    const bays = await bayService.getAll({
      floorId: queryParams.floor_id,
    })

    logInfo('Fetched bays', { count: bays.length, floorId: queryParams.floor_id })
    return apiSuccess(bays)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = validateRequestBody(createBaySchema, body)

    const bay = await bayService.create(validatedData)

    logInfo('Bay created via API', { bayId: bay.id })
    return apiCreated(bay)
  } catch (error) {
    return handleApiError(error)
  }
}
