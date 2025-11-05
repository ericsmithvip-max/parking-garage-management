'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/src/components/Card'
import { Badge } from '@/src/components/Badge'
import { Select } from '@/src/components/Select'
import { FormField } from '@/src/components/FormField'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/src/components/Table'
import { ParkingSpotActions } from './ParkingSpotActions'
import type { Tables } from '@/supabase/types/database.types'

type ParkingSpot = Tables<'parking_spots'>
type Floor = Tables<'floors'>
type Bay = Tables<'bays'>
type Garage = Tables<'garages'>

interface ParkingSpotListProps {
  parkingSpots: ParkingSpot[]
  floors: Floor[]
  bays: Bay[]
  garages: Garage[]
}

export function ParkingSpotList({ parkingSpots, floors, bays, garages }: ParkingSpotListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [floorFilter, setFloorFilter] = useState<string>('all')
  const [bayFilter, setBayFilter] = useState<string>('all')
  const [sizeFilter, setSizeFilter] = useState<string>('all')

  const filteredSpots = useMemo(() => {
    return parkingSpots.filter(spot => {
      if (statusFilter !== 'all' && spot.status !== statusFilter) return false
      if (floorFilter !== 'all' && spot.floor_id !== floorFilter) return false
      if (bayFilter !== 'all') {
        if (bayFilter === 'none' && spot.bay_id !== null) return false
        if (bayFilter !== 'none' && spot.bay_id !== bayFilter) return false
      }
      if (sizeFilter !== 'all' && spot.size !== sizeFilter) return false
      return true
    })
  }, [parkingSpots, statusFilter, floorFilter, bayFilter, sizeFilter])

  const availableCount = parkingSpots.filter(s => s.status === 'available').length
  const occupiedCount = parkingSpots.filter(s => s.status === 'occupied').length

  const getFloorName = (floorId: string) => {
    const floor = floors.find(f => f.id === floorId)
    if (!floor) return 'Unknown'
    const garage = garages.find(g => g.id === floor.garage_id)
    return `${garage?.name || 'Unknown'} - ${floor.name}`
  }

  const getBayName = (bayId: string | null) => {
    if (!bayId) return 'No Bay'
    const bay = bays.find(b => b.id === bayId)
    return bay?.name || 'Unknown'
  }

  const getFeatures = (features: unknown) => {
    if (!features || typeof features !== 'object') return []
    const f = features as Record<string, boolean>
    const result = []
    if (f.evCharging) result.push('EV')
    if (f.handicap) result.push('Handicap')
    if (f.vip) result.push('VIP')
    if (f.covered) result.push('Covered')
    return result
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Spots</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{parkingSpots.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{availableCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Occupied</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{occupiedCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Occupancy Rate</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {parkingSpots.length > 0 ? Math.round((occupiedCount / parkingSpots.length) * 100) : 0}%
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <FormField label="Status" name="status">
            <Select
              id="status"
              name="status"
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
            </Select>
          </FormField>

          <FormField label="Floor" name="floor">
            <Select
              id="floor"
              name="floor"
              fullWidth
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
            >
              <option value="all">All Floors</option>
              {floors.map(floor => (
                <option key={floor.id} value={floor.id}>
                  {getFloorName(floor.id)}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Bay" name="bay">
            <Select
              id="bay"
              name="bay"
              fullWidth
              value={bayFilter}
              onChange={(e) => setBayFilter(e.target.value)}
            >
              <option value="all">All Bays</option>
              <option value="none">No Bay</option>
              {bays.map(bay => (
                <option key={bay.id} value={bay.id}>
                  {bay.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Size" name="size">
            <Select
              id="size"
              name="size"
              fullWidth
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="all">All Sizes</option>
              <option value="compact">Compact</option>
              <option value="standard">Standard</option>
              <option value="oversized">Oversized</option>
            </Select>
          </FormField>
        </div>

        {filteredSpots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No parking spots found matching your filters.
          </p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Spot Name</TableHeader>
                <TableHeader>Floor</TableHeader>
                <TableHeader>Bay</TableHeader>
                <TableHeader>Size</TableHeader>
                <TableHeader>Rate</TableHeader>
                <TableHeader>Features</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSpots.map(spot => (
                <TableRow key={spot.id}>
                  <TableCell className="font-medium">{spot.name}</TableCell>
                  <TableCell>{getFloorName(spot.floor_id)}</TableCell>
                  <TableCell>{getBayName(spot.bay_id)}</TableCell>
                  <TableCell className="capitalize">{spot.size}</TableCell>
                  <TableCell>${spot.rate.toFixed(2)}/hr</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {getFeatures(spot.features).map(feature => (
                        <Badge key={feature} variant="info" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={spot.status === 'available' ? 'success' : 'danger'}>
                      {spot.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ParkingSpotActions spot={spot} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </>
  )
}
