'use server'

/**
 * Parking Spot Server Actions
 *
 * Server actions for parking spot management with status transitions
 */

import { revalidatePath } from 'next/cache'
import { ParkingSpotService } from '@/src/application/services/ParkingSpotService'
import { logError, logInfo } from '@/lib/logger'
import type { Json } from '@/supabase/types/database.types'

const parkingSpotService = new ParkingSpotService()

export async function getAllParkingSpots() {
  try {
    const spots = await parkingSpotService.getAll()
    return { success: true, data: spots }
  } catch (error) {
    logError(error, { action: 'getAllParkingSpots' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch parking spots' }
  }
}

export async function createParkingSpot(data: {
  floor_id: string
  bay_id?: string | null
  name: string
  size: string
  status: string
  rate: number
  features?: Json | null
}) {
  try {
    const spot = await parkingSpotService.create(data)
    logInfo('Parking spot created via server action', { spotId: spot.id })
    revalidatePath('/parking-spots')
    revalidatePath(`/floors/${data.floor_id}`)
    return { success: true, data: spot }
  } catch (error) {
    logError(error, { action: 'createParkingSpot' })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create parking spot' }
  }
}

export async function updateParkingSpot(
  id: string,
  data: {
    floor_id?: string
    bay_id?: string | null
    name?: string
    size?: string
    status?: string
    rate?: number
    features?: Json | null
  }
) {
  try {
    const spot = await parkingSpotService.update(id, data)
    logInfo('Parking spot updated via server action', { spotId: id, statusChanged: data.status !== undefined })
    revalidatePath('/parking-spots')
    revalidatePath(`/parking-spots/${id}`)
    return { success: true, data: spot }
  } catch (error) {
    logError(error, { action: 'updateParkingSpot', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update parking spot' }
  }
}

export async function markParkingSpotOccupied(id: string) {
  try {
    const spot = await parkingSpotService.markSpotOccupied(id)
    logInfo('Parking spot marked occupied via server action', { spotId: id })
    revalidatePath('/parking-spots')
    revalidatePath(`/parking-spots/${id}`)
    return { success: true, data: spot }
  } catch (error) {
    logError(error, { action: 'markParkingSpotOccupied', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to mark spot as occupied' }
  }
}

export async function markParkingSpotAvailable(id: string) {
  try {
    const spot = await parkingSpotService.markSpotAvailable(id)
    logInfo('Parking spot marked available via server action', { spotId: id })
    revalidatePath('/parking-spots')
    revalidatePath(`/parking-spots/${id}`)
    return { success: true, data: spot }
  } catch (error) {
    logError(error, { action: 'markParkingSpotAvailable', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to mark spot as available' }
  }
}

export async function deleteParkingSpot(id: string) {
  try {
    await parkingSpotService.delete(id)
    logInfo('Parking spot deleted via server action', { spotId: id })
    revalidatePath('/parking-spots')
    return { success: true }
  } catch (error) {
    logError(error, { action: 'deleteParkingSpot', id })
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete parking spot' }
  }
}
