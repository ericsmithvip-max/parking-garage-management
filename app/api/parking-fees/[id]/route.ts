/**
 * Parking Fee by ID API Routes
 * GET /api/parking-fees/[id] - Get parking fee by ID
 * PATCH /api/parking-fees/[id] - Update parking fee (auth required)
 * DELETE /api/parking-fees/[id] - Delete parking fee (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiNoContent } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateUuid } from '@/lib/api/validation'
import { ParkingFeeService } from '@/src/application/services/ParkingFeeService'
import { updateParkingFeeSchema } from '@/src/interfaces/validation/parking-fee-schemas'
import { logInfo } from '@/lib/logger'

const parkingFeeService = new ParkingFeeService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    validateUuid(id)

    const fee = await parkingFeeService.getById(id)

    logInfo('Fetched parking fee by ID', { feeId: id })
    return apiSuccess(fee)
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
    const validatedData = validateRequestBody(updateParkingFeeSchema, body)

    const fee = await parkingFeeService.update(id, validatedData)

    logInfo('Parking fee updated via API', { feeId: id })
    return apiSuccess(fee)
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

    await parkingFeeService.delete(id)

    logInfo('Parking fee deleted via API', { feeId: id })
    return apiNoContent()
  } catch (error) {
    return handleApiError(error)
  }
}
