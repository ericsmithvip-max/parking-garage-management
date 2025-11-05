'use server'

/**
 * Garage Server Actions
 *
 * Server actions for garage management (used in React Server Components)
 */

import { revalidatePath } from 'next/cache'
import { GarageService } from '@/src/application/services/GarageService'
import { logError, logInfo } from '@/lib/logger'

const garageService = new GarageService()

export async function getAllGarages() {
  try {
    const garages = await garageService.getAll()
    return { success: true, data: garages }
  } catch (error) {
    logError(error, { action: 'getAllGarages' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch garages' }
  }
}

export async function createGarage(data: { name: string; location: string }) {
  try {
    const garage = await garageService.create(data)
    logInfo('Garage created via server action', { garageId: garage.id })
    revalidatePath('/garages')
    return { success: true, data: garage }
  } catch (error) {
    logError(error, { action: 'createGarage' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create garage' }
  }
}

export async function updateGarage(id: string, data: { name?: string; location?: string }) {
  try {
    const garage = await garageService.update(id, data)
    logInfo('Garage updated via server action', { garageId: id })
    revalidatePath('/garages')
    revalidatePath(`/garages/${id}`)
    return { success: true, data: garage }
  } catch (error) {
    logError(error, { action: 'updateGarage', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update garage' }
  }
}

export async function deleteGarage(id: string) {
  try {
    await garageService.delete(id)
    logInfo('Garage deleted via server action', { garageId: id })
    revalidatePath('/garages')
    return { success: true }
  } catch (error) {
    logError(error, { action: 'deleteGarage', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete garage' }
  }
}
