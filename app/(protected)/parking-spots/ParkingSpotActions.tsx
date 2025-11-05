'use client'

import { useState } from 'react'
import { Button } from '@/src/components/Button'
import { markParkingSpotOccupied, markParkingSpotAvailable } from '@/src/interfaces/actions/parking-spots'
import type { Tables } from '@/supabase/types/database.types'

interface ParkingSpotActionsProps {
  spot: Tables<'parking_spots'>
}

export function ParkingSpotActions({ spot }: ParkingSpotActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleMarkOccupied = async () => {
    setIsUpdating(true)
    try {
      await markParkingSpotOccupied(spot.id)
      window.location.reload()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkAvailable = async () => {
    setIsUpdating(true)
    try {
      await markParkingSpotAvailable(spot.id)
      window.location.reload()
    } finally {
      setIsUpdating(false)
    }
  }

  if (spot.status === 'available') {
    return (
      <Button
        onClick={handleMarkOccupied}
        disabled={isUpdating}
        variant="secondary"
        className="text-xs px-3 py-1"
      >
        {isUpdating ? 'Updating...' : 'Mark Occupied'}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleMarkAvailable}
      disabled={isUpdating}
      variant="secondary"
      className="text-xs px-3 py-1"
    >
      {isUpdating ? 'Updating...' : 'Mark Available'}
    </Button>
  )
}
