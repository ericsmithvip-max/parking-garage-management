/**
 * Error Mapping Utilities
 *
 * Maps domain and infrastructure errors to HTTP responses
 */

import { ApiError, ValidationError, NotFoundError, ConflictError, DatabaseError } from '@/lib/api/errors'

/**
 * Maps domain errors to ApiError instances
 */
export function mapDomainError(error: Error): ApiError {
  const message = error.message.toLowerCase()

  if (message.includes('not found')) {
    return new NotFoundError('Resource')
  }

  if (message.includes('already exists') || message.includes('duplicate')) {
    return new ConflictError(error.message)
  }

  if (
    message.includes('required') ||
    message.includes('invalid') ||
    message.includes('must be') ||
    message.includes('cannot')
  ) {
    return new ValidationError(error.message)
  }

  return new ApiError(error.message, 400, 'DOMAIN_ERROR')
}

/**
 * Maps repository/infrastructure errors to ApiError instances
 */
export function mapInfrastructureError(error: Error): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error.message.includes('database')) {
    return new DatabaseError(error.message)
  }

  return new ApiError('An unexpected error occurred', 500, 'INTERNAL_ERROR')
}
