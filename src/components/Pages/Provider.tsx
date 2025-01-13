'use client'
import { Page } from '@/payload-types'
import React, { createContext, useContext, ReactNode } from 'react'

// Define the shape of the context data
interface PagesContextType {
  pages: Page[]
}

// Create the context with a default value of `undefined`
const PagesContext = createContext<PagesContextType | undefined>(undefined)

// Create a custom hook to use the context
export const usePages = (): PagesContextType => {
  const context = useContext(PagesContext)
  if (!context) {
    throw new Error('usePages must be used within a PagesProvider')
  }
  return context
}

// Create the provider component
export const PagesProvider = ({ children, pages }: { children: ReactNode; pages: Page[] }) => {
  return <PagesContext.Provider value={{ pages }}>{children}</PagesContext.Provider>
}
