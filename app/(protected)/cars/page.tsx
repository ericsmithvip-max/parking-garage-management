import { CarService } from '@/src/application/services/CarService'
import { ParkingSpotService } from '@/src/application/services/ParkingSpotService'
import { FloorService } from '@/src/application/services/FloorService'
import { GarageService } from '@/src/application/services/GarageService'
import { CarTracking } from './CarTracking'

export default async function CarsPage() {
  const carService = new CarService()
  const parkingSpotService = new ParkingSpotService()
  const floorService = new FloorService()
  const garageService = new GarageService()

  const cars = await carService.getAll()
  const parkingSpots = await parkingSpotService.getAll()
  const floors = await floorService.getAll()
  const garages = await garageService.getAll()

  const availableSpots = parkingSpots.filter(s => s.status === 'available')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Car Tracking</h1>
          <p className="text-gray-600 mt-1">
            Check in and check out vehicles, and track parking history
          </p>
        </div>
      </div>

      <CarTracking
        cars={cars}
        availableSpots={availableSpots}
        floors={floors}
        garages={garages}
      />
    </div>
  )
}
