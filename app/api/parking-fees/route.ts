/**
 * Parking Fees API Routes
 * GET /api/parking-fees - List all parking fees (filter by car_id)
 * POST /api/parking-fees - Create a parking fee (auth required)
 */

import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth'
import { apiSuccess, apiCreated } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { validateRequestBody, validateQueryParams } from '@/lib/api/validation'
import { ParkingFeeService } from '@/src/application/services/ParkingFeeService'
import { createParkingFeeSchema, parkingFeeQuerySchema } from '@/src/interfaces/validation/parking-fee-schemas'
import { logInfo } from '@/lib/logger'

const parkingFeeService = new ParkingFeeService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = validateQueryParams(parkingFeeQuerySchema, searchParams)

    const fees = await parkingFeeService.getAll({
      carId: queryParams.car_id,
    })

    logInfo('Fetched parking fees', { count: fees.length, carId: queryParams.car_id })
    return apiSuccess(fees)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = validateRequestBody(createParkingFeeSchema, body)

    const fee = await parkingFeeService.create(validatedData)

    logInfo('Parking fee created via API', { feeId: fee.id })
    return apiCreated(fee)
  } catch (error) {
    return handleApiError(error)
  }
}
