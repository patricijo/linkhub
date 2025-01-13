'use client'
import { User } from '@/payload-types'
import React, { createContext, useContext, ReactNode } from 'react'

// Define the shape of the context data
interface UserContextType {
  user: User | null
}

// Create the context with a default value of `undefined`
const UserContext = createContext<UserContextType | undefined>(undefined)

// Create a custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Create the provider component
export const UserProvider = ({ children, user }: { children: ReactNode; user: User | null }) => {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
}
