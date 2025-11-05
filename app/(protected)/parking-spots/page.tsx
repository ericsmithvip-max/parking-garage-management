import { ParkingSpotService } from '@/src/application/services/ParkingSpotService'
import { FloorService } from '@/src/application/services/FloorService'
import { BayService } from '@/src/application/services/BayService'
import { GarageService } from '@/src/application/services/GarageService'
import { ParkingSpotList } from './ParkingSpotList'

export default async function ParkingSpotsPage() {
  const parkingSpotService = new ParkingSpotService()
  const floorService = new FloorService()
  const bayService = new BayService()
  const garageService = new GarageService()

  const parkingSpots = await parkingSpotService.getAll()
  const floors = await floorService.getAll()
  const bays = await bayService.getAll()
  const garages = await garageService.getAll()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parking Spot Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage parking spot availability
          </p>
        </div>
      </div>

      <ParkingSpotList
        parkingSpots={parkingSpots}
        floors={floors}
        bays={bays}
        garages={garages}
      />
    </div>
  )
}
