'use server'

/**
 * Authentication Server Actions
 *
 * Server actions for user authentication with Supabase
 */

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logError, logInfo } from '@/lib/logger'

export async function login(_prevState: unknown, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      logError(error, { action: 'login', email })
      return { success: false, error: error.message }
    }

    logInfo('User logged in', { email })
    revalidatePath('/', 'layout')
  } catch (error) {
    logError(error, { action: 'login' })
    return { success: false, error: 'An unexpected error occurred' }
  }

  redirect('/garages')
}

export async function signup(_prevState: unknown, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      logError(error, { action: 'signup', email })
      return { success: false, error: error.message }
    }

    logInfo('User signed up', { email })
    revalidatePath('/', 'layout')
  } catch (error) {
    logError(error, { action: 'signup' })
    return { success: false, error: 'An unexpected error occurred' }
  }

  redirect('/garages')
}

export async function logout() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      logError(error, { action: 'logout' })
      return { success: false, error: error.message }
    }

    logInfo('User logged out')
    revalidatePath('/', 'layout')
  } catch (error) {
    logError(error, { action: 'logout' })
    return { success: false, error: 'An unexpected error occurred' }
  }

  redirect('/login')
}

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: user }
  } catch (error) {
    logError(error, { action: 'getUser' })
    return { success: false, error: 'Failed to get user' }
  }
}
