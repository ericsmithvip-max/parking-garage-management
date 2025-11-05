'use client'

import { useState } from 'react'
import { Card } from '@/src/components/Card'
import { Button } from '@/src/components/Button'
import { Modal } from '@/src/components/Modal'
import { Badge } from '@/src/components/Badge'
import { GarageForm } from './GarageForm'
import { FloorForm } from './FloorForm'
import { BayForm } from './BayForm'
import { ParkingSpotForm } from './ParkingSpotForm'
import type { Tables } from '@/supabase/types/database.types'

type Garage = Tables<'garages'>
type Floor = Tables<'floors'>
type Bay = Tables<'bays'>
type ParkingSpot = Tables<'parking_spots'>

interface GarageListProps {
  garages: Garage[]
  floors: Floor[]
  bays: Bay[]
  parkingSpots: ParkingSpot[]
}

export function GarageList({ garages, floors, bays, parkingSpots }: GarageListProps) {
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false)
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false)
  const [isBayModalOpen, setIsBayModalOpen] = useState(false)
  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false)

  return (
    <>
      <div className="flex gap-4 flex-wrap mb-6">
        <Button onClick={() => setIsGarageModalOpen(true)}>
          Create Garage
        </Button>
        <Button variant="secondary" onClick={() => setIsFloorModalOpen(true)}>
          Create Floor
        </Button>
        <Button variant="secondary" onClick={() => setIsBayModalOpen(true)}>
          Create Bay
        </Button>
        <Button variant="secondary" onClick={() => setIsSpotModalOpen(true)}>
          Create Parking Spot
        </Button>
      </div>

      <div className="space-y-6">
        {garages.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">
              No garages found. Create your first garage to get started.
            </p>
          </Card>
        ) : (
          garages.map((garage) => {
            const garageFloors = floors.filter(f => f.garage_id === garage.id)

            return (
              <Card key={garage.id} className="overflow-hidden">
                <div className="p-6 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{garage.name}</h2>
                      <p className="text-gray-600 mt-1">{garage.location}</p>
                    </div>
                    <Badge variant="info">
                      {garageFloors.length} {garageFloors.length === 1 ? 'Floor' : 'Floors'}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {garageFloors.length === 0 ? (
                    <p className="text-gray-500 text-sm">No floors in this garage yet.</p>
                  ) : (
                    garageFloors.map((floor) => {
                      const floorBays = bays.filter(b => b.floor_id === floor.id)
                      const floorSpots = parkingSpots.filter(s => s.floor_id === floor.id)
                      const availableSpots = floorSpots.filter(s => s.status === 'available').length

                      return (
                        <div key={floor.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{floor.name}</h3>
                            <div className="flex gap-2">
                              <Badge variant="default">
                                {floorBays.length} {floorBays.length === 1 ? 'Bay' : 'Bays'}
                              </Badge>
                              <Badge variant={availableSpots > 0 ? 'success' : 'danger'}>
                                {availableSpots}/{floorSpots.length} Available
                              </Badge>
                            </div>
                          </div>

                          {floorBays.length > 0 && (
                            <div className="space-y-2 ml-4">
                              {floorBays.map((bay) => {
                                const baySpots = parkingSpots.filter(s => s.bay_id === bay.id)
                                const bayAvailable = baySpots.filter(s => s.status === 'available').length

                                return (
                                  <div key={bay.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                    <span className="text-sm font-medium text-gray-700">{bay.name}</span>
                                    <Badge variant={bayAvailable > 0 ? 'success' : 'danger'} className="text-xs">
                                      {bayAvailable}/{baySpots.length}
                                    </Badge>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {floorSpots.filter(s => !s.bay_id).length > 0 && (
                            <div className="mt-3 ml-4">
                              <p className="text-sm text-gray-600">
                                {floorSpots.filter(s => !s.bay_id).length} spot(s) without bay assignment
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>

      <Modal
        isOpen={isGarageModalOpen}
        onClose={() => setIsGarageModalOpen(false)}
        title="Create New Garage"
      >
        <GarageForm onSuccess={() => setIsGarageModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isFloorModalOpen}
        onClose={() => setIsFloorModalOpen(false)}
        title="Create New Floor"
      >
        <FloorForm garages={garages} onSuccess={() => setIsFloorModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isBayModalOpen}
        onClose={() => setIsBayModalOpen(false)}
        title="Create New Bay"
      >
        <BayForm floors={floors} garages={garages} onSuccess={() => setIsBayModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isSpotModalOpen}
        onClose={() => setIsSpotModalOpen(false)}
        title="Create New Parking Spot"
      >
        <ParkingSpotForm
          floors={floors}
          bays={bays}
          garages={garages}
          onSuccess={() => setIsSpotModalOpen(false)}
        />
      </Modal>
    </>
  )
}
