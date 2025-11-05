/**
 * Bay by ID API Routes
 * GET /api/bays/[id] - Get bay by ID
 * PATCH /api/bays/[id] - Update bay (auth required)
 * DELETE /api/bays/[id] - Delete bay (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiNoContent } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateUuid } from '@/lib/api/validation'
import { BayService } from '@/src/application/services/BayService'
import { updateBaySchema } from '@/src/interfaces/validation/bay-schemas'
import { logInfo } from '@/lib/logger'

const bayService = new BayService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    validateUuid(id)

    const bay = await bayService.getById(id)

    logInfo('Fetched bay by ID', { bayId: id })
    return apiSuccess(bay)
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
    const validatedData = validateRequestBody(updateBaySchema, body)

    const bay = await bayService.update(id, validatedData)

    logInfo('Bay updated via API', { bayId: id })
    return apiSuccess(bay)
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

    await bayService.delete(id)

    logInfo('Bay deleted via API', { bayId: id })
    return apiNoContent()
  } catch (error) {
    return handleApiError(error)
  }
}
