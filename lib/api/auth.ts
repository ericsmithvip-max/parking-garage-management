/**
 * API Authentication Utilities
 *
 * Provides authentication helpers for API route handlers
 */

import { createClient } from '@/lib/supabase/server';
import { ApiError } from './errors';
import type { User } from '@supabase/supabase-js';

/**
 * Verifies that a user is authenticated and returns their info
 *
 * @throws ApiError with 401 status if not authenticated
 * @returns User object from Supabase auth
 */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ApiError(
      'Authentication required. Please log in.',
      401,
      'UNAUTHORIZED'
    );
  }

  return user;
}

/**
 * Checks if a user is authenticated (without throwing)
 *
 * @returns User object if authenticated, null otherwise
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
