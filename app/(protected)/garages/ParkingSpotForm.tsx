'use client'

import { useActionState, useEffect, useState } from 'react'
import { createParkingSpot } from '@/src/interfaces/actions/parking-spots'
import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/Input'
import { Select } from '@/src/components/Select'
import { FormField } from '@/src/components/FormField'
import { LoadingSpinner } from '@/src/components/LoadingSpinner'
import type { Tables } from '@/supabase/types/database.types'

interface ParkingSpotFormProps {
  floors: Tables<'floors'>[]
  bays: Tables<'bays'>[]
  garages: Tables<'garages'>[]
  onSuccess?: () => void
}

export function ParkingSpotForm({ floors, bays, garages, onSuccess }: ParkingSpotFormProps) {
  const [selectedGarageId, setSelectedGarageId] = useState('')
  const [selectedFloorId, setSelectedFloorId] = useState('')
  const [features, setFeatures] = useState({
    evCharging: false,
    handicap: false,
    vip: false,
    covered: false,
  })

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const bayId = formData.get('bay_id') as string
      const featuresData = {
        evCharging: formData.get('evCharging') === 'on',
        handicap: formData.get('handicap') === 'on',
        vip: formData.get('vip') === 'on',
        covered: formData.get('covered') === 'on',
      }

      const result = await createParkingSpot({
        floor_id: formData.get('floor_id') as string,
        bay_id: bayId || null,
        name: formData.get('name') as string,
        size: formData.get('size') as string,
        status: 'available',
        rate: parseFloat(formData.get('rate') as string),
        features: featuresData,
      })
      return result
    },
    null
  )

  useEffect(() => {
    if (state?.success) {
      onSuccess?.()
    }
  }, [state?.success, onSuccess])

  const availableFloors = selectedGarageId
    ? floors.filter(f => f.garage_id === selectedGarageId)
    : []

  const availableBays = selectedFloorId
    ? bays.filter(b => b.floor_id === selectedFloorId)
    : []

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
          {state.error}
        </div>
      )}

      <FormField label="Garage" name="garage_select" required>
        <Select
          id="garage_select"
          name="garage_select"
          required
          fullWidth
          disabled={isPending}
          value={selectedGarageId}
          onChange={(e) => {
            setSelectedGarageId(e.target.value)
            setSelectedFloorId('')
          }}
        >
          <option value="">Select a garage</option>
          {garages.map((garage) => (
            <option key={garage.id} value={garage.id}>
              {garage.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Floor" name="floor_id" required>
        <Select
          id="floor_id"
          name="floor_id"
          required
          fullWidth
          disabled={isPending || !selectedGarageId}
          value={selectedFloorId}
          onChange={(e) => setSelectedFloorId(e.target.value)}
        >
          <option value="">Select a floor</option>
          {availableFloors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Bay (Optional)" name="bay_id">
        <Select id="bay_id" name="bay_id" fullWidth disabled={isPending || !selectedFloorId}>
          <option value="">No bay assignment</option>
          {availableBays.map((bay) => (
            <option key={bay.id} value={bay.id}>
              {bay.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Spot Name" name="name" required>
        <Input
          id="name"
          name="name"
          type="text"
          required
          fullWidth
          disabled={isPending}
          placeholder="e.g., A-101"
        />
      </FormField>

      <FormField label="Size" name="size" required>
        <Select id="size" name="size" required fullWidth disabled={isPending}>
          <option value="">Select size</option>
          <option value="compact">Compact</option>
          <option value="standard">Standard</option>
          <option value="oversized">Oversized</option>
        </Select>
      </FormField>

      <FormField label="Hourly Rate ($)" name="rate" required>
        <Input
          id="rate"
          name="rate"
          type="number"
          step="0.01"
          min="0"
          required
          fullWidth
          disabled={isPending}
          placeholder="5.00"
        />
      </FormField>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Features</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="evCharging"
              checked={features.evCharging}
              onChange={(e) => setFeatures({ ...features, evCharging: e.target.checked })}
              disabled={isPending}
              className="rounded border-gray-300"
            />
            <span className="text-sm">EV Charging</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="handicap"
              checked={features.handicap}
              onChange={(e) => setFeatures({ ...features, handicap: e.target.checked })}
              disabled={isPending}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Handicap Accessible</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="vip"
              checked={features.vip}
              onChange={(e) => setFeatures({ ...features, vip: e.target.checked })}
              disabled={isPending}
              className="rounded border-gray-300"
            />
            <span className="text-sm">VIP</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="covered"
              checked={features.covered}
              onChange={(e) => setFeatures({ ...features, covered: e.target.checked })}
              disabled={isPending}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Covered</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Creating...
            </span>
          ) : (
            'Create Parking Spot'
          )}
        </Button>
      </div>
    </form>
  )
}
