'use server'

/**
 * Floor Server Actions
 *
 * Server actions for floor management (used in React Server Components)
 */

import { revalidatePath } from 'next/cache'
import { FloorService } from '@/src/application/services/FloorService'
import { logError, logInfo } from '@/lib/logger'

const floorService = new FloorService()

export async function getAllFloors() {
  try {
    const floors = await floorService.getAll()
    return { success: true, data: floors }
  } catch (error) {
    logError(error, { action: 'getAllFloors' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch floors' }
  }
}

export async function createFloor(data: { garage_id: string; name: string }) {
  try {
    const floor = await floorService.create(data)
    logInfo('Floor created via server action', { floorId: floor.id })
    revalidatePath('/floors')
    revalidatePath(`/garages/${data.garage_id}`)
    return { success: true, data: floor }
  } catch (error) {
    logError(error, { action: 'createFloor' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create floor' }
  }
}

export async function updateFloor(id: string, data: { garage_id?: string; name?: string }) {
  try {
    const floor = await floorService.update(id, data)
    logInfo('Floor updated via server action', { floorId: id })
    revalidatePath('/floors')
    revalidatePath(`/floors/${id}`)
    return { success: true, data: floor }
  } catch (error) {
    logError(error, { action: 'updateFloor', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update floor' }
  }
}

export async function deleteFloor(id: string) {
  try {
    await floorService.delete(id)
    logInfo('Floor deleted via server action', { floorId: id })
    revalidatePath('/floors')
    return { success: true }
  } catch (error) {
    logError(error, { action: 'deleteFloor', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete floor' }
  }
}
