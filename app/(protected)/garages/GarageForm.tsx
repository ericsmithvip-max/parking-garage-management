'use client'

import { useActionState } from 'react'
import { createGarage } from '@/src/interfaces/actions/garages'
import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/Input'
import { FormField } from '@/src/components/FormField'
import { LoadingSpinner } from '@/src/components/LoadingSpinner'
import { useEffect } from 'react'

interface GarageFormProps {
  onSuccess?: () => void
}

export function GarageForm({ onSuccess }: GarageFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await createGarage({
        name: formData.get('name') as string,
        location: formData.get('location') as string,
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

      <FormField label="Garage Name" name="name" required>
        <Input
          id="name"
          name="name"
          type="text"
          required
          fullWidth
          disabled={isPending}
          placeholder="e.g., Downtown Parking"
        />
      </FormField>

      <FormField label="Location" name="location" required>
        <Input
          id="location"
          name="location"
          type="text"
          required
          fullWidth
          disabled={isPending}
          placeholder="e.g., 123 Main St"
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
            'Create Garage'
          )}
        </Button>
      </div>
    </form>
  )
}
