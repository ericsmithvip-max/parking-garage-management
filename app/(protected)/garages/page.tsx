import { GarageService } from '@/src/application/services/GarageService'
import { FloorService } from '@/src/application/services/FloorService'
import { BayService } from '@/src/application/services/BayService'
import { ParkingSpotService } from '@/src/application/services/ParkingSpotService'
import { GarageList } from './GarageList'

export default async function GaragesPage() {
  const garageService = new GarageService()
  const floorService = new FloorService()
  const bayService = new BayService()
  const parkingSpotService = new ParkingSpotService()

  const garages = await garageService.getAll()
  const floors = await floorService.getAll()
  const bays = await bayService.getAll()
  const parkingSpots = await parkingSpotService.getAll()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Garage Management</h1>
          <p className="text-gray-600 mt-1">
            Manage garages, floors, bays, and parking spots
          </p>
        </div>
      </div>

      <GarageList
        garages={garages}
        floors={floors}
        bays={bays}
        parkingSpots={parkingSpots}
      />
    </div>
  )
}
