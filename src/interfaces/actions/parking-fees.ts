'use server'

/**
 * Parking Fee Server Actions
 *
 * Server actions for parking fee management (used in React Server Components)
 */

import { revalidatePath } from 'next/cache'
import { ParkingFeeService } from '@/src/application/services/ParkingFeeService'
import { logError, logInfo } from '@/lib/logger'

const parkingFeeService = new ParkingFeeService()

export async function createParkingFee(data: { car_id: string; billed_at?: string }) {
  try {
    const fee = await parkingFeeService.create(data)
    logInfo('Parking fee created via server action', { feeId: fee.id })
    revalidatePath('/parking-fees')
    revalidatePath(`/cars/${data.car_id}`)
    return { success: true, data: fee }
  } catch (error) {
    logError(error, { action: 'createParkingFee' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create parking fee' }
  }
}

export async function updateParkingFee(id: string, data: { car_id?: string; billed_at?: string }) {
  try {
    const fee = await parkingFeeService.update(id, data)
    logInfo('Parking fee updated via server action', { feeId: id })
    revalidatePath('/parking-fees')
    revalidatePath(`/parking-fees/${id}`)
    return { success: true, data: fee }
  } catch (error) {
    logError(error, { action: 'updateParkingFee', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update parking fee' }
  }
}

export async function deleteParkingFee(id: string) {
  try {
    await parkingFeeService.delete(id)
    logInfo('Parking fee deleted via server action', { feeId: id })
    revalidatePath('/parking-fees')
    return { success: true }
  } catch (error) {
    logError(error, { action: 'deleteParkingFee', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete parking fee' }
  }
}
