'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { User } from '@/payload-types'
import type { Payload } from 'payload'

type AuthParams = {
  email: string
  password: string
}

type AuthResponse = {
  success: boolean
  error?: string
}

type Result = {
  exp?: number
  token?: string
  user?: User
}

export async function login({ email, password }: AuthParams): Promise<AuthResponse> {
  const payload = await getPayload({ config })

  try {
    const result: Result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      })
      return { success: true }
    } else {
      return { success: false, error: 'Invalid credentials' }
    }
  } catch (error) {
    console.error('Login error', error)
    return { success: false, error: 'The email or password provided is incorrect.' }
  }
}

export async function signUp({ email, password }: AuthParams): Promise<AuthResponse> {
  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'users',
      data: { email, password },
    })

    const response: AuthResponse = await login({ email, password })

    if (response.success) {
      return { success: true }
    } else {
      return { success: false, error: 'An error occurred while Login.' }
    }
  } catch (error) {
    console.error('Login error', error)
    return { success: false, error: 'Signup failed' }
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('payload-token') // Deletes the HTTP-only cookie

    return { success: true } // Indicate success
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'An error occurred during logout' }
  }
}

export async function getUser(): Promise<User | null> {
  const headers = await getHeaders()
  const payload: Payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  return user || null
}
