'use client'

import { useState } from 'react'
import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/Input'
import { Select } from '@/src/components/Select'
import { FormField } from '@/src/components/FormField'
import { Badge } from '@/src/components/Badge'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/src/components/Table'
import { findCarByLicensePlate, checkInCar, checkOutCar } from '@/src/interfaces/actions/cars'
import type { Tables } from '@/supabase/types/database.types'

type Car = Tables<'cars'>
type ParkingSpot = Tables<'parking_spots'>
type Floor = Tables<'floors'>
type Garage = Tables<'garages'>

interface CarTrackingProps {
  cars: Car[]
  allParkingSpots: ParkingSpot[]
  availableSpots: ParkingSpot[]
  floors: Floor[]
  garages: Garage[]
}

export function CarTracking({ cars, allParkingSpots, availableSpots, floors, garages }: CarTrackingProps) {
  const [searchLicense, setSearchLicense] = useState('')
  const [searchResult, setSearchResult] = useState<Car | null>(null)
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [checkInLicense, setCheckInLicense] = useState('')
  const [checkInSpot, setCheckInSpot] = useState('')
  const [checkInError, setCheckInError] = useState('')
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const [checkOutCarId, setCheckOutCarId] = useState('')
  const [checkOutError, setCheckOutError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const checkedInCars = cars.filter(c => c.checkedin_at && !c.checkedout_at && c.parking_spot_id)
  const recentHistory = cars
    .filter(c => c.checkedout_at)
    .sort((a, b) => new Date(b.checkedout_at!).getTime() - new Date(a.checkedout_at!).getTime())
    .slice(0, 10)

  const handleSearch = async () => {
    setIsSearching(true)
    setSearchError('')
    setSearchResult(null)

    const result = await findCarByLicensePlate(searchLicense)
    if (result.success && result.data) {
      setSearchResult(result.data)
    } else {
      setSearchError(result.error || 'Car not found')
    }
    setIsSearching(false)
  }

  const handleCheckIn = async () => {
    if (!checkInLicense || !checkInSpot) {
      setCheckInError('Please enter license plate and select a parking spot')
      return
    }

    setIsCheckingIn(true)
    setCheckInError('')

    const result = await checkInCar(checkInLicense, checkInSpot)
    if (result.success) {
      setCheckInLicense('')
      setCheckInSpot('')
      window.location.reload()
    } else {
      setCheckInError(result.error || 'Failed to check in car')
    }
    setIsCheckingIn(false)
  }

  const handleCheckOut = async () => {
    if (!checkOutCarId) {
      setCheckOutError('Please select a car to check out')
      return
    }

    setIsCheckingOut(true)
    setCheckOutError('')

    const result = await checkOutCar(checkOutCarId)
    if (result.success) {
      setCheckOutCarId('')
      window.location.reload()
    } else {
      setCheckOutError(result.error || 'Failed to check out car')
    }
    setIsCheckingOut(false)
  }

  const getFloorName = (floorId: string) => {
    const floor = floors.find(f => f.id === floorId)
    if (!floor) return 'Unknown'
    const garage = garages.find(g => g.id === floor.garage_id)
    return `${garage?.name || 'Unknown'} - ${floor.name}`
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Currently Parked</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{checkedInCars.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Available Spots</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{availableSpots.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Vehicles</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{cars.length}</p>
          </div>
        </Card>
      </div>

      <Card title="Search Car by License Plate">
        <div className="space-y-4">
          <div className="flex gap-3">
            <FormField label="License Plate" name="search" className="flex-1">
              <Input
                id="search"
                name="search"
                type="text"
                fullWidth
                value={searchLicense}
                onChange={(e) => setSearchLicense(e.target.value)}
                placeholder="ABC123"
                disabled={isSearching}
              />
            </FormField>
            <div className="self-end">
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {searchError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {searchError}
            </div>
          )}

          {searchResult && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Car Found</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">License Plate:</span>
                  <span className="ml-2 font-medium">{searchResult.license_plate_number}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2">
                    <Badge variant={searchResult.checkedin_at && !searchResult.checkedout_at ? 'success' : 'default'}>
                      {searchResult.checkedin_at && !searchResult.checkedout_at ? 'Checked In' : 'Checked Out'}
                    </Badge>
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Check-in:</span>
                  <span className="ml-2">{formatDateTime(searchResult.checkedin_at)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Check-out:</span>
                  <span className="ml-2">{formatDateTime(searchResult.checkedout_at)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title="Check-In Vehicle">
        <div className="space-y-4">
          <FormField label="License Plate" name="checkin_license" required>
            <Input
              id="checkin_license"
              name="checkin_license"
              type="text"
              fullWidth
              value={checkInLicense}
              onChange={(e) => setCheckInLicense(e.target.value)}
              placeholder="ABC123"
              disabled={isCheckingIn}
            />
          </FormField>

          <FormField label="Select Parking Spot" name="checkin_spot" required>
            <Select
              id="checkin_spot"
              name="checkin_spot"
              fullWidth
              value={checkInSpot}
              onChange={(e) => setCheckInSpot(e.target.value)}
              disabled={isCheckingIn}
            >
              <option value="">Select an available spot</option>
              {availableSpots.map(spot => (
                <option key={spot.id} value={spot.id}>
                  {spot.name} - {getFloorName(spot.floor_id)} (${spot.rate}/hr)
                </option>
              ))}
            </Select>
          </FormField>

          {checkInError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {checkInError}
            </div>
          )}

          <Button onClick={handleCheckIn} disabled={isCheckingIn}>
            {isCheckingIn ? 'Checking In...' : 'Check In Vehicle'}
          </Button>
        </div>
      </Card>

      <Card title="Check-Out Vehicle">
        <div className="space-y-4">
          <FormField label="Select Vehicle" name="checkout_car" required>
            <Select
              id="checkout_car"
              name="checkout_car"
              fullWidth
              value={checkOutCarId}
              onChange={(e) => setCheckOutCarId(e.target.value)}
              disabled={isCheckingOut}
            >
              <option value="">Select a checked-in vehicle</option>
              {checkedInCars.map(car => {
                const spot = allParkingSpots.find(s => s.id === car.parking_spot_id)
                const spotName = spot ? spot.name : 'Unknown Spot'
                return (
                  <option key={car.id} value={car.id}>
                    {car.license_plate_number} - Spot: {spotName} (Checked in: {formatDateTime(car.checkedin_at)})
                  </option>
                )
              })}
            </Select>
          </FormField>

          {checkOutError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {checkOutError}
            </div>
          )}

          <Button onClick={handleCheckOut} disabled={isCheckingOut} variant="secondary">
            {isCheckingOut ? 'Checking Out...' : 'Check Out Vehicle'}
          </Button>
        </div>
      </Card>

      <Card title="Recent Check-Out History">
        {recentHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No check-out history yet.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>License Plate</TableHeader>
                <TableHeader>Check-In</TableHeader>
                <TableHeader>Check-Out</TableHeader>
                <TableHeader>Duration</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentHistory.map(car => {
                const checkIn = new Date(car.checkedin_at!)
                const checkOut = new Date(car.checkedout_at!)
                const durationMs = checkOut.getTime() - checkIn.getTime()
                const hours = Math.floor(durationMs / (1000 * 60 * 60))
                const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

                return (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium">{car.license_plate_number}</TableCell>
                    <TableCell>{formatDateTime(car.checkedin_at)}</TableCell>
                    <TableCell>{formatDateTime(car.checkedout_at)}</TableCell>
                    <TableCell>{hours}h {minutes}m</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
