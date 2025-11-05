import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/supabase/types/database.types';

/**
 * Supabase middleware for handling authentication in Next.js middleware
 * This ensures auth state is properly maintained across requests
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - handle case where no session exists
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // No valid session - this is expected for unauthenticated users
  }

  // API routes - allow GET requests without authentication, others require auth
  if (!user && request.nextUrl.pathname.startsWith('/api/')) {
    // Only block non-GET requests when not authenticated
    if (request.method !== 'GET') {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }
    // Allow GET requests to proceed
    return supabaseResponse;
  }

  // Protected page routes - redirect to login if not authenticated
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.startsWith('/api/') &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.startsWith('/favicon')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access login/signup, redirect to garages
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/garages';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
