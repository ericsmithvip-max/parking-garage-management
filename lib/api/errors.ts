/**
 * API Error Handling Module
 *
 * Provides comprehensive error handling with consistent error responses,
 * proper HTTP status codes, and security-conscious error messages.
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { PostgrestError } from '@supabase/supabase-js'

/**
 * Standard API Error Response Structure
 */
export interface ApiErrorResponse {
  error: string
  message: string
  details?: unknown
  code?: string
}

/**
 * Custom API Error class for application-specific errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Validation Error - for input validation failures
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

/**
 * Not Found Error - for resource not found scenarios
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict Error - for business logic conflicts (e.g., duplicate entries)
 */
export class ConflictError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT', details)
    this.name = 'ConflictError'
  }
}

/**
 * Database Error - for database operation failures
 */
export class DatabaseError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 500, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

/**
 * Formats Zod validation errors into user-friendly structure
 */
function formatZodError(error: ZodError): ApiErrorResponse {
  const fieldErrors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))

  return {
    error: 'Validation Error',
    message: 'Invalid request data',
    details: fieldErrors,
    code: 'VALIDATION_ERROR',
  }
}

/**
 * Formats Supabase/PostgreSQL errors into safe error responses
 */
function formatPostgrestError(error: PostgrestError): ApiErrorResponse {
  // Map common PostgreSQL error codes to user-friendly messages
  const errorMappings: Record<string, { message: string; statusCode: number }> =
    {
      '23505': {
        message: 'A record with this information already exists',
        statusCode: 409,
      },
      '23503': {
        message: 'Referenced record does not exist',
        statusCode: 400,
      },
      '23502': {
        message: 'Required field is missing',
        statusCode: 400,
      },
      '42P01': {
        message: 'Database table not found',
        statusCode: 500,
      },
    }

  const mapping = errorMappings[error.code]

  return {
    error: 'Database Error',
    message: mapping?.message || 'Database operation failed',
    code: error.code,
    // Only include details in development
    details: process.env.NODE_ENV === 'development' ? error.details : undefined,
  }
}

/**
 * Central error handler for all API routes
 *
 * Converts various error types into consistent NextResponse objects with:
 * - Appropriate HTTP status codes
 * - User-friendly error messages
 * - Security-conscious information disclosure (no stack traces in production)
 *
 * @param error - The error to handle
 * @returns NextResponse with formatted error
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Log error server-side for debugging (never expose to client)
  console.error('[API Error]', error)

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedError = formatZodError(error)
    return NextResponse.json(formattedError, { status: 400 })
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.name,
        message: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    )
  }

  // Handle Supabase/PostgreSQL errors
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const postgrestError = error as PostgrestError
    const formattedError = formatPostgrestError(postgrestError)

    // Map specific error codes to HTTP status codes
    const statusCodeMap: Record<string, number> = {
      '23505': 409, // Unique violation
      '23503': 400, // Foreign key violation
      '23502': 400, // Not null violation
    }

    const statusCode = formattedError.code
      ? (statusCodeMap[formattedError.code] ?? 500)
      : 500

    return NextResponse.json(formattedError, { status: statusCode })
  }

  // Handle generic errors
  const errorMessage =
    error instanceof Error ? error.message : 'An unexpected error occurred'

  return NextResponse.json(
    {
      error: 'Internal Server Error',
      message:
        process.env.NODE_ENV === 'development'
          ? errorMessage
          : 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  )
}

/**
 * Asserts that a value is not null/undefined, throwing NotFoundError if it is
 *
 * @param value - Value to check
 * @param resource - Resource name for error message
 * @param identifier - Optional identifier for error message
 */
export function assertFound<T>(
  value: T | null | undefined,
  resource: string,
  identifier?: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new NotFoundError(resource, identifier)
  }
}
