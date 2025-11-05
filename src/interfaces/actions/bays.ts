'use server'

/**
 * Bay Server Actions
 *
 * Server actions for bay management (used in React Server Components)
 */

import { revalidatePath } from 'next/cache'
import { BayService } from '@/src/application/services/BayService'
import { logError, logInfo } from '@/lib/logger'

const bayService = new BayService()

export async function getAllBays() {
  try {
    const bays = await bayService.getAll()
    return { success: true, data: bays }
  } catch (error) {
    logError(error, { action: 'getAllBays' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch bays' }
  }
}

export async function createBay(data: { floor_id: string; name: string }) {
  try {
    const bay = await bayService.create(data)
    logInfo('Bay created via server action', { bayId: bay.id })
    revalidatePath('/bays')
    revalidatePath(`/floors/${data.floor_id}`)
    return { success: true, data: bay }
  } catch (error) {
    logError(error, { action: 'createBay' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create bay' }
  }
}

export async function updateBay(id: string, data: { floor_id?: string; name?: string }) {
  try {
    const bay = await bayService.update(id, data)
    logInfo('Bay updated via server action', { bayId: id })
    revalidatePath('/bays')
    revalidatePath(`/bays/${id}`)
    return { success: true, data: bay }
  } catch (error) {
    logError(error, { action: 'updateBay', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update bay' }
  }
}

export async function deleteBay(id: string) {
  try {
    await bayService.delete(id)
    logInfo('Bay deleted via server action', { bayId: id })
    revalidatePath('/bays')
    return { success: true }
  } catch (error) {
    logError(error, { action: 'deleteBay', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete bay' }
  }
}
