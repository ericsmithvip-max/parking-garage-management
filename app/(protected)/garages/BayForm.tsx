'use client'

import { useActionState, useEffect, useState } from 'react'
import { createBay } from '@/src/interfaces/actions/bays'
import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/Input'
import { Select } from '@/src/components/Select'
import { FormField } from '@/src/components/FormField'
import { LoadingSpinner } from '@/src/components/LoadingSpinner'
import type { Tables } from '@/supabase/types/database.types'

interface BayFormProps {
  floors: Tables<'floors'>[]
  garages: Tables<'garages'>[]
  onSuccess?: () => void
}

export function BayForm({ floors, garages, onSuccess }: BayFormProps) {
  const [selectedGarageId, setSelectedGarageId] = useState('')

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await createBay({
        floor_id: formData.get('floor_id') as string,
        name: formData.get('name') as string,
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
          onChange={(e) => setSelectedGarageId(e.target.value)}
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
        <Select id="floor_id" name="floor_id" required fullWidth disabled={isPending || !selectedGarageId}>
          <option value="">Select a floor</option>
          {availableFloors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Bay Name" name="name" required>
        <Input
          id="name"
          name="name"
          type="text"
          required
          fullWidth
          disabled={isPending}
          placeholder="e.g., Bay A, Section 1"
        />
      </FormField>

      <div className="flex gap-3 justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Creating...
            </span>
          ) : (
            'Create Bay'
          )}
        </Button>
      </div>
    </form>
  )
}
