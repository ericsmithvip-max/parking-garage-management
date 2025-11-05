/**
 * API Validation Utilities using Zod v3+
 *
 * Provides shared validation helpers for request validation across APIs
 */

import { z } from 'zod'
import { ValidationError } from './errors'

/**
 * Validates request body against a Zod schema
 * Throws ValidationError if validation fails
 */
export function validateRequestBody<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new ValidationError('Invalid request body', result.error.issues)
  }

  return result.data
}

/**
 * Validates query parameters against a Zod schema
 * Throws ValidationError if validation fails
 */
export function validateQueryParams<T extends z.ZodType>(
  schema: T,
  params: URLSearchParams
): z.infer<T> {
  const obj = Object.fromEntries(params.entries())
  const result = schema.safeParse(obj)

  if (!result.success) {
    throw new ValidationError('Invalid query parameters', result.error.issues)
  }

  return result.data
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  uuid: z.string().uuid(),
  positiveNumber: z.number().positive(),
  nonEmptyString: z.string().min(1).trim(),
  optionalString: z.string().trim().optional(),
  email: z.string().email(),
  timestamp: z.string().datetime(),
}

/**
 * Parse and validate UUID from params
 */
export function validateUuid(id: string, fieldName = 'id'): string {
  const result = commonSchemas.uuid.safeParse(id)

  if (!result.success) {
    throw new ValidationError(`Invalid ${fieldName}: must be a valid UUID`)
  }

  return result.data
}
