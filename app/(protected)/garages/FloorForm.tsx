'use client'

import { useActionState, useEffect } from 'react'
import { createFloor } from '@/src/interfaces/actions/floors'
import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/Input'
import { Select } from '@/src/components/Select'
import { FormField } from '@/src/components/FormField'
import { LoadingSpinner } from '@/src/components/LoadingSpinner'
import type { Tables } from '@/supabase/types/database.types'

interface FloorFormProps {
  garages: Tables<'garages'>[]
  onSuccess?: () => void
}

export function FloorForm({ garages, onSuccess }: FloorFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await createFloor({
        garage_id: formData.get('garage_id') as string,
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

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
          {state.error}
        </div>
      )}

      <FormField label="Garage" name="garage_id" required>
        <Select id="garage_id" name="garage_id" required fullWidth disabled={isPending}>
          <option value="">Select a garage</option>
          {garages.map((garage) => (
            <option key={garage.id} value={garage.id}>
              {garage.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Floor Name" name="name" required>
        <Input
          id="name"
          name="name"
          type="text"
          required
          fullWidth
          disabled={isPending}
          placeholder="e.g., Ground Floor, Level 1"
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
            'Create Floor'
          )}
        </Button>
      </div>
    </form>
  )
}
