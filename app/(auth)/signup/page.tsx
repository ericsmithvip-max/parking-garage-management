'use client'

import { useActionState } from 'react'
import { signup } from '@/src/interfaces/actions/auth'
import { Button } from '@/src/components/Button'
import { Input } from '@/src/components/Input'
import { FormField } from '@/src/components/FormField'
import { LoadingSpinner } from '@/src/components/LoadingSpinner'
import Link from 'next/link'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Parking Garage Management
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a new account
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" action={formAction}>
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              {state.error}
            </div>
          )}

          <FormField label="Email address" name="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              disabled={isPending}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password" name="password" required>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              fullWidth
              disabled={isPending}
              placeholder="Enter your password"
              minLength={6}
            />
          </FormField>

          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Creating account...
              </span>
            ) : (
              'Sign up'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
