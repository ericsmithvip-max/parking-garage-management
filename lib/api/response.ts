/**
 * API Response Utilities
 *
 * Provides helper functions for creating consistent, well-structured API responses
 * with proper HTTP status codes and optional metadata.
 */

import { NextResponse } from 'next/server'

/**
 * Standard success response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

/**
 * Creates a successful response with data
 *
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @param meta - Optional metadata (pagination, etc.)
 * @returns NextResponse with formatted success response
 */
export function apiSuccess<T>(
  data: T,
  status: number = 200,
  meta?: PaginationMeta
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      data,
      ...(meta && { meta }),
    },
    { status }
  )
}

/**
 * Creates a successful response for resource creation (201 Created)
 *
 * @param data - Created resource data
 * @param resourceUrl - Optional URL of the created resource
 * @returns NextResponse with 201 status
 */
export function apiCreated<T>(
  data: T,
  resourceUrl?: string
): NextResponse<ApiSuccessResponse<T>> {
  const headers = resourceUrl ? { Location: resourceUrl } : undefined
  return NextResponse.json({ data }, { status: 201, headers })
}

/**
 * Creates a successful response with no content (204 No Content)
 *
 * @returns NextResponse with 204 status and no body
 */
export function apiNoContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Helper to calculate pagination metadata
 *
 * @param total - Total number of items
 * @param page - Current page (1-indexed)
 * @param limit - Items per page
 * @returns Pagination metadata object
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    total,
    page,
    limit,
    hasMore: page * limit < total,
  }
}

/**
 * Parses pagination query parameters with validation
 *
 * @param searchParams - URL search parameters
 * @returns Validated page and limit values
 */
export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number
  limit: number
  offset: number
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '20', 10))
  )
  const offset = (page - 1) * limit

  return { page, limit, offset }
}
